import { AppError } from '../common/AppError';
import { env } from '../config/env';

export type StorageObjectKind = 'evidence' | 'image' | 'document';

export interface StorageUploadRequest {
  kind: StorageObjectKind;
  objectPath: string;
  contentType: string;
}

export interface StorageUploadTarget {
  provider: 'supabase';
  bucket: string;
  objectPath: string;
  contentType: string;
  uploadUrl: string;
  token: string;
}

/**
 * The only boundary future file-upload workflows should use. Controllers must
 * delegate upload preparation here so provider credentials stay server-side.
 */
export class StorageService {
  isConfigured() {
    return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_STORAGE_BUCKET);
  }

  async prepareUpload(request: StorageUploadRequest, userId: string): Promise<StorageUploadTarget> {
    if (!this.isConfigured()) {
      throw new AppError('Evidence storage is not configured for this deployment', 503);
    }

    if (!isSafeObjectPath(request.objectPath)) {
      throw new AppError('Storage object path is invalid', 400);
    }

    const objectPath = `${request.kind}/${userId}/${request.objectPath}`;
    const endpoint = new URL(`/storage/v1/object/upload/sign/${encodeURIComponent(env.SUPABASE_STORAGE_BUCKET!)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`, env.SUPABASE_URL).toString();
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY!}`,
          apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new AppError('Evidence storage is unavailable', 503);
    }

    if (!response.ok) throw new AppError('Evidence storage could not create an upload URL', 503);
    const payload = await response.json() as { url?: string; token?: string };
    if (!payload.url || !payload.token) throw new AppError('Evidence storage returned an invalid upload URL', 503);

    return {
      provider: 'supabase',
      bucket: env.SUPABASE_STORAGE_BUCKET!,
      objectPath,
      contentType: request.contentType,
      uploadUrl: new URL(`/storage/v1${payload.url}`, env.SUPABASE_URL).toString(),
      token: payload.token,
    };
  }
}

function isSafeObjectPath(value: string) {
  return value.length > 0
    && value.length <= 1024
    && !value.startsWith('/')
    && !value.split('/').some((segment) => segment === '..' || segment.length === 0)
    && Array.from(value).every((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127);
}
