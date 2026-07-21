import { aiRegistry } from '../providers/registry';
import { prisma } from '../../database/prisma';
import { logger } from '../../common/logger';

export class AiPipelineService {
  /**
   * Runs the full AI pipeline for a case:
   * 1. If audioBuffer is provided: transcribe audio
   * 2. Generate case summary
   * 3. Extract entities
   *
   * All steps are optional and will not fail the whole pipeline if they error.
   */
  async runPipelineForCase(
    caseId: string,
    options: { audioBuffer?: Buffer; audioMimeType?: string } = {}
  ) {
    const result = {
      success: true,
      transcript: null as any,
      summary: null as any,
      entitiesExtracted: false,
    };

    // Step 1: Transcribe audio if provided
    if (options.audioBuffer) {
      try {
        const speechProvider = aiRegistry.getSpeechProvider();
        const transcription = await speechProvider.transcribe({
          audioBuffer: options.audioBuffer,
          mimetype: options.audioMimeType || 'audio/wav',
        });

        result.transcript = transcription;

        // Save transcription linked to case
        await prisma.transcription.create({
          data: {
            referenceId: caseId,
            caseId: caseId,
            text: transcription.text,
            language: transcription.language,
            confidence: transcription.confidence,
          },
        });

        logger.info(`Transcription complete for case ${caseId}`, { provider: speechProvider.name });
      } catch (error) {
        logger.warn(`Failed to transcribe audio for case ${caseId}`, { error });
      }
    }

    // Step 2: Generate case summary
    try {
      const llmProvider = aiRegistry.getLLMProvider();

      // Load case context
      const caseContext = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          evidence: true,
          timeline: true,
          transcriptions: true,
        },
      });

      if (caseContext) {
        const contextText = `Case Title: ${caseContext.title}
Case Description: ${caseContext.description}

Timeline Events:
${caseContext.timeline.map(t => `- ${t.title}: ${t.detail}`).join('\n')}

Evidence:
${caseContext.evidence.map(e => `- ${e.type}: ${e.label} (${e.reference})`).join('\n')}

Transcriptions:
${caseContext.transcriptions.map(t => `- ${t.text}`).join('\n') || 'None'}`;

        const prompt = `Please summarize this police investigation case. Provide the following sections:
1. Executive Summary
2. Timeline
3. Key Risks
4. Recommended Next Steps

Case Data:
${contextText}`;

        const summaryResponse = await llmProvider.generate({
          messages: [{ role: 'user', content: prompt }],
        });

        result.summary = summaryResponse;

        // Save AI result for summary
        await prisma.aIResult.create({
          data: {
            provider: llmProvider.name,
            serviceType: 'summary',
            inputRef: caseId,
            caseId: caseId,
            output: summaryResponse as any,
          },
        });

        logger.info(`Summary generated for case ${caseId}`, { provider: llmProvider.name });
      }
    } catch (error) {
      logger.warn(`Failed to generate summary for case ${caseId}`, { error });
    }

    // Step 3: Extract entities
    try {
      const llmProvider = aiRegistry.getLLMProvider();

      // Load case context again (in case we added a transcription)
      const caseContext = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          evidence: true,
          timeline: true,
          transcriptions: true,
        },
      });

      if (caseContext) {
        const contextText = `Case Title: ${caseContext.title}
Case Description: ${caseContext.description}

Timeline Events:
${caseContext.timeline.map(t => `- ${t.title}: ${t.detail}`).join('\n')}

Evidence:
${caseContext.evidence.map(e => `- ${e.label}: ${e.notes || ''}`).join('\n')}

Transcriptions:
${caseContext.transcriptions.map(t => `- ${t.text}`).join('\n') || 'None'}`;

        const prompt = `Extract the following entities from this case data. Return only a JSON array of objects with "type" and "value" fields, no other text.

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
${contextText}`;

        const entitiesResponse = await llmProvider.generate({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
        });

        // Try to parse entities
        let entities: Array<{ type: string; value: string }> = [];
        const jsonMatch = entitiesResponse.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            entities = JSON.parse(jsonMatch[0]);
          } catch (parseError) {
            logger.warn(`Failed to parse entities JSON for case ${caseId}`, { parseError });
          }
        }

        if (entities.length > 0) {
          // Save entities
          for (const entity of entities) {
            if (entity.type && entity.value) {
              await prisma.entity.create({
                data: {
                  type: entity.type,
                  value: entity.value,
                  context: JSON.stringify({ caseId: caseId }),
                  sourceId: caseId,
                  caseId: caseId,
                },
              });
            }
          }
          result.entitiesExtracted = true;

          // Save AI result for entities
          await prisma.aIResult.create({
            data: {
              provider: llmProvider.name,
              serviceType: 'entities',
              inputRef: caseId,
              caseId: caseId,
              output: entitiesResponse as any,
            },
          });

          logger.info(`Entities extracted for case ${caseId}`, { provider: llmProvider.name, count: entities.length });
        }
      }
    } catch (error) {
      logger.warn(`Failed to extract entities for case ${caseId}`, { error });
    }

    return result;
  }
}

export const aiPipelineService = new AiPipelineService();
