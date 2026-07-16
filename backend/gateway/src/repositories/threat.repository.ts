import { prisma } from '../database/prisma';
import { env } from '../config/env';

const REFERENCE_ADVISORIES = [
  {
    title: 'Digital arrest video-call scripts',
    category: 'digital_arrest',
    level: 'critical',
    region: 'General guidance',
    summary:
      'Warning pattern: forged warrants, isolation language, and pressure to transfer verification funds.',
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
    region: 'General guidance',
    summary:
      'Warning pattern: replaced QR stickers and collect requests framed as refunds.',
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
    region: 'General guidance',
    summary:
      'Warning pattern: chat-group recruitment into unregistered trading apps displaying staged profits.',
    indicators: [
      'Guaranteed returns',
      'Telegram or WhatsApp advisor',
      'Withdrawal blocked until tax payment',
    ],
  },
  {
    title: 'Counterfeit currency warning signs',
    category: 'counterfeit_currency',
    level: 'elevated',
    region: 'General guidance',
    summary:
      'Reference checks for suspicious notes include microtext, security-thread, and serial-pattern inspection.',
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
    region: 'General guidance',
    summary:
      'Warning pattern: sudden SIM outage followed by password resets and first-time transfers.',
    indicators: [
      'Sudden network loss',
      'Password reset alerts',
      'High-value first-time transfer',
    ],
  },
];
let seedPromise: Promise<void> | null = null;

export class ThreatRepository {
  async findAll() {
    const count = await prisma.threat.count();
    if (count === 0 && env.LOAD_REFERENCE_ADVISORIES) {
      seedPromise ??= this.seed().finally(() => { seedPromise = null; });
      await seedPromise;
    }
    return prisma.threat.findMany({ orderBy: { updatedAt: 'desc' }, take: env.MAX_LIST_RESULTS });
  }

  async findById(id: string) {
    return prisma.threat.findUnique({ where: { id } });
  }

  private async seed() {
    if (await prisma.threat.count()) return;
    await prisma.threat.createMany({
      data: REFERENCE_ADVISORIES.map((t) => ({
        ...t,
        indicators: t.indicators,
      })),
    });
  }
}
