import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { authRouter } from './routes/auth.route';
import { profileRouter } from './routes/profile.route';
import { productRouter } from './routes/product.routes';
import { orderRouter } from './routes/order.routes';

export const app = express();

// Tin tưởng proxy của Vercel để lấy IP thật của client phục vụ rate-limit
app.set('trust proxy', 1);

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" })
})

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use(errorMiddleware);