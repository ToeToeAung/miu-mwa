import express from 'express';
import userRoutes from './src/routes/userRoute';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

export default app;