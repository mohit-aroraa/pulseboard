import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./db/prisma.ts";
import { Server as IOServer } from "socket.io";


const app = Fastify({ logger: true });

const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret-change-me-please";

async function main() {
  await app.register(cors, {
    origin: CORS_ORIGIN,
    credentials: true,
  });

  await app.register(jwt, { secret: JWT_SECRET });

  // ----- Schemas -----
  const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // ----- Helpers -----
  function signToken(user: { id: string; email: string; name: string }) {
    // token payload minimal; userId in `sub` is standard
    // return app.jwt.sign({ email: user.email, name: user.name }, { subject: user.id });
    const token = app.jwt.sign({ userId: user.id, email: user.email, name: user.name });
    return token;
  }

  async function requireAuth(req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  }

  // ----- Routes -----
  app.get("/v1/health", async () => ({ ok: true }));

  app.post("/v1/auth/register", async (req, reply) => {
    const { name, email, password } = RegisterSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(409).send({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    });

    const token = signToken(user);
    return { token, user };
  });

  app.post("/v1/auth/login", async (req, reply) => {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ message: "Invalid credentials" });

    const token = signToken(user);
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  });

  app.get("/v1/me", { preHandler: requireAuth }, async (req: any, reply) => {
    const userId = req.user?.userId;

    if (!userId || typeof userId !== "string") {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    // console.log("decoded user:", req.user);


    if (!user) return reply.code(404).send({ message: "User not found" });

    return { user };
  });

  app.decorate("auth", async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
  } catch (err: any) {
    app.log.error(
      {
        msg: err?.message,
        name: err?.name,
        code: err?.code,
        statusCode: err?.statusCode,
        authorizationHeader: req.headers?.authorization,
      },
      "jwtVerify failed"
    );
    return reply.code(401).send({ message: "Unauthorized" });
  }
});


  // start Fastify and attach Socket.IO to its server
  await app.listen({ port: PORT, host: "0.0.0.0" });

  const io = new IOServer(app.server, {
    cors: { origin: CORS_ORIGIN },
  });

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing token"));

    // Verify using fastify-jwt (same secret)
    const payload = app.jwt.verify(token) as any;

    // attach user info to socket
    socket.data.userId = payload.userId; // we put this in JWT payload earlier
    socket.data.name = payload.name;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId as string;
  const name = socket.data.name as string;

  socket.on("board:join", ({ boardId }: { boardId: string }) => {
    socket.join(`board:${boardId}`);
    io.to(`board:${boardId}`).emit("presence:update", {
      boardId,
      userId,
      name,
      status: "online",
      at: new Date().toISOString(),
    });
  });

  socket.on("typing:set", ({ boardId, isTyping }: { boardId: string; isTyping: boolean }) => {
    io.to(`board:${boardId}`).emit("typing:update", {
      boardId,
      userId,
      name,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    // optional: could broadcast offline if we track board membership
  });
});

app.log.info(`API + WS listening on http://localhost:${PORT}`);

}

main().catch((e) => {
  app.log.error(e);
  process.exit(1);
});
