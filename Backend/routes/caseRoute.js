import express from "express";
import multer from "multer";
import Case from "../models/Case.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"; // to upload buffer

//multer is used to handle multipart/form-data, which is primarily used for uploading files.
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/cases
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { patientId, patientHistory } = req.body;
    const imageFile = req.file;

    if (!patientId || !patientHistory || !imageFile) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Upload image buffer to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cases" }, // optional folder
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(imageFile.buffer);

    const newCase = new Case({
      patientId,
      patientHistory,
      imageUrl: result.secure_url,
    });

    await newCase.save();

    res
      .status(201)
      .json({ message: "Case created successfully", case: newCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
