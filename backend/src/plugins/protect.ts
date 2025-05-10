import { FastifyRequest, FastifyReply } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.token;

  if (!token) {
    return reply.status(401).send({ error: "Not authenticated" });
  }

  try {
    // Verify the token (automatically uses cookie)
    const decoded = await request.jwtVerify();
    request.user = decoded;
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return reply.status(401).send({ error: "Invalid token", token });
  }
}
