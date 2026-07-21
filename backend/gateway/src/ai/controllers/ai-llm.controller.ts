import { Request, Response, NextFunction } from 'express';
import { llmService } from '../services/llm.service';
import { sendSuccess } from '../../common/response';
import { AppError } from '../../common/AppError';
import { prisma } from '../../database/prisma';
import { logger } from '../../common/logger';
import { z } from 'zod';

// Zod schemas for request validation
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'model', 'system']),
    content: z.string().min(1)
  })),
  model: z.string().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().int().optional(),
  caseId: z.string().optional()
});

const SummarizeRequestSchema = z.object({
  caseId: z.string()
});

const EntitiesRequestSchema = z.object({
  caseId: z.string()
});

/**
 * @openapi
 * /api/ai/chat:
 *   post:
 *     tags:
 *       - AI
 *     summary: Chat with the AI officer copilot
 *     description: Send messages to the AI copilot. If a caseId is provided, loads case context.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, model, system]
 *                     content:
 *                       type: string
 *               caseId:
 *                 type: string
 *                 description: Optional case ID to load context
 *               model:
 *                 type: string
 *                 description: Optional model override
 *               temperature:
 *                 type: number
 *                 description: Optional temperature
 *               maxTokens:
 *                 type: integer
 *                 description: Optional max tokens
 *     responses:
 *       200:
 *         description: Chat response
 *       400:
 *         description: Invalid request
 *       500:
 *         description: LLM error
 */
export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ChatRequestSchema.parse(req.body);
    let systemPrompt = '';
    let context = '';

    if (validated.caseId) {
      // Load case context
      const caseData = await prisma.case.findUnique({
        where: { id: validated.caseId },
        include: {
          evidence: true,
          timeline: true
        }
      });

      if (caseData) {
        // Load transcriptions with referenceId = caseId
        const transcriptions = await prisma.transcription.findMany({
          where: { referenceId: validated.caseId }
        });

        context = `Case Context:
Case Title: ${caseData.title}
Case Description: ${caseData.description}

Timeline Events:
${caseData.timeline.map(t => `- ${t.title}: ${t.detail}`).join('\n')}

Evidence:
${caseData.evidence.map(e => `- ${e.type}: ${e.label} (${e.reference})`).join('\n')}

Transcriptions:
${transcriptions.map(t => `- ${t.text}`).join('\n') || 'None'}`;
      }
    }

    const messages = [...validated.messages];
    if (context) {
      // Prepend system prompt with context
      messages.unshift({
        role: 'system',
        content: `You are a helpful police investigation assistant. Use the following case context when answering questions:\n\n${context}`
      });
    }

    const result = await llmService.generate({
      messages,
      model: validated.model,
      temperature: validated.temperature,
      maxTokens: validated.maxTokens
    }, validated.caseId);

    return sendSuccess(res, result, 'Chat response generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/ai/summarize:
 *   post:
 *     tags:
 *       - AI
 *     summary: Generate a case summary
 *     description: Generate an executive summary, timeline, key risks, and recommended next steps for a case.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caseId:
 *                 type: string
 *                 description: ID of the case to summarize
 *     responses:
 *       200:
 *         description: Case summary
 *       400:
 *         description: Invalid request
 *       500:
 *         description: LLM or database error
 */
export const summarizeCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = SummarizeRequestSchema.parse(req.body);

    const caseData = await prisma.case.findUnique({
      where: { id: validated.caseId },
      include: {
        evidence: true,
        timeline: true
      }
    });

    if (!caseData) {
      throw new AppError('Case not found', 404);
    }

    const transcriptions = await prisma.transcription.findMany({
      where: { referenceId: validated.caseId }
    });

    const context = `Case Title: ${caseData.title}
Case Description: ${caseData.description}

Timeline Events:
${caseData.timeline.map(t => `- ${t.createdAt.toISOString()}: ${t.title} - ${t.detail}`).join('\n')}

Evidence:
${caseData.evidence.map(e => `- [${e.type}] ${e.label}: ${e.notes || 'No notes'}`).join('\n')}

Transcriptions:
${transcriptions.map(t => `- ${t.text}`).join('\n') || 'No transcriptions available'}`;

    const prompt = `Please summarize this police investigation case. Provide the following sections:
1. Executive Summary
2. Timeline of Key Events
3. Key Risks
4. Recommended Next Steps

Here is the case data:
${context}`;

    const result = await llmService.generate({
      messages: [{ role: 'user', content: prompt }]
    }, validated.caseId);

    // Save to AIResult
    try {
      await prisma.aIResult.create({
        data: {
          provider: 'gemini',
          serviceType: 'summary',
          inputRef: validated.caseId,
          output: JSON.parse(JSON.stringify(result))
        }
      });
    } catch (dbErr) {
      logger.warn('Failed to save summary to AIResult', { dbErr });
    }

    return sendSuccess(res, result, 'Case summary generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/ai/entities:
 *   post:
 *     tags:
 *       - AI
 *     summary: Extract entities from a case
 *     description: Extract person names, phone numbers, emails, bank accounts, UPI IDs, vehicle numbers, addresses, URLs, IPs, dates, and locations from a case.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caseId:
 *                 type: string
 *                 description: ID of the case to extract entities from
 *     responses:
 *       200:
 *         description: Entities extracted
 *       400:
 *         description: Invalid request
 *       500:
 *         description: LLM or database error
 */
export const extractEntities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = EntitiesRequestSchema.parse(req.body);

    const caseData = await prisma.case.findUnique({
      where: { id: validated.caseId },
      include: {
        evidence: true,
        timeline: true
      }
    });

    if (!caseData) {
      throw new AppError('Case not found', 404);
    }

    const transcriptions = await prisma.transcription.findMany({
      where: { referenceId: validated.caseId }
    });

    const context = `Case Title: ${caseData.title}
Case Description: ${caseData.description}

Timeline Events:
${caseData.timeline.map(t => `- ${t.title}: ${t.detail}`).join('\n')}

Evidence:
${caseData.evidence.map(e => `- ${e.label}: ${e.notes || ''}`).join('\n')}

Transcriptions:
${transcriptions.map(t => `- ${t.text}`).join('\n') || 'None'}`;

    const prompt = `Extract the following entities from this case data. Return the results as a JSON array of objects with "type" and "value" fields, nothing else.

Extract these types:
- Person Names
- Phone Numbers
- Emails
- Bank Accounts
- UPI IDs
- Vehicle Numbers
- Addresses
- URLs
- IP Addresses
- Dates
- Locations

Case Data:
${context}`;

    const result = await llmService.generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    }, validated.caseId);

    // Try to parse and save entities
    try {
      let entities: Array<{ type: string; value: string }> = [];
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        entities = JSON.parse(jsonMatch[0]);
      }

      // Save entities to Entity table
      for (const entity of entities) {
        if (entity.type && entity.value) {
          await prisma.entity.create({
            data: {
              type: entity.type,
              value: entity.value,
              context: JSON.stringify({ caseId: validated.caseId }),
              sourceId: validated.caseId
            }
          });
        }
      }
    } catch (parseErr) {
      logger.warn('Failed to parse or save entities', { parseErr });
    }

    return sendSuccess(res, result, 'Entities extracted successfully');
  } catch (error) {
    next(error);
  }
};
