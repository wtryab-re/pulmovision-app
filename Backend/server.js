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

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully to fypdb");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`.green.bold)
    );
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

connectDB();
