import { NextFunction, Response } from 'express';
import { sendSuccess } from '../common/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { StorageService } from '../services/storage.service';

export class StorageController {
  private storageService = new StorageService();

  createUploadUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.storageService.prepareUpload(req.body, req.user!.id);
      sendSuccess(res, data, 'Signed upload URL created');
    } catch (error) {
      next(error);
    }
  };
}
