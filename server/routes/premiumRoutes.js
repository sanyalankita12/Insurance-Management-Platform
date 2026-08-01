import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.post('/', verifyToken, async (req, res) => {
  try {
    const { policyId, paymentDate, amount, paymentStatus } = req.body;

    if (!policyId || !paymentDate || !amount || !paymentStatus) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const policyExists = await prisma.policy.findUnique({ where: { id: parseInt(policyId) } });
    if (!policyExists) {
      return res.status(400).json({ error: 'No policy found with this Policy ID' });
    }

    const newPremium = await prisma.premium.create({
      data: {
        policyId: parseInt(policyId),
        paymentDate: new Date(paymentDate),
        amount: parseFloat(amount),
        paymentStatus,
      },
    });
    res.status(201).json(newPremium);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const premiums = await prisma.premium.findMany({
      include: { policy: { include: { customer: true } } },
    });
    res.json(premiums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/policy/:policyId', verifyToken, async (req, res) => {
  try {
    const { policyId } = req.params;
    const premiums = await prisma.premium.findMany({ where: { policyId: parseInt(policyId) } });
    res.json(premiums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ error: 'Payment status is required' });
    }

    const updatedPremium = await prisma.premium.update({
      where: { id: parseInt(id) },
      data: { paymentStatus },
    });
    res.json(updatedPremium);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.premium.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Premium record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;