import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Error } from "mongoose";
import { errorHandler } from "./middleware/errorHandler";

import userRouter from "./routes/userRouter";
import seedRouter from "./routes/seedRouter";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false   })) ;

// Routes
app.use("/api/v1/seed", seedRouter);
app.use("/api/v1/users", userRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  console.error(
    "❌ MongoDB connection string not found in environment variables"
  );
  process.exit(1); // Exit the process if MongoDB connection string is not defined
}

mongoose
  .connect(mongoConnectionString)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error(`❌ Error connecting to MongoDB: ${err.message}`);
  });
