import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { authRoutes, usersRoutes } from "./routes/index";
import fastifyCookie from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import dotenv from "dotenv";
import { getAllowedOrigins } from "./utils/dbUtils";

dotenv.config();

const fastify = Fastify();

/**-----------------------
 *   CORS configuration  
 ------------------------*/
let allowedOrigins: string[] = [];

getAllowedOrigins().then((origins) => {
  allowedOrigins = origins;
});

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

/**-----------------------
 *  Routes configuration  
 ------------------------*/
fastify.register(authRoutes, usersRoutes);

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

/**-----------------------
 *     Server Startup 
 *     configuration  
 ------------------------*/
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
