import express from "express";
import cors from "cors";
import { createServer } from "http";
import { db } from "./config/db";
import { env } from "./config/env";
import { userRoutes } from './modules/user/routes';
import { universityRoutes } from './modules/university';
import { scholarshipRoutes } from './modules/scholarship';
import { categoryRoutes } from './modules/category';
import { postRoutes } from './modules/post/routes';
import { likeRoutes } from './modules/like/routes';
import { commentRoutes } from './modules/comment/routes';
import { followRoutes } from './modules/follow/routes';
import { messageRoutes } from './modules/message/routes';
import { communityRoutes } from './modules/community';
import { realtimeGateway } from './modules/realtime';
import cookieParser from 'cookie-parser';

const app = express();
const httpServer = createServer(app);

app.use(cookieParser());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/communities', communityRoutes);

app.get("/api", (_req, res) => {
  res.json({ ok: true, service: "api", ts: new Date().toISOString() });
});

const port = env.PORT || 3000;

async function start() {
  await db.connect();

  realtimeGateway.initialize(httpServer);

  httpServer.listen(port, () => {
    console.log(`API listening on :${port}`);
    console.log(`Public API URL: ${env.API_URL}`);
    console.log(`WebSocket server ready`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
