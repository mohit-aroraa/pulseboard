import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok" };
});

const PORT = 8080;

app.listen({ port: PORT }, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
