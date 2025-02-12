import mongoose from "mongoose";

const milkSaleSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"MilkSaleVendor"         
  },
  amount_sold: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  total_payment: {
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

export const MilkSale = mongoose.model("MilkSale", milkSaleSchema);
