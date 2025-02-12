import mongoose from "mongoose";

const feedInventorySchema = mongoose.Schema({
  
    totalAmount: { type: Number,required: true },
    availableAmount: { type: Number,required: true },
    date:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User", required: true},
    dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairFarm"},
})

export const FeedInventory=mongoose.model("FeedInventory",feedInventorySchema)