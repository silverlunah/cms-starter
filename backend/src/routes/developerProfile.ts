import { FastifyInstance } from "fastify";
import { getDeveloperProfile } from "../services/developerProfileService";

export async function developerProfileRoutes(fastify: FastifyInstance) {
  fastify.get("/developer-profile", async (req, reply) => {
    try {
      const developerProfile = await getDeveloperProfile();
      reply.send({ developerProfile });
    } catch (error) {
      console.error("Failed to fetch developer profile:", error);
      reply.status(500).send({ error: "Unable to retrieve developer profile" });
    }
  });
}
