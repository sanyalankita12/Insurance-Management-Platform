import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { customerId } = req.body;
    const newDocument = await prisma.document.create({
      data: {
        customerId: parseInt(customerId),
        fileName: req.file.originalname,
        filePath: req.file.path,
      },
    });
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const documents = await prisma.document.findMany({ include: { customer: true } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({ where: { id: parseInt(id) } });
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.download(path.resolve(document.filePath), document.fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, authorizeRoles('admin', 'agent'), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.document.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;