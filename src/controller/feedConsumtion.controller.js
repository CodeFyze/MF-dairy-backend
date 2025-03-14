import { Cow } from "../models/cow.model.js";
import { DairyFarm } from "../models/dairyForm.js";
import { FeedConsumtion } from "../models/feedConsumtion.model.js";
import { FeedInventory } from "../models/feedInventory.model.js";
import { ApiError } from "../utlis/ApiError.js";

const morningFeedConsumtion = async (req, res, next) => {
  const { cowId, date, morning } = req.body;

  if (!cowId || !date || !morning) {
    return next(new ApiError(400, "All Fields are required"));
  }
  const dateObj = new Date(date);

  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  const regex = new RegExp(`${month}.*${year}`, "i");

  //here we are checking that for this month and year feedInventory exists or not

  const feedAmount = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
    date: { $regex: regex },
  });


  if (!feedAmount) {
    return next(new ApiError(400, "Feed Inventory does not exist for this month - please create"));
  }

  const existsTodayFeedConsumtion = await FeedConsumtion.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { evening: { $gt: 0 } },
    ],
  });

  if (existsTodayFeedConsumtion) {
    return next(
      new ApiError(
        400,
        "Today Feed Consumtion for this cow and date already exists"
      )
    );
  }

  const existsMorningFeedSumtion = await FeedConsumtion.findOne({
    cowId,
    date,
    morning: { $exists: true },
  });

  if (existsMorningFeedSumtion) {
    return next(
      new ApiError(
        400,
        "Morning Feed Consumtion for this cow and date already exists"
      )
    );
  }



  //here we are checking that amount is available or not 


  if (feedAmount.availableAmount < morning) {
    return next(new ApiError(400, "Not enough feed amount please update your feed inventory"));
  }

  const morningFeedConsumtion = await FeedConsumtion.create({
    cowId,
    morning,
    date,
    dairyFarmId: req.user.dairyFarmId,
    createdBy: req?.user._id,
    total: morning,
    evening: 0,
  });

  if (!morningFeedConsumtion) {
    return next(new ApiError(500, "Error creating morning Feed Consumtion"));
  }

  feedAmount.availableAmount = feedAmount.availableAmount - morning;
  await feedAmount.save();

  res.status(201).json({
    message: "Morning Feed Consumtion created successfully",
    success: true,
    morningFeedConsumtion,
  });
};

const eveningFeedConsumtion = async (req, res, next) => {
  const { cowId, date, evening } = req.body;

  if (!cowId || !date || !evening) {
    return next(new ApiError(400, "All Fields are required"));
  }

  const dateObj = new Date(date);

  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  const regex = new RegExp(`${month}.*${year}`, "i");

  //here we are checking that for this month and year feedInventory exists or not

  const feedAmount = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
    date: { $regex: regex },
  });


  if (!feedAmount) {
    return next(new ApiError(400, "Feed Inventory does not exist for this month - please create"));
  }


  const existsTodayFeedConsumtion = await FeedConsumtion.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { evening: { $gt: 0 } },
    ],
  });

  if (existsTodayFeedConsumtion) {
    return next(
      new ApiError(
        400,
        "Today Feed Consumtion for this cow and date already exists"
      )
    );
  }

  const existsMorningFeedSumtion = await FeedConsumtion.findOne({
    cowId,
    date,
    morning: { $exists: true },
  });

  if (!existsMorningFeedSumtion) {
    return next(
      new ApiError(400, "Morning  feed consumtion does not exist for this cow")
    );
  }


  if (feedAmount.availableAmount < evening) {
    return next(new ApiError(400, "Not enough feed amount"));
  }

  existsMorningFeedSumtion.evening = evening;
  existsMorningFeedSumtion.total = evening + existsMorningFeedSumtion.morning;
  await existsMorningFeedSumtion.save();

  feedAmount.availableAmount = feedAmount.availableAmount - evening;
  await feedAmount.save();

  res.status(201).json({
    message: "evening Feed Consumtion created successfully",
    success: true,
  });
};

const getFeedConsumtionRecordByMonth = async (req, res, next) => {
  let { date } = req.params;

  const dateObj = new Date(date);

  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  const regex = new RegExp(`${month}.*${year}`, "i");




  const feedConsumtionRecordMonthly = await FeedConsumtion.aggregate([
    {
      $match: {
        $and: [
          { date: { $regex: regex } },
          { dairyFarmId: req.user.dairyFarmId },
        ],
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

  res.status(200).json({
    success: true,
    message: "succesfully get monthly feed consumtion record",
    feedConsumtionRecordMonthly,
  });
};

const getTodayFeedConsumtionRecord = async (req, res, next) => {
  const { date } = req.params;

  const todayFeedConsumtionRecord = await FeedConsumtion.aggregate([
    {
      $match: {
        $and: [
          { date },
          { dairyFarmId: req.user.dairyFarmId },
          { evening: { $exists: true } },
        ],
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

  if (!todayFeedConsumtionRecord) {
    return next(new ApiError(404, "Error while getting Feed Consumtion today record"));
  }

  res.status(200).json({
    success: true,
    message: "succesfully get today Feed Consumtion records",
    todayFeedConsumtionRecord,
  });
};

const getTodayFeedConsumtionCount = async (req, res, next) => {
  const { date } = req.params;
  const todayFeedConsumtionCount = await FeedConsumtion.aggregate([
    {
      $match: {
        $and: [
          { date },
          { dairyFarmId: req.user.dairyFarmId },
          { evening: { $exists: true } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        morning: { $sum: "$morning" },
        evening: { $sum: "$evening" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "get today feed consumtion count  successfully",
    todayFeedConsumtionCount,
  });
};

// const updateFeedConsumtionRecordById = async (req, res, next) => {
//   const { _id } = req.params;
//   const { morning, evening } = req.body;

//   if (!morning &&!evening) {
//     return next(new ApiError(400, "Morning or Evening feed consumption is required"));
//   }

//   const feedAmount = await FeedInventory.findOne({
//     dairyFarmId: req.user.dairyFarmId,
//   });
//   if (!feedAmount) {
//     next(new ApiError(400, "Error Occur while fetching feed amount"));
//   }


//   const existsFeedConsumtionRecord = await FeedConsumtion.findOne({ _id });

//   morningUpdate=Math.abs(existsFeedConsumtionRecord.morning-morning)
//   eveningUpdate=Math.abs(existsFeedConsumtionRecord.evening-evening)



//   if (!existsFeedConsumtionRecord) {
//     return next(new ApiError(404, "Feed Consumtion record not found"));
//   }

//   existsFeedConsumtionRecord.morning = morning || existsFeedConsumtionRecord.morning;
//   existsFeedConsumtionRecord.evening = evening || existsFeedConsumtionRecord.evening;
//   existsFeedConsumtionRecord.total = morning + evening;
//   await existsFeedConsumtionRecord.save();

//   res.status(200).json({
//     success: true,
//     message: "Feed Consumtion record updated successfully",
//   });
// };

const deleteFeedConsumtionRecord = async (req, res, next) => {
  const { _id } = req.params;

  const consumptionRecord = await FeedConsumtion.findOne({ _id: _id });

  if (!consumptionRecord) {
    return next(new ApiError(404, "Feed Consumtion record not found"));
  }

  const feedAmount = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
  });

  //update feedInventoy
  feedAmount.feedAmount = feedAmount.feedAmount + consumptionRecord.total
  await feedAmount.save();


  const deleteFeedConRecord = await FeedConsumtion.deleteOne({ _id });

  if (!deleteFeedConRecord) {
    return next(new ApiError(500, "Error deleting Feed Consumtion record"));
  }


  res.status(200).json({
    success: true,
    message: "Feed Consumtion record deleted successfully",
  });
};


const getFeedConsumtionRecordBtwTwoDates = async (req, res, next) => {
  let { startdate,enddate } = req.params;

   startdate = new Date(startdate);
   enddate = new Date(enddate);




  const feedConsumtionRecord = await FeedConsumtion.aggregate([
    {
      $match: { 
        dairyFarmId: req.user.dairyFarmId
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

  const feedConsumtionRecordBetweenTwoDates=await feedConsumtionRecord.filter(feed=>{
    const feedDate=new Date(feed.date)
    return feedDate >=startdate && feedDate <=enddate
  })

  res.status(200).json({
    success: true,
    message: `Successfully get feed consumtion Record between ${startdate.slice(0,15)} and ${enddate.slice(0,15)} dates`,
    feedConsumtionRecordBetweenTwoDates,
  });
};

export {
  morningFeedConsumtion,
  eveningFeedConsumtion,
  getFeedConsumtionRecordByMonth,
  getTodayFeedConsumtionRecord,
  getTodayFeedConsumtionCount,
  deleteFeedConsumtionRecord,
  getFeedConsumtionRecordBtwTwoDates
};
