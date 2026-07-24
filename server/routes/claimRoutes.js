import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.post('/', async (req, res) => {
  try {
    const { policyId, claimAmount, reason, status } = req.body;
    const newClaim = await prisma.claim.create({
      data: {
        policyId: parseInt(policyId),
        claimAmount: parseFloat(claimAmount),
        reason,
        status: status || 'pending',
      },
    });
    res.status(201).json(newClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      include: { policy: { include: { customer: true } } },
    });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await prisma.claim.findUnique({
      where: { id: parseInt(id) },
      include: { policy: { include: { customer: true } } },
    });
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedClaim = await prisma.claim.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.claim.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;