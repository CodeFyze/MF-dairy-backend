import mongoose, { mongo } from "mongoose";
import { MilkSale } from "../models/milkSale.model.js";
import { ApiError } from "../utlis/ApiError.js";

const addSaleMilk = async (req, res, next) => {
  const { vendorId, amount_sold, date, total_payment } = req.body;

  if (!vendorId || !amount_sold || !date || !total_payment) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {


    const milkSale = await MilkSale.create({
      vendorId,
      amount_sold,
      date,
      total_payment,
      dairyFarmId: req.user.dairyFarmId,
    });
    if (!milkSale) {
      return next(new ApiError(500, "Error creating Milk Sale"));
    }
    res.status(201).json({
      success: true,
      message: "Milk Sale created successfully",
      milkSale,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyMilkSaleRecord = async (req, res, next) => {
  const date = new Date(req.params.date);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();


  try {
    const monthlyMilkRecord = await MilkSale.aggregate([
      {
        $match: {
          $and: [
            { dairyFarmId: req.user.dairyFarmId },
            { date: { $regex: `${month}.*${year}`, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "milksalevendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $addFields: {
          vendor: { $arrayElemAt: ["$vendor", 0] }
        }
      },
      {
        $project: {
          _id: 1,
          vendor: 1,
          amount_sold: 1,
          date: 1,
          total_payment: 1
        }
      }
    ]);

    res.json({
      success: true,
      message: "successfully get monthly milk Record",
      monthlyMilkRecord,
    });
  } catch (error) {
    next(error);
  }
};


const getSaleMilkByVendorId = async (req, res, next) => {
  let { vendorId } = req.params;
  vendorId = new mongoose.Types.ObjectId(vendorId)
  try {
    const monthlyMilkRecord = await MilkSale.aggregate([
      {
        $match: {
          $and: [{ dairyFarmId: req.user.dairyFarmId }, { vendorId }],
        },
      }

    ]);

    res.json({
      success: true,
      message: "successfully get monthly milk Record",
      monthlyMilkRecord,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMilkSalesRecordbyId = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const milkSale = await MilkSale.findByIdAndDelete({ _id });
    if (!milkSale) {
      return next(new ApiError(404, "Milk Sale record not found"));
    }
    res.json({
      success: true,
      message: "Milk Sale record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateMilkSaleRecordById = async (req, res, next) => {
  const { _id } = req.params;

  const { amount_sold, date, total_payment } = req.body;
  try {
    const milkSale = await MilkSale.findOne({ _id: _id })

    if (!milkSale) {
      return next(new ApiError(404, "Milk Sale record not found"));
    }

    milkSale.amount_sold = amount_sold || milkSale.amount_sold;
    milkSale.date = date || milkSale.date;
    milkSale.total_payment = total_payment || milkSale.total_payment;
    await milkSale.save();

    res.json({
      success: true,
      message: "Milk Sale record updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


const getMilksaleRecordBtwTwoDates = async (req, res, next) => {
  let { startdate, enddate } = req.body

  startdate = new Date(startdate)
  enddate = new Date(enddate)


  try {
    const MilkRecord = await MilkSale.aggregate([
      {
        $match: {
          dairyFarmId: req.user.dairyFarmId
        },
      },
      {
        $lookup: {
          from: "milksalevendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $addFields: {
          vendor: { $arrayElemAt: ["$vendor", 0] }
        }
      },
      {
        $project: {
          _id: 1,
          vendor: 1,
          amount_sold: 1,
          date: 1,
          total_payment: 1
        }
      }
    ]);

    const milkSaleRecordBetweenTwoDates = MilkRecord.filter(milkSR => {
      const milkSaleDate = new Date(milkSR.date)
      return milkSaleDate >= startdate && milkSaleDate <= enddate
    })

    res.json({
      success: true,
      message: `Successfully get milk sale Record between ${startdate.toString().slice(0,15)} and ${enddate.toString().slice(0,15)} dates`,
      milkSaleRecordBetweenTwoDates,
    });
  } catch (error) {
    next(error);
  }
};


const getSaleMilkBtDatesAndVendorId = async (req, res, next) => {
  let { vendorId } = req.params;
  
  let { startdate, enddate } = req.body

  startdate = new Date(startdate)
  enddate = new Date(enddate)


  vendorId = new mongoose.Types.ObjectId(vendorId)
  try {
    const milkRecord = await MilkSale.aggregate([
      {
        $match: {
          $and: [{ dairyFarmId: req.user.dairyFarmId }, { vendorId }],
        },
      }

    ]);

    const milkSaleRecordBetweenTwoDatesByVendorId = milkRecord.filter(milkSR => {
      const milkSaleDate = new Date(milkSR.date)
      return milkSaleDate >= startdate && milkSaleDate <= enddate
    })

    res.json({
      success: true,
      message: `Successfully get milk sale Record between ${startdate.toString().slice(0,15)} and ${enddate.toString().slice(0,15)} dates`,
      milkSaleRecordBetweenTwoDatesByVendorId,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addSaleMilk,
  getMonthlyMilkSaleRecord,
  getSaleMilkByVendorId,
  deleteMilkSalesRecordbyId,
  updateMilkSaleRecordById,
  getMilksaleRecordBtwTwoDates,
  getSaleMilkBtDatesAndVendorId
};
