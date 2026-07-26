import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.get('/summary', async (req, res) => {
  try {
    const activePolicies = await prisma.policy.count({ where: { status: 'active' } });
    const expiredPolicies = await prisma.policy.count({ where: { status: 'expired' } });
    const totalCustomers = await prisma.customer.count();

    const claimStats = await prisma.claim.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const premiumCollection = await prisma.premium.aggregate({
      where: { paymentStatus: 'paid' },
      _sum: { amount: true },
    });

    res.json({
      activePolicies,
      expiredPolicies,
      totalCustomers,
      claimStats,
      totalPremiumCollected: premiumCollection._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;