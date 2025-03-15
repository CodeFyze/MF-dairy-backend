import mongoose from "mongoose";
const historySchema = mongoose.Schema({
    date: { type: String, required: true }, // Date of the change
    changeAmount: { type: Number, required: true }, // The amount added or subtracted
    updatedAmount: { type: Number, required: true }, // The available amount after the change
    action: { type: String, enum: ["+", "-"], required: true }, // Action: + for addition, - for subtraction
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Who made the change
});

const feedInventorySchema = mongoose.Schema({
    totalAmount: { type: Number, required: true },
    availableAmount: { type: Number, required: true }, 
    date: { type: String, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    dairyFarmId: { type: mongoose.Schema.Types.ObjectId, ref: "DairFarm", required: true }, 
    history: [historySchema] 
});

export const FeedInventory = mongoose.model("FeedInventory", feedInventorySchema);
