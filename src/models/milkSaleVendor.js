import mongoose from "mongoose";

const milkSaleVendorSchema = new mongoose.Schema({
     name:{
      type:String,
      required:true
     },
     dairyFarmId:{
          type:mongoose.Schema.Types.ObjectId,
          required:true
     }
});

export const MilkSaleVendor = mongoose.model("MilkSaleVendor", milkSaleVendorSchema);
