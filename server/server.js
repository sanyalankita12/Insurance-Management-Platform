import customerRoutes from './routes/customerRoutes.js';
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import premiumRoutes from './routes/premiumRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth',router);
app.use('/api/customers', customerRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/premiums', premiumRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

app.get('/',(req,res) => {
    res.json({"message": 'Server is running! '})
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});