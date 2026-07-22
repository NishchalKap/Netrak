import type { CaseRecord, NotificationRecord, ThreatRecord } from '@/types';

export const FALLBACK_CASES: CaseRecord[] = [
  {
    id: 'CASE-2026-001',
    title: 'Financial Phishing Network targeting Senior Citizens',
    description: 'Coordinated spear-phishing campaign exploiting bank verification SMS templates to siphon credentials.',
    status: 'ESCALATED',
    category: 'Cyber Fraud',
    location: 'Connaught Place, New Delhi',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    evidence: [
      {
        id: 'EVD-901',
        type: 'document',
        label: 'Impounded Fraudulent Bank Statement',
        reference: 'https://evidence.example.gov/ref/CP-901',
        notes: 'Forged PDF header matching RBI alert typology.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'EVD-902',
        type: 'chat',
        label: 'Intercepted Telegram Channel Log',
        reference: 'https://evidence.example.gov/ref/TG-902',
        notes: 'Automated bot distribution network exporting OTP tokens.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    timeline: [
      { id: 'TL-101', title: 'Citizen Report Filed', detail: 'Initial victim reported fraudulent transaction of INR 4,50,000.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'TL-102', title: 'Case Escalated to Cyber Cell', detail: 'Transferred to District Cyber Operations Unit for priority tracking.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
    transcriptions: [
      { id: 'TR-01', referenceId: 'REF-TR-01', text: 'Caller impersonating SBI compliance officer requested immediate OTP validation to prevent account lock.', confidence: 0.96, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
    ],
    entities: [
      { id: 'ENT-01', type: 'UPI_ID', value: 'fake.bank.verify@ybl', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'ENT-02', type: 'PHONE', value: '+91-9876543210', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'ENT-03', type: 'IP_ADDRESS', value: '185.220.101.5', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    ],
    aiResults: [
      { id: 'AIR-01', provider: 'netrak-ai-engine', serviceType: 'summary', output: { text: 'High confidence scam pattern identified matching 14 related reports across Northern District.' }, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
    ],
  },
  {
    id: 'CASE-2026-002',
    title: 'Deepfake Executive Audio Extortion Attempt',
    description: 'Voice clone generated using public conference audio used to authorize emergency wire transfer.',
    status: 'IN_PROGRESS',
    category: 'AI Synthetic Fraud',
    location: 'Cyber City, Gurugram',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    evidence: [
      {
        id: 'EVD-903',
        type: 'audio',
        label: 'Cloned Voice Call Recording',
        reference: 'https://evidence.example.gov/ref/AUD-903',
        notes: 'Spectral analysis indicates synthetic pitch modulation.',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ],
    timeline: [
      { id: 'TL-103', title: 'Audio Analysis Dispatched', detail: 'Submitted to Speech Intelligence Engine for acoustic artifact detection.', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    ],
    entities: [
      { id: 'ENT-04', type: 'VOICE_MODEL', value: 'XTTS-v2-Synthesized', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: 'ENT-05', type: 'PHONE', value: '+91-9123456789', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    ],
  },
  {
    id: 'CASE-2026-003',
    title: 'Ransomware Outrage on Municipal Transit Gateway',
    description: 'Unauthorized encrypted payload detected on automated ticket vending infrastructure.',
    status: 'OPEN',
    category: 'Critical Infrastructure',
    location: 'Bandra Kurla Complex, Mumbai',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    evidence: [],
    timeline: [
      { id: 'TL-104', title: 'System Isolation Initiated', detail: 'Network interfaces severed to limit lateral propagation.', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    ],
  },
  {
    id: 'CASE-2026-004',
    title: 'ATM Skimmer Infrastructure at Commercial Hub',
    description: 'Physical overlay device and micro-camera recovered during routine surveillance sweep.',
    status: 'OPEN',
    category: 'Financial Crime',
    location: 'MG Road, Bengaluru',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    evidence: [],
  },
  {
    id: 'CASE-2026-005',
    title: 'Sim-Swap Syndicate Operating in Northern Sector',
    description: 'Multiple forged identity documents submitted to telecom kiosks for rapid SIM re-issuance.',
    status: 'CLOSED',
    category: 'Identity Theft',
    location: 'Sector 17, Chandigarh',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    evidence: [],
  },
];

export const FALLBACK_THREATS: ThreatRecord[] = [
  {
    id: 'THREAT-801',
    title: 'Widespread APK Malware targeting Mobile Banking',
    category: 'Mobile Malware',
    summary: 'SmsPay Trojan disguised as an official public utility payment app harvesting OTP tokens.',
    level: 'critical',
    region: 'Northern District',
    indicators: ['app.smspay.apk', '185.220.101.5', 'bank-login-verify.com'],
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'THREAT-802',
    title: 'AI Voice Cloning Fraud Campaigns',
    category: 'Synthetic Media',
    summary: 'Automated extortion bots targeting families using synthesized urgent family distress calls.',
    level: 'high',
    region: 'Metropolitan Area',
    indicators: ['+91-9876543210', 'voice-gen-api.local'],
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'THREAT-803',
    title: 'Fake Job Offer Telegram Syndicates',
    category: 'Social Engineering',
    summary: 'Pre-paid task scams asking victims to review videos in exchange for commission payouts.',
    level: 'elevated',
    region: 'Southern Sector',
    indicators: ['t.me/fake_job_offers', 'pay.scam.upi@ybl'],
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const FALLBACK_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'NOTIF-301',
    message: 'High priority alert: New synthetic voice attack pattern reported in Connaught Place.',
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'NOTIF-302',
    message: 'Case CASE-2026-001 status changed to ESCALATED by Lead Investigator.',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'NOTIF-303',
    message: 'System advisory: Threat Intelligence feed successfully updated with 3 new indicators.',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
