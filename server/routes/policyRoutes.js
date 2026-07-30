import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.post('/', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
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

router.get('/', verifyToken, async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      OR: [
        { policyType: { contains: search, mode: 'insensitive' } },
        { policyNumber: { contains: search, mode: 'insensitive' } },
      ],
    };

    const policies = await prisma.policy.findMany({
      where,
      include: { customer: true },
      skip,
      take: parseInt(limit),
    });
    const total = await prisma.policy.count({ where });

    res.json({
      data: policies,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await prisma.policy.findUnique({
      where: { id: parseInt(id) },
      include: { customer: true },
    });
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
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

router.put('/:id/cancel', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
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

router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.policy.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;