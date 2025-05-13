import { FastifyInstance } from "fastify";
import { verifyJWT } from "../plugins/protect";
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  toggleUserStatus,
} from "../services/index";

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { preHandler: [verifyJWT] }, async (req, reply) => {
    return { user: req.user };
  });

  fastify.get("/users", { preHandler: [verifyJWT] }, async (req, reply) => {
    try {
      const users = await getAllUsers();
      reply.send({ users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      reply.status(500).send({ error: "Unable to retrieve users" });
    }
  });

  fastify.post(
    "/create-user",
    {
      preHandler: [verifyJWT],
      schema: {
        body: {
          type: "object",
          required: ["email", "password", "firstName", "lastName", "role"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            firstName: { type: "string", minLength: 1 },
            lastName: { type: "string", minLength: 1 },
            username: { type: "string", minLength: 6 },
            address: { type: "string" },
            occupation: { type: "string" },
            organization: { type: "string" },
            role: { type: "number", enum: [0, 1, 99] },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const {
        email,
        password,
        firstName,
        lastName,
        username,
        address,
        occupation,
        organization,
        role,
      } = request.body as {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        username: string;
        address?: string;
        occupation?: string;
        organization?: string;
        role: number;
      };

      try {
        const newUser = await createUser(
          email,
          password,
          firstName,
          lastName,
          username,
          role,
          address,
          occupation,
          organization,
        );
        reply
          .code(201)
          .send({ message: "User created successfully", user: newUser });
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    },
  );

  fastify.put(
    "/update-user/:id",
    {
      preHandler: [verifyJWT],
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          required: [
            "email",
            "firstName",
            "lastName",
            "username",
            "address",
            "occupation",
            "organization",
            "role",
          ],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            firstName: { type: "string", minLength: 1 },
            lastName: { type: "string", minLength: 1 },
            username: { type: "string", minLength: 6 },
            address: { type: "string" },
            occupation: { type: "string" },
            organization: { type: "string" },
            role: { type: "number", enum: [0, 1, 99] },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const {
        email,
        password,
        firstName,
        lastName,
        username,
        role,
        address,
        occupation,
        organization,
      } = request.body as {
        email: string;
        password?: string;
        firstName: string;
        lastName: string;
        username: string;
        role: number;
        address?: string;
        occupation?: string;
        organization?: string;
      };

      try {
        const updatedUser = await updateUser(id, {
          email,
          password,
          firstName,
          lastName,
          username,
          role,
          address,
          occupation,
          organization,
        });

        reply.send({ message: "User updated successfully", user: updatedUser });
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    },
  );

  fastify.post(
    "/disable-user",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id, isActive } = request.body as {
        id: string;
        isActive: boolean;
      };

      try {
        let user = await toggleUserStatus(id, isActive);
        reply.send({
          message: isActive ? "User Disabled" : "User Enabled",
          user,
        });
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          (error.message.includes("Record to disable/enable does not exist") ||
            error.message.includes("No User found"))
        ) {
          reply.status(404).send({ error: "User not found" });
        } else if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    },
  );

  fastify.delete(
    "/users/:id",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const deletedUser = await deleteUser(id); // or UUID if needed
        reply.send({
          message: "User deleted successfully",
          user: deletedUser,
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
    },
  );
}
