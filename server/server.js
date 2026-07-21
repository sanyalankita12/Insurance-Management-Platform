import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth',router);

const PORT = process.env.PORT || 5000;

app.get('/',(req,res) => {
    res.json({"message": 'Server is running! '})
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});