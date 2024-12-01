import express from 'express';
import userRoutes from './routes/userRoute';
import courseRoutes from './routes/courseRoute';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

export default app;
