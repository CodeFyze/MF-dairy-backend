import { MilkProduction } from "../models/milkProduction.model.js";
import {FeedConsumtion} from "../models/feedConsumtion.model.js"
import { MedicalRecord } from "../models/medicalRecord.model.js";
import { Cow } from "../models/cow.model.js";
import { ApiError } from "../utlis/ApiError.js";
const getCowReocordBetweenTwoDates=async(req,res,next)=>{
    try {
         let { cowId } = req.params;
          
         let { startdate, enddate } = req.query
        
        
          startdate = new Date(startdate)
          enddate = new Date(enddate)
        
            //check Cow Exists

            const cow=await Cow.findOne({_id:cowId})

            if(!cow){
                return next(new ApiError(404,"Cow not found"))
            }

          //milkInformation
          const milkProductionRecordByCowId = await MilkProduction.aggregate([
            {
              $match: {
                $and: [
                  { dairyFarmId: req.user.dairyFarmId },
                  { cowId:new mongoose.Types.ObjectId(cowId)},
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
                morning: 1,
                evening: 1,
                total: 1,
                date: 1,
                createdBy: { name: "$user.name", _id: "$user._id" },
              },
            },
          ]);
        
        
        

          const milkProductionRecordByCowIdBetweenTwoDates = milkProductionRecordByCowId.filter(milkPR => {
            const milkProductionDate = new Date(milkPR.date)
            return milkProductionDate >= startdate && milkProductionDate <= enddate
          })
        //milkCount
          const milkCount=milkProductionRecordByCowIdBetweenTwoDates.reduce((sum,record)=> sum+record.total,0)
        
        //feedConsumtion record


        
          const feedConsumtionRecordCowId = await FeedConsumtion.aggregate([
            {
              $match: {
                dairyFarmId: req.user.dairyFarmId,
                cowId:new mongoose.Types.ObjectId(cowId)
              },
            },
            {
              $lookup: {
                from: "cows",
                localField: "cowId",
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
                cowId: 1,
                morning: 1,
                evening: 1,
                total: 1,
                date: 1,
                createdBy: { name: "$user.name", _id: "$user._id" },
                cow: {
                  animalNumber: "$cow.animalNumber",
                  _id: "$cow._id",
                  image: "$cow.image",
                },
              },
            },
          ]);
        
        
          const feedConsumtionRecordBetweenTwoDatesByCowId = await feedConsumtionRecordCowId.filter(feed => {
            const feedDate = new Date(feed.date)
            return feedDate >= startdate && feedDate <= enddate
          })
        
          //feedConsumtion count

          const feedConsumtionCount=feedConsumtionRecordBetweenTwoDatesByCowId.reduce((sum,record)=> sum+record.total,0)

        //MedicalRecard

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
        
        
            const cowMedicalRecordBetweenTwoDates = await cowMedicalRecord.filter(cowR => {
              const cowRDate = new Date(cowR.date)
              return cowRDate >= startdate && cowRDate <= enddate
            })


          res.json({
            success: true,
            message: `Successfully get cow details milk , consumtiopn and medical record between ${startdate.toString().slice(0,15)} and ${enddate.toString().slice(0,15)} dates`,
              data:{
                milk:{
                    milkProductionRecordByCowIdBetweenTwoDates,
                    milkCount
                },
                feedConsumtion:{
                    feedConsumtionRecordBetweenTwoDatesByCowId,
                    feedConsumtionCount
                },
                medical:{
                    cowMedicalRecordBetweenTwoDates,
                    vaccinationCount:cowMedicalRecordBetweenTwoDates.length
                }
              },
          });
    } catch (error) {
        next(error)
    }
}


export {getCowReocordBetweenTwoDates}