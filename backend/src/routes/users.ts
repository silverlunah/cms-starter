import { FastifyInstance } from "fastify";
import { verifyJWT } from "../plugins/protect";
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  toggleUserStatus,
} from "../services/usersService";

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
    "/add-user",
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
            role: { type: "number", enum: [0, 1] },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { email, password, firstName, lastName, role } = request.body as {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: number;
      };

      try {
        const newUser = await createUser(
          email,
          password,
          firstName,
          lastName,
          role
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
    }
  );

  fastify.put(
    "/edit-user/:id",
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
          required: ["email", "firstName", "lastName", "role"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            firstName: { type: "string", minLength: 1 },
            lastName: { type: "string", minLength: 1 },
            role: { type: "number", enum: [0, 1] },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { email, password, firstName, lastName, role } = request.body as {
        email: string;
        password?: string;
        firstName: string;
        lastName: string;
        role: number;
      };

      try {
        const updatedUser = await editUser(Number(id), {
          email,
          password,
          firstName,
          lastName,
          role,
        });

        reply.send({ message: "User updated successfully", user: updatedUser });
      } catch (error: unknown) {
        if (error instanceof Error) {
          reply.status(400).send({ error: error.message });
        } else {
          reply.status(500).send({ error: "An unexpected error occurred" });
        }
      }
    }
  );

  fastify.post(
    "/disable-user",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id, isActive } = request.body as {
        id: number;
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
    }
  );

  fastify.post(
    "/delete-user",
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      const { id } = request.body as { id: number };

      try {
        const deletedUser = await deleteUser(id);
        reply.send({ message: "User deleted successfully", user: deletedUser });
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
