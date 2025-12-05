import mongoose from "mongoose";

//schema of the user model that is used to CRUD user data in the database
const caseSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientHistory: { type: String, required: true },
    imageUrl: { type: String, required: true },
    /*caseWorkerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },*/
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;
