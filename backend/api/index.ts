import app from '../src/app';
import { connectDB } from '../src/config/db';

// Connect to database
connectDB();

export default app;
