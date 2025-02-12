import { PersonalMilkUsage } from "../models/personal.model.js";
import { MilkSale } from "../models/milkSale.model.js";

import { ApiError } from "../utlis/ApiError.js";

const addMilkUsage = async (req, res, next) => {
  const { date, reason, amount_used } = req.body;

  if (!date || !reason || !amount_used) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const milkUsage = await PersonalMilkUsage.create({
      date,
      reason,
      amount_used,
      dairyFarmId: req.user.dairyFarmId,
    });



    if (!milkUsage) {
      return next(
        new ApiError(400, "Error Occured while creating personal milk usage")
      );
    }
    res.status(200).json({ success:true,message: "Personal milk usage added successfully" });
  } catch (err) {
    next(err);
  }
};


export {addMilkUsage}