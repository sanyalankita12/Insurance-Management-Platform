import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login',async(req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await prisma.user.findUnique({
            where:{email},
        });
        if (!user){
            return res.status(404).json({error:'User not found!'})

        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.status(401).json({error:'Invalid credentials!'});
        }
        const token =jwt.sign(
            {id:user.id, role:user.role},
            process.env.JWT_SECRET,
            { expiresIn:'1d'}
    );
    res.json({message:"Login Successful",token});
    }
    catch (error){
        res.status(500).json({error:error.message});
    }

});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my-customer-profile', verifyToken, async (req, res) => {
  try {
    const authUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    const customer = await prisma.customer.findUnique({ where: { email: authUser.email } });
    if (!customer) {
      return res.status(404).json({ error: 'No matching customer profile found for this account' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;