import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  getPendingWorkers,
  approveWorker,
} from "../controllers/adminWorkerController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//move to website part later, this is for admin to approve workers
router.get("/pending-workers", getPendingWorkers);
router.post("/approve-worker", approveWorker);

export default router;
