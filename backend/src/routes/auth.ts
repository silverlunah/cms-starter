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

      // Sign JWT
      const token = fastify.jwt.sign({ email: user.email });

      // Set cookie with the transformed domain
      reply
        .header("Cache-Control", "no-store") // prevent caching of auth response
        .setCookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day
          ...(process.env.NODE_ENV === "production" && {
            domain: domain,
          }),
        })
        .send({ message: "Login successful", token });
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
