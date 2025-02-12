import mongoose from "mongoose";

const personalMilkUsageSchema = new mongoose.Schema({
  date: {
    type: String, 
    required: true,
  },
  reason: {
    type: String, 
    required: true,
  },
  amount_used: {
    type: Number, 
    required: true,
    min: 0,
  },
  dairyFarmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DairyFarm",
    required: true,
  },
});

export const PersonalMilkUsage = mongoose.model("PersonalMilkUsage", personalMilkUsageSchema);
