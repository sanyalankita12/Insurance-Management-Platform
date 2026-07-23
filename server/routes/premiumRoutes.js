import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.post('/', async (req, res) => {
  try {
    const { policyId, paymentDate, amount, paymentStatus } = req.body;
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

router.get('/', async (req, res) => {
  try {
    const premiums = await prisma.premium.findMany({
      include: { policy: { include: { customer: true } } },
    });
    res.json(premiums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/policy/:policyId', async (req, res) => {
  try {
    const { policyId } = req.params;
    const premiums = await prisma.premium.findMany({
      where: { policyId: parseInt(policyId) },
    });
    res.json(premiums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const updatedPremium = await prisma.premium.update({
      where: { id: parseInt(id) },
      data: { paymentStatus },
    });
    res.json(updatedPremium);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.premium.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Premium record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;