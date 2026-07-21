import { ArrowLeft, ExternalLink, FilePlus2, Fingerprint, Link2, ShieldAlert, Bot, Send, Mic, FileText } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, CapabilityNotice, Card, Dialog, EmptyState, ErrorState, Field, PageHeader, RiskBadge, SectionHeader, Skeleton } from '@/components/ui';
import { useCase, useCaseActions, useThreats } from '@/data/queries';
import { formatDate, inferRisk, safeReference, titleCase } from '@/lib/format';
import { getErrorMessage, api } from '@/lib/apiClient';
import type { CaseStatus, EvidenceType, CaseRecord } from '@/types';

export function InvestigationWorkspace() {
  const { id = '' } = useParams(); 
  const query = useCase(id); 
  const threats = useThreats(); 
  const { updateCase, addEvidence } = useCaseActions(); 
  const [evidenceOpen, setEvidenceOpen] = useState(false); 
  const [error, setError] = useState('');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [copilotLoading, setCopilotLoading] = useState(false);
  
  const item = query.data;
  
  const aiSummary = useMemo(() => {
    if (!item?.aiResults) return null;
    return item.aiResults.find(r => r.serviceType === 'summary');
  }, [item]);
  
  const related = useMemo(() => !item ? [] : (threats.data?.items ?? []).filter((threat) => `${threat.title} ${threat.category} ${threat.summary}`.toLowerCase().split(/\s+/).some((word) => word.length > 4 && `${item.title} ${item.description} ${item.category ?? ''}`.toLowerCase().includes(word))).slice(0, 4), [item, threats.data]);
  
  if (query.isLoading) return <Skeleton rows={10} />;
  if (query.isError || !item) return <ErrorState error={query.error ?? new Error('Case not found.')} retry={() => void query.refetch()} />;
  
  const setStatus = async (status: CaseStatus) => { setError(''); try { await updateCase.mutateAsync({ id, data: { status } }); } catch (reason) { setError(getErrorMessage(reason)); } };
  
  const submitEvidence = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); const data = new FormData(event.currentTarget);
    try { await addEvidence.mutateAsync({ id, data: { type: data.get('type') as EvidenceType, label: String(data.get('label')), reference: String(data.get('reference')), notes: String(data.get('notes') || '') } }); setEvidenceOpen(false); }
    catch (reason) { setError(getErrorMessage(reason)); }
  };
  
  const handleCopilotSend = async () => {
    if (!copilotInput.trim() || !item) return;
    
    const userMessage = { role: 'user' as const, content: copilotInput };
    setCopilotMessages(prev => [...prev, userMessage]);
    setCopilotLoading(true);
    setCopilotInput('');
    
    try {
      // Build context from case data
      const context = buildCaseContext(item);
      const prompt = `${context}\n\nOfficer question: ${copilotInput}`;
      
      const response = await api.post<{ text: string }>('/ai/chat', { messages: [{ role: 'user', content: prompt }] });
      setCopilotMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (err) {
      setCopilotMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setCopilotLoading(false);
    }
  };
  
  const handleSuggestion = (suggestion: string) => {
    setCopilotInput(suggestion);
  };
  
  const timeline = [{ id: `created-${item.id}`, title: 'Investigation created', detail: item.description, at: item.createdAt }, ...(item.timeline ?? []).map((entry) => ({ id: entry.id, title: entry.title, detail: entry.detail, at: entry.createdAt })), ...(item.evidence ?? []).map((entry) => ({ id: `evidence-${entry.id}`, title: `Evidence added · ${entry.label}`, detail: entry.notes || entry.reference, at: entry.createdAt }))].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  
  return (
    <>
      <Link className="back-link" to="/cases"><ArrowLeft size={16} /> Back to case queue</Link>
      <PageHeader eyebrow={`Case · ${item.id}`} title={item.title} description={item.description} actions={<div className="header-badges"><RiskBadge value={inferRisk(item)} /><RiskBadge value={item.status} /></div>} />
      {error && <div className="form-error" role="alert">{error}</div>}
      
      <div className="investigation-grid">
        <div className="investigation-main">
          {/* AI Summary Card */}
          {aiSummary && (
            <Card>
              <SectionHeader title="AI Summary" icon={<FileText size={17} />} />
              <div className="ai-summary">
                <p className="whitespace-pre-wrap">{aiSummary.output.text}</p>
              </div>
            </Card>
          )}
          
          {/* Transcriptions Card */}
          {(item.transcriptions?.length ?? 0) > 0 && (
            <Card>
              <SectionHeader title="Transcriptions" icon={<Mic size={17} />} />
              <div className="space-y-4">
                {item.transcriptions?.map(transcription => (
                  <div key={transcription.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{formatDate(transcription.createdAt)}</span>
                      {transcription.confidence && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Confidence: {Math.round(transcription.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{transcription.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Entities Card */}
          {(item.entities?.length ?? 0) > 0 && (
            <Card>
              <SectionHeader title="Extracted Entities" />
              <div className="flex flex-wrap gap-2">
                {item.entities?.map(entity => (
                  <div key={entity.id} className="bg-muted px-3 py-1 rounded-full text-sm">
                    <span className="font-semibold text-primary">{entity.type}:</span> {entity.value}
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Case Control Card */}
          <Card>
            <SectionHeader title="Case control" description="Update the workflow state using fields supported by the case service." />
            <div className="status-actions">
              {(['OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED'] as CaseStatus[]).map((status) => (
                <Button key={status} variant={item.status === status ? 'primary' : 'secondary'} disabled={updateCase.isPending || item.status === status} onClick={() => void setStatus(status)}>
                  {titleCase(status)}
                </Button>
              ))}
            </div>
          </Card>
          
          {/* Evidence Record Card */}
          <Card>
            <SectionHeader title="Evidence record" description={`${item.evidence?.length ?? 0} references attached to this investigation.`} action={<Button onClick={() => setEvidenceOpen(true)}><FilePlus2 size={17} /> Add evidence</Button>} />
            {(item.evidence ?? []).length === 0 ? (
              <EmptyState title="No evidence recorded" description="Attach a validated URI or reference using the existing evidence API." />
            ) : (
              <div className="evidence-grid">
                {item.evidence?.map((evidence) => {
                  const safe = safeReference(evidence.reference);
                  return (
                    <article className="evidence-card" key={evidence.id}>
                      <div className="evidence-card__icon"><Fingerprint size={21} /></div>
                      <div>
                        <span className="mono">{evidence.id}</span>
                        <h3>{evidence.label}</h3>
                        <p>{evidence.notes || 'No officer annotation supplied.'}</p>
                        <div>
                          <RiskBadge value={evidence.type} />
                          <span className="mono">{formatDate(evidence.createdAt)}</span>
                        </div>
                        {safe && <a href={safe} rel="noreferrer" target="_blank">Open verified reference <ExternalLink size={14} /></a>}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Card>
          
          {/* Timeline Card */}
          <Card>
            <SectionHeader title="Investigation timeline" description="A chronological record composed only from case and evidence API timestamps." />
            <ol className="timeline">
              {timeline.map((entry) => (
                <li key={entry.id}>
                  <i />
                  <div>
                    <span className="mono">{formatDate(entry.at)}</span>
                    <strong>{entry.title}</strong>
                    <p>{entry.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
        
        <aside className="investigation-aside">
          {/* Case Facts Card */}
          <Card>
            <SectionHeader title="Case facts" />
            <dl className="fact-list">
              <div><dt>Status</dt><dd>{titleCase(item.status)}</dd></div>
              <div><dt>Risk signal</dt><dd>{titleCase(inferRisk(item))}</dd></div>
              <div><dt>Category</dt><dd>{titleCase(item.category)}</dd></div>
              <div><dt>Location</dt><dd>{item.location || 'Not provided'}</dd></div>
              <div><dt>Opened</dt><dd className="mono">{formatDate(item.createdAt)}</dd></div>
              <div><dt>Last change</dt><dd className="mono">{formatDate(item.updatedAt)}</dd></div>
            </dl>
          </Card>
          
          {/* AI Copilot Card */}
          <Card className="copilot-card">
            <SectionHeader title="AI Copilot" icon={<Bot size={17} />} />
            <div className="copilot-messages">
              {copilotMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p>Ask questions about this case</p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {['Summarize this case', 'What evidence is missing?', 'What are the main suspects?', 'What locations are mentioned?', 'What should I investigate next?'].map((suggestion, i) => (
                      <Button key={i} variant="secondary" onClick={() => handleSuggestion(suggestion)}>
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                copilotMessages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg mb-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-8' : 'bg-muted mr-8'}`}>
                    <p>{msg.content}</p>
                  </div>
                ))
              )}
              {copilotLoading && (
                <div className="p-3 bg-muted rounded-lg mr-8">
                  <p className="animate-pulse">Thinking...</p>
                </div>
              )}
            </div>
            <div className="copilot-input flex gap-2 mt-4">
              <Field label="Officer question">
                <input
                  type="text"
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCopilotSend(); }}
                  placeholder="Ask the copilot..."
                  className="w-full"
                />
              </Field>
              <Button onClick={handleCopilotSend} disabled={copilotLoading || !copilotInput.trim()}>
                <Send size={16} />
              </Button>
            </div>
          </Card>
          
          {/* Related Intelligence Card */}
          <Card>
            <SectionHeader title="Related intelligence" description="Keyword correlations from the current threat feed; not an AI determination." />
            {related.length === 0 ? (
              <EmptyState icon={<ShieldAlert size={21} />} title="No direct correlation" description="No current threat advisory shares a meaningful descriptor with this record." />
            ) : (
              <div className="compact-list">
                {related.map((threat) => (
                  <Link to={`/intelligence?threat=${threat.id}`} key={threat.id}>
                    <div><strong>{threat.title}</strong><span>{threat.region}</span></div>
                    <RiskBadge value={threat.level} />
                  </Link>
                ))}
              </div>
            )}
          </Card>
          
          <CapabilityNotice title="Assignments and officer notes are read-only">
            The current backend does not expose assignment, internal note, or chain-of-custody mutation endpoints. This workspace will not create local records that could be mistaken for official data.
          </CapabilityNotice>
        </aside>
      </div>
      
      {evidenceOpen && (
        <Dialog title="Attach evidence reference" description="The current API stores evidence metadata and a reference URI; it does not accept file binaries." onClose={() => setEvidenceOpen(false)}>
          <form className="dialog-form" onSubmit={submitEvidence}>
            <div className="form-grid">
              <Field label="Evidence type">
                <select name="type" required>
                  {(['audio', 'image', 'video', 'document', 'chat', 'link', 'note'] as EvidenceType[]).map((type) => (
                    <option key={type} value={type}>{titleCase(type)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reference label">
                <input name="label" required minLength={2} placeholder="Bank statement · page 2" />
              </Field>
            </div>
            <Field label="Secure reference URI" hint="Use an HTTPS location managed by your evidence system.">
              <div className="input-with-icon">
                <Link2 size={17} />
                <input name="reference" required type="url" placeholder="https://evidence.example.gov/reference" />
              </div>
            </Field>
            <Field label="Officer annotation">
              <textarea name="notes" rows={4} placeholder="Describe relevance and source verification." />
            </Field>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="form-actions">
              <Button type="button" variant="ghost" onClick={() => setEvidenceOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addEvidence.isPending}>{addEvidence.isPending ? 'Attaching…' : 'Attach reference'}</Button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}

function buildCaseContext(item: CaseRecord): string {
  let context = `Case Title: ${item.title}\nCase Description: ${item.description}\n\n`;
  
  if (item.transcriptions && item.transcriptions.length > 0) {
    context += 'Transcriptions:\n';
    item.transcriptions.forEach(t => {
      context += `- ${t.text}\n`;
    });
  }
  
  if (item.evidence && item.evidence.length > 0) {
    context += '\nEvidence:\n';
    item.evidence.forEach(e => {
      context += `- ${e.label}: ${e.notes || ''}\n`;
    });
  }
  
  if (item.entities && item.entities.length > 0) {
    context += '\nExtracted Entities:\n';
    item.entities.forEach(e => {
      context += `- ${e.type}: ${e.value}\n`;
    });
  }
  
  return context;
}
