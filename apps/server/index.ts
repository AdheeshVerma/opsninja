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
import morgan from "morgan";
import { getConfigValue, loadConfig } from "./utils/config";
import { seedDB } from "./utils/db";
import {
  AtlassianOAuthHandler,
  AtlassianOAuthInitiator,
  cognitoOAuthHandler,
} from "./utils/provider";

await loadConfig();

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
    origin: [getConfigValue("FRONTEND_URL", "http://localhost:3000")],
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
    environment: getConfigValue("NODE_ENV", "development"),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: getConfigValue("FRONTEND_URL", "http://localhost:3000"),
  });
});
app.get("/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date(),
    environment: getConfigValue("NODE_ENV", "development"),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: getConfigValue("FRONTEND_URL", "http://localhost:3000"),
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
    const port = getConfigValue("PORT", "8000");

    console.log("DB Ready");
    app.listen(port, () => {
      console.log(`server start at port : ${port}`);
    });
  })
  .catch(() => {
    console.log("ERROR connecting to db....");
  });

export { app as default };
