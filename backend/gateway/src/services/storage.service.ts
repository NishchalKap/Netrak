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
}

/**
 * The only boundary future file-upload workflows should use. Controllers must
 * delegate upload preparation here so provider credentials stay server-side.
 */
export class StorageService {
  isConfigured() {
    return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_STORAGE_BUCKET);
  }

  async prepareUpload(request: StorageUploadRequest): Promise<StorageUploadTarget> {
    if (!this.isConfigured()) {
      throw new AppError('Evidence storage is not configured for this deployment', 503);
    }

    if (!isSafeObjectPath(request.objectPath)) {
      throw new AppError('Storage object path is invalid', 400);
    }

    // Supabase signed-upload URL creation belongs here when the storage client
    // is enabled; keeping the integration point centralized avoids controllers
    // accessing provider credentials or SDKs directly.
    throw new AppError('Supabase Storage upload integration is not enabled for this deployment', 501);
  }
}

function isSafeObjectPath(value: string) {
  return value.length > 0
    && value.length <= 1024
    && !value.startsWith('/')
    && !value.split('/').some((segment) => segment === '..' || segment.length === 0)
    && Array.from(value).every((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127);
}
