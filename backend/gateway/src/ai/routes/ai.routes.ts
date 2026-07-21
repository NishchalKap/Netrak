import { Router } from 'express';
import multer from 'multer';
import { transcribeAudio } from '../controllers/ai-speech.controller';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max
  }
});

// Speech Intelligence
router.post('/speech/transcribe', upload.single('file'), transcribeAudio);

// Placeholders for other AI domain routes
// router.post('/vision/analyze', ...);
// router.post('/threat/classify', ...);
// router.post('/entity/extract', ...);

export default router;
