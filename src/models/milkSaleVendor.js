import mongoose from "mongoose";

const milkSaleVendorSchema = new mongoose.Schema({
     name:{
      type:String,
      required:true,
      unique:true
     }
});

export const MilkSaleVendor = mongoose.model("MilkSaleVendor", milkSaleVendorSchema);
