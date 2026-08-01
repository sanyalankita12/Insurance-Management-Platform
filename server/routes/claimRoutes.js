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
    const { policyId, claimAmount, reason, status } = req.body;

    if (!policyId || !claimAmount || !reason) {
      return res.status(400).json({ error: 'Policy ID, claim amount, and reason are required' });
    }
    if (parseFloat(claimAmount) <= 0) {
      return res.status(400).json({ error: 'Claim amount must be greater than 0' });
    }

    const policyExists = await prisma.policy.findUnique({ where: { id: parseInt(policyId) } });
    if (!policyExists) {
      return res.status(400).json({ error: 'No policy found with this Policy ID' });
    }

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

router.get('/', verifyToken, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { status: { contains: search, mode: 'insensitive' } };

    const claims = await prisma.claim.findMany({
      where,
      include: { policy: { include: { customer: true } } },
      skip,
      take: parseInt(limit),
    });
    const total = await prisma.claim.count({ where });

    res.json({
      data: claims,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedClaim = await prisma.claim.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.claim.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;