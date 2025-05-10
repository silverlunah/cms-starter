import { FastifyInstance } from "fastify";
import { verifyJWT } from "../plugins/protect";
import {
  createAllowedHost,
  updateAllowedHost,
  deleteAllowedHost,
  getAllAllowedHosts,
} from "../services/index";

export async function allowedHostsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/allowed-hosts",
    { preHandler: [verifyJWT] },
    async (req, reply) => {
      try {
        const allowedHosts = await getAllAllowedHosts();
        reply.send({ allowedHosts });
      } catch (error) {
        console.error("Failed to fetch allowed hosts:", error);
        reply.status(500).send({ error: "Unable to retrieve allowed hosts" });
      }
    }
  );

  fastify.post(
    "/create-allowed-host",
    {
      preHandler: [verifyJWT],
      schema: {
        body: {
          type: "object",
          properties: {
            url: { type: "string" },
            displayName: { type: "string", maxLength: 64 },
          },
          required: ["url", "displayName"],
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { url, displayName } = request.body as {
        url: string;
        displayName: string;
      };

      try {
        const newAllowedHost = await createAllowedHost(url, displayName);
        reply.code(201).send({
          message: "Allowed host created successfully",
          allowedHost: newAllowedHost,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    }
  );

  fastify.put(
    "/update-allowed-host/:id",
    {
      preHandler: [verifyJWT],
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            url: { type: "string" },
            displayName: { type: "string", maxLength: 64 },
          },
          required: ["url", "displayName"],
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { url, displayName } = request.body as {
        url: string;
        displayName: string;
      };

      try {
        const updatedAllowedHost = await updateAllowedHost(Number(id), {
          url,
          displayName,
        });

        reply.send({
          message: "Allowed host updated successfully",
          allowedHost: updatedAllowedHost,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    }
  );

  fastify.delete(
    "/allowed-hosts/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const deletedAllowedHost = await deleteAllowedHost(Number(id));
        reply.send({
          message: "Allowed host deleted successfully",
          allowedHost: deletedAllowedHost,
        });
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          (error.message.includes("Record to delete does not exist") ||
            error.message.includes("No User found"))
        ) {
          reply.status(404).send({ error: "User not found" });
        } else if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    }
  );
}
