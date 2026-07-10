import { prisma } from '../database/prisma';

const THREAT_SEEDS = [
  {
    title: 'Digital arrest video-call scripts',
    category: 'digital_arrest',
    level: 'critical',
    region: 'National',
    summary:
      'Impersonators are using forged warrants, isolation language, and pressure to transfer verification funds.',
    indicators: [
      'Claims of CBI or customs case',
      'Instruction to stay on video call',
      'Demand for verification transfer',
    ],
  },
  {
    title: 'Swapped QR and collect requests',
    category: 'upi_fraud',
    level: 'high',
    region: 'Urban retail corridors',
    summary:
      'Reports continue around QR stickers being replaced and collect requests being framed as refunds.',
    indicators: [
      'Unexpected collect request',
      'New beneficiary after scan',
      'PIN requested to receive money',
    ],
  },
  {
    title: 'Fake trading group onboarding',
    category: 'investment_scam',
    level: 'high',
    region: 'Messaging platforms',
    summary:
      'Victims are being moved from chat groups into unregistered trading apps with staged profits.',
    indicators: [
      'Guaranteed returns',
      'Telegram or WhatsApp advisor',
      'Withdrawal blocked until tax payment',
    ],
  },
  {
    title: 'Counterfeit INR 500 circulation',
    category: 'counterfeit_currency',
    level: 'elevated',
    region: 'Bank counters and small retail',
    summary:
      'Counterfeit INR 500 detections remain concentrated at bank and merchant contact points.',
    indicators: [
      'Blurred microtext',
      'Weak security thread',
      'Repeated serial patterns',
    ],
  },
  {
    title: 'SIM swap recovery-window abuse',
    category: 'sim_swap',
    level: 'elevated',
    region: 'Digital banking users',
    summary:
      'Attackers are using short SIM outage windows to reset account access and move funds.',
    indicators: [
      'Sudden network loss',
      'Password reset alerts',
      'High-value first-time transfer',
    ],
  },
];

export class ThreatRepository {
  async findAll() {
    const count = await prisma.threat.count();
    if (count === 0) {
      await this.seed();
    }
    return prisma.threat.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  async findById(id: string) {
    return prisma.threat.findUnique({ where: { id } });
  }

  private async seed() {
    await prisma.threat.createMany({
      data: THREAT_SEEDS.map((t) => ({
        ...t,
        indicators: t.indicators,
      })),
    });
  }
}
