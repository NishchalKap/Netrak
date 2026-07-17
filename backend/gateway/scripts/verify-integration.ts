import dotenv from 'dotenv';

dotenv.config();

const baseUrl = (process.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
if (!baseUrl) throw new Error('PUBLIC_API_URL is required for integration verification. Example: https://api.example.com/api');

type Envelope<T> = { status: string; data: T; message: string };

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers } });
  const payload = await response.json() as Envelope<T>;
  if (!response.ok) throw new Error(`${init.method ?? 'GET'} ${path}: ${response.status} ${payload.message}`);
  return payload.data;
}

async function main() {
  await request('/health/ready');
  await request('/health/live');
  await request('/threats');

  const login = await request<{ token: string; user: { id: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'citizen@netrak.local', password: process.env.SEED_CITIZEN_PASSWORD ?? 'NetrakCitizen!2026' }),
  });
  const authorization = { Authorization: `Bearer ${login.token}` };
  const createdCase = await request<{ id: string }>('/cases', {
    method: 'POST', headers: authorization,
    body: JSON.stringify({ title: 'Integration verification case', description: 'This temporary case verifies authenticated case creation.' }),
  });
  await request(`/cases/${createdCase.id}`, { headers: authorization });
  await request(`/cases/${createdCase.id}/evidence`, {
    method: 'POST', headers: authorization,
    body: JSON.stringify({ type: 'note', label: 'Integration verification evidence', reference: 'verification://evidence' }),
  });
  await request(`/cases/${createdCase.id}`, { method: 'DELETE', headers: authorization });

  const officer = await request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'officer@netrak.local', password: process.env.SEED_OFFICER_PASSWORD ?? 'NetrakOfficer!2026' }),
  });
  await request('/notifications', {
    method: 'POST', headers: { Authorization: `Bearer ${officer.token}` },
    body: JSON.stringify({ userId: login.user.id, message: 'Integration verification notification' }),
  });
  console.log('Gateway integration verification passed.');
}

main();
