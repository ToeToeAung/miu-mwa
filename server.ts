import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './src/config/db';

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
