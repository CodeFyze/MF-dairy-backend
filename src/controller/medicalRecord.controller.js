import mongoose from "mongoose";
import { Cow } from "../models/cow.model.js";
import { MedicalRecord } from "../models/medicalRecord.model.js";
import { ApiError } from "../utlis/ApiError.js";

const addMedicalRecord = async (req, res, next) => {
  const { date, cowId, vaccineType } = req.body;

  if ([date, cowId, vaccineType].some((item) => item.trim() == "")) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existCow = await Cow.findOne({
    $and: [{ _id: cowId }, { dairyFarmId: req.user.dairyFarmId }],
  });

  if (!existCow) {
    return next(new ApiError(400, "Cow Not Found"));
  }

  const medicalRecord = await MedicalRecord.create({
    date,
    cowId,
    vaccineType,
    dairyFarmId: req.user.dairyFarmId,
    createdBy: req.user._id,
  });

  if (!medicalRecord) {
    return next(new ApiError(400, "Error registering medical record"));
  }

  res.status(200).json({
    success: true,
    message: "medical record successfully added",
    medicalRecord,
  });
};

const getMedicalRecord = async (req, res, next) => {

  const date = new Date(req.params.date);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();



  const monthlyMedicalRecord = await MedicalRecord.aggregate([
    {
      $match: {
        $and: [
          { date: { $regex: `${month}.*${year}`, $options: "i" } },
          { dairyFarmId: req.user.dairyFarmId },
        ],
      },
    },
    {
      $group: {
        _id: "$cowId",
        totalVaccine: { $sum: 1 },
        medicalRecords: { $push: "$$ROOT" }

      }
    },
    {
      $lookup: {
        from: "cows",
        localField: "_id",
        foreignField: "_id",
        as: "cow",
      },
    },
    {
      $addFields: {
        cow: { $arrayElemAt: ["$cow", 0] },
      },
    },
    {
      $project: {
        _id: 0,
        cow: { _id: "$cow._id", animalNumber: "$cow.animalNumber", image: "$cow.image" },
        totalVaccine: "$totalVaccine",
        medicalRecords: "$medicalRecords"
      }
    }
  ]);

  if (!monthlyMedicalRecord) {
    return next(
      new ApiError(400, "Error Occur while getting monthly medical records")
    );
  }

  res.status(200).json({
    success: true,
    message: "Succesfully get monthly medical records",
    monthlyMedicalRecord,
  });
};

const getMedicalRecordByCowId = async (req, res, next) => {
  let { cowId } = req.params;
  const date = new Date(req.params.date);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  cowId = new mongoose.Types.ObjectId(cowId);
  try {


    const cowMedicalRecord = await MedicalRecord.aggregate([
      {
        $match: {
          $and: [
            { cowId },
            { dairyFarmId: req.user.dairyFarmId },
            { date: { $regex: `${month}.*${year}`, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $project: {
          vaccineType: 1,
          dairyFarmId: 1,
          date: 1,
          createdBy: { name: "$user.name", _id: "$user._id" },
        },
      },
    ]);

    if (!cowMedicalRecord) {
      return next(
        new ApiError(400, "Error Occur while getting error in cowMedicalRecord")
      );
    }

    res.status(200).json({
      success: true,
      message: "Succesfully get cow medical record",
      cowMedicalRecord,
      vaccinationCount: cowMedicalRecord.length
    });
  } catch (error) {
    next(error);
  }
};


const deleteMedicalRecord = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const deleteMedicalRecord = await MedicalRecord.deleteOne({ _id });

    if (!deleteMedicalRecord) {
      return next(new ApiError(404, "Medical Record not found"));
    }

    res.status(200).json({
      message: "Medical Record deleted successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const updateMedicalRecord = async (req, res, next) => {
  const { _id } = req.params;

  const { vaccineType, date, } = req.body;


  try {
    const medicalRecord = await MedicalRecord.findOne({ _id });

    if (!medicalRecord) {
      return next(new ApiError(404, "Medical Record not found"));
    }

    medicalRecord.vaccineType = vaccineType;
    medicalRecord.date = date;

    await medicalRecord.save();

    res.status(200).json({
      success: true,
      message: "Medical Record updated successfully",

    });

  } catch (error) {
    next(error);
  }
};


const getMedicalRecordBetweenTwoDatesByCowId = async (req, res, next) => {
  let { cowId } = req.params;

  let { startdate, enddate } = req.body;


  try {


    startdate = new Date(startdate);
    enddate = new Date(enddate);

    const cowMedicalRecord = await MedicalRecord.aggregate([
      {
        $match: {
          $and: [
            { cowId: new mongoose.Types.ObjectId(cowId) },
            { dairyFarmId: req.user.dairyFarmId },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $project: {
          vaccineType: 1,
          dairyFarmId: 1,
          date: 1,
          createdBy: { name: "$user.name", _id: "$user._id" },
        },
      },
    ]);

    if (!cowMedicalRecord) {
      return next(
        new ApiError(400, "Cow record not found")
      );
    }


    const cowMedicalRecordBetweenTwoDates = await cowMedicalRecord.filter(cowR => {
      const cowRDate = new Date(cowR.date)
      return cowRDate >= startdate && cowRDate <= enddate
    })


    res.status(200).json({
      success: true,
      message: `Successfully get cow Medical Record by cowId between ${startdate.toString().slice(0, 15)} and ${enddate.toString().slice(0, 15)} dates`,
      cowMedicalRecordBetweenTwoDates,
      vaccinationCount: cowMedicalRecordBetweenTwoDates.length
    });
  } catch (error) {
    next(error);
  }
};





export {
  addMedicalRecord,
  getMedicalRecord,
  getMedicalRecordByCowId,
  deleteMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordBetweenTwoDatesByCowId
};
