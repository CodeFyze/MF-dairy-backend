import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  taskStatus: { type: Boolean, required: true, default: false },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairyFarm"}
});

export const Task = mongoose.model("Task", taskSchema);
