import { FastifyInstance } from "fastify";
import { authenticateUser } from "../services/index";
import { getCookieDomain } from "../utils/authUtils";

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const domain = await getCookieDomain();

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      const user = await authenticateUser(email, password);

      const token = fastify.jwt.sign({
        id: user.id,
        avatarUrl: user.avatarUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      reply
        .header("Cache-Control", "no-store")
        .setCookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
          ...(process.env.NODE_ENV === "production" && {
            domain: domain,
          }),
        })
        .send({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            email: user.email,
            username: user.username,
            role: user.role,
          },
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        reply.status(401).send({ error: error.message });
      } else {
        reply.status(500).send({ error: "An unexpected error occurred" });
      }
    }
  });

  fastify.get("/logout", async (req, reply) => {
    reply
      .clearCookie("token", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        ...(process.env.NODE_ENV === "production" && {
          domain: domain,
        }),
      })
      .send({ message: "Logged out" });
  });
}
