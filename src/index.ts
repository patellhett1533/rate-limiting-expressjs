import express, { NextFunction, Express, Request, Response } from "express";
import connectDB from "./config/db";
import logger from "./config/logger";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import passport from "passport";
import jwtStrategy from "./config/passport";
import limiter from "./config/rate-limit";

require("dotenv").config();

connectDB();

const app: Express = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(compression());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(limiter);
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/v1", routes);
app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Healthy");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`[server]: Server is running at http://localhost:${PORT}`);
});
