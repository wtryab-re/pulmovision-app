import User from "../models/User.js";

//CONTROLLERS actually do the work of interacting with the database and performing operations
//move this to the website part of the project later

// GET pending workers
export const getPendingWorkers = async (req, res) => {
  try {
    const pendingWorkers = await User.find({
      role: "worker",
      isApproved: false,
    }).select("-password");
    res.json({ success: true, workers: pendingWorkers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Approve worker
export const approveWorker = async (req, res) => {
  try {
    const { workerId, approve } = req.body;
    await User.findByIdAndUpdate(workerId, { isApproved: approve });
    res.json({
      success: true,
      message: `Worker ${approve ? "approved" : "rejected"}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
