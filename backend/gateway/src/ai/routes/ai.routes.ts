import { Router } from 'express';
import multer from 'multer';
import { transcribeAudio } from '../controllers/ai-speech.controller';
import { chat, summarizeCase, extractEntities } from '../controllers/ai-llm.controller';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max
  }
});

// Speech Intelligence
router.post('/speech/transcribe', upload.single('file'), transcribeAudio);

// LLM Endpoints
router.post('/chat', chat);
router.post('/summarize', summarizeCase);
router.post('/entities', extractEntities);

export default router;
