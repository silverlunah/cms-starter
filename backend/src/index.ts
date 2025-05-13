import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  allowedHostsRoutes,
  authRoutes,
  developerProfileRoutes,
  usersRoutes,
} from "./routes/index";
import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import dotenv from "dotenv";
import { getAllowedOrigins } from "./utils/dbUtils";

dotenv.config();

const fastify = Fastify();

/**-----------------------
 *   CORS configuration  
 ------------------------*/
let allowedOrigins: string[] = [];

const setupCors = async () => {
  allowedOrigins = await getAllowedOrigins();

  fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
};

/**-----------------------
 *  Routes configuration  
 ------------------------*/
fastify.register(authRoutes);
fastify.register(usersRoutes);
fastify.register(allowedHostsRoutes);
fastify.register(developerProfileRoutes);

/**-----------------------
 *    JWT configuration  
 ------------------------*/
fastify.register(fastifyCookie);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment");
}

fastify.register(fastifyJWT, {
  secret: process.env.JWT_SECRET as string,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

fastify.register(fastifyCsrfProtection);

/**-----------------------
 *     Server Startup 
 *     configuration  
 ------------------------*/
const start = async () => {
  try {
    // Wait for CORS setup to complete before starting the server
    await setupCors();

    // Now start the server
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
