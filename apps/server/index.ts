import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import "dotenv/config";
import morgan from "morgan";
import dotenv from "dotenv";
import { seedDB } from "./utils/db";
import {
  AtlassianOAuthHandler,
  AtlassianOAuthInitiator,
  cognitoOAuthHandler,
  PROVIDER_MAPPING,
} from "./utils/provider";
dotenv.config({ path: "../.env" });

const app: Express = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 200,
  message: "Too many requests from this IP, please try again after 10 minutes",
});
app.use(morgan("dev") as any);

//@ts-ignore
app.use(helmet());
app.use("/api", limiter);
app.use(hpp() as any);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remeber-token",
      "Origin",
      "Accept",
    ],
  }),
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Backend of opsNinja. ",
    version: "1.0.0",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
});
app.get("/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
});
declare global {
  namespace Express {}
}

app.get("/api/v1/auth/jira", AtlassianOAuthInitiator);
app.get("/api/v1/auth/jira/callback", AtlassianOAuthHandler);
app.get("/api/v1/auth/cognito/callback", cognitoOAuthHandler);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});
seedDB()
  .then(() => {
    console.log("DB Ready");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server start at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch(() => {
    console.log("ERROR connecting to db....");
  });

export { app as default };
