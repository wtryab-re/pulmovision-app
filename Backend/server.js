import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import caseRouter from "./routes/caseRoute.js";
import colors from "colors";

//used to load environment variables from a .env file into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - used to parse JSON bodies and handle CORS
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cases", caseRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Connect to MongoDB function (cleaner, without deprecated options)
const connectDB = async () => {
  try {
    // Mongoose 6+ automatically handles these options (useNewUrlParser, useUnifiedTopology)
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected Successfully to fypdb");
    return true; // Return a success indicator
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err);
    // Do NOT call process.exit(1) here yet; let the caller decide.
    return false;
  }
};

// Start Server function (only runs after successful DB connection)
const startServer = () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`.green.bold);
  });
};

// Main execution logic
const init = async () => {
  const isConnected = await connectDB();

  if (isConnected) {
    startServer();
  } else {
    // Exit if DB connection fails
    process.exit(1);
  }
};

init();
