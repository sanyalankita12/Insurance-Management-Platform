import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.post('/', async (req, res) => {
  try {
    const { customerId, policyType, policyNumber, premiumAmount, startDate, endDate, status } = req.body;
    const newPolicy = await prisma.policy.create({
      data: {
        customerId: parseInt(customerId),
        policyType,
        policyNumber,
        premiumAmount: parseFloat(premiumAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
    });
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const policies = await prisma.policy.findMany({
      include: { customer: true },
    });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await prisma.policy.findUnique({
      where: { id: parseInt(id) },
      include: { customer: true },
    });
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { policyType, policyNumber, premiumAmount, startDate, endDate, status } = req.body;
    const updatedPolicy = await prisma.policy.update({
      where: { id: parseInt(id) },
      data: {
        policyType,
        policyNumber,
        premiumAmount: parseFloat(premiumAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
    });
    res.json(updatedPolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const cancelledPolicy = await prisma.policy.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
    });
    res.json(cancelledPolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.policy.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;