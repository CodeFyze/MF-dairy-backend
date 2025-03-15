import { FeedInventory } from "../models/feedInventory.model.js";
import { ApiError } from "../utlis/ApiError.js";

const getFeedInventoryDetails = async (req, res, next) => {
  const { date } = req.params;
  const dateObj = new Date(date);

  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  const regex = new RegExp(`${month}.*${year}`, "i");

  const feedInventory = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
    date: { $regex: regex },
  });

  if (!feedInventory) {
    return next(
      new ApiError(404, "Feed inventory record for this month is not added yet")
    );
  }

  res.status(200).json({
    message: "Feed inventory retrieved successfully for the current month",
    success: true,
    feedInventory,
  });
};



const getFeedInventoryHistoryByIvid = async (req, res, next) => {
  const { invId } = req.params;

  const feedInventory = await FeedInventory.findOne({ _id: invId });

  if (!feedInventory) {
    return next(
      new ApiError(404, "Feed inventory not found")
    );
  }

  res.status(200).json({
    message: "Feed inventory history get successfully ",
    success: true,
    feedInventoryHistory: feedInventory.history,
  });
};


const addFeed = async (req, res, next) => {
  const { totalAmount, date } = req.body;

  const dateObj = new Date(date);

  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();

  const regex = new RegExp(`${month}.*${year}`, "i");

  const existsFeedInventory = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
    date: { $regex: regex },
  });

  if (existsFeedInventory) {
    return next(
      new ApiError(400, "FeedInventory Already exist for this month")
    );
  }

  const feedInventory = await FeedInventory.create({
    totalAmount,
    date,
    availableAmount: totalAmount,
    dairyFarmId: req.user.dairyFarmId,
    createdBy: req.user._id,
    history: [{ date, changeAmount: totalAmount, updatedAmount: totalAmount, action: "+", modifiedBy: req.user._id }]
  });

  if (!feedInventory) {
    return next(
      new ApiError(500, "Failed to add feed inventory for this month ")
    );
  }

  res.status(200).json({
    success: true,
    message: "Feed inventory successfully added for this Month",
  });
};

const addAmountToExistsInventory = async (req, res, next) => {
  const { inventoryId } = req.params;
  const { addAmount, date } = req.body;

  try {
    const existsInventory = await FeedInventory.findOne({ _id: inventoryId });

    if (!existsInventory) {
      return next(new ApiError(404, "Feed inventory record  not found"));
    }

    existsInventory.availableAmount = existsInventory.availableAmount + addAmount;
    existsInventory.totalAmount = existsInventory.totalAmount + addAmount;
    existsInventory.history.push(
      {
        date,
        changeAmount: addAmount,
        updatedAmount: existsInventory.availableAmount + addAmount,
        action: "+", modifiedBy: req.user._id
      }
    )
    await existsInventory.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully Added Amount to Inventory",
      });
  } catch (error) {
    return next(error);
  }
};

const subtractAmount = async (req, res, next) => {
  const { inventoryId } = req.params;
  const { subtractAmount, date } = req.body;

  try {
    const existsInventory = await FeedInventory.findOne({ _id: inventoryId });

    if (!existsInventory) {
      return next(new ApiError(404, "Feed inventory record  not found"));
    }

    if (existsInventory.availableAmount == 0) {
      return next(new ApiError(400, "You can Subtract Amount from Inventory"));
    }

    const aAmount = existsInventory.availableAmount

    if (aAmount - subtractAmount < 0) {

      return next(new ApiError(400, "Insufficient Inventory"));
    }

    existsInventory.availableAmount = existsInventory.availableAmount - subtractAmount;
    existsInventory.totalAmount = existsInventory.totalAmount - subtractAmount;

    existsInventory.history.push(
      {
        date,
        changeAmount: subtractAmount,
        updatedAmount: existsInventory.availableAmount - subtractAmount,
        action: "-", modifiedBy: req.user._id
      }
    )

    await existsInventory.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully Added Amount to Inventory",
      });
  } catch (error) {
    return next(error);
  }
};
const getFeedInventoryDetailsByDay = async (req, res, next) => {
  const { date } = req.params
  try {
    const feedInventory = await FeedInventory.findOne({ date, dairyFarmId: req.user.dairyFarmId })

    if (!feedInventory) {
      return next(new ApiError(404, "FeedInventory record does not found on this date"))
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully get Inventory Record by day",
        feedInventory
      });
  } catch (error) {
    return next(500, `Error occur while getting inventory record ${error.message}`)
  }
}



const getFeedInventoryHistryBetweenTwoDatesByInvId = async (req, res, next) => {
  const { invId } = req.params
  let { startdate, enddate } = req.body

  startdate = new Date(startdate)
  enddate = new Date(enddate)

  console.log(startdate)
  try {
    const feedInventory = await FeedInventory.findOne({ _id: invId })

    if (!feedInventory) {
      return next(new ApiError(404, "FeedInventory record does not found on between these dates"))
    }

    const feedInventoryHistoryBtwTwoDates = feedInventory.history.filter(feed => {
      const feedDate = new Date(feed.date)
      return feedDate >= startdate && feedDate <= enddate
    })



    res
      .status(200)
      .json({
        success: true,
        message: `Successfully get Inventory history of by inventory id between ${startdate.toString().slice(0, 15)} and ${enddate.toString().slice(0, 15)} dates`,
        feedInventoryHistoryBtwTwoDates
      });
  } catch (error) {
    return next(new ApiError(500, `Error occur while getting inventory record by inventoryid between two dates ${error.message}`))
  }
}
export {
  getFeedInventoryDetails,
  addFeed,
  subtractAmount,
  addAmountToExistsInventory,
  getFeedInventoryDetailsByDay,
  getFeedInventoryHistryBetweenTwoDatesByInvId,
  getFeedInventoryHistoryByIvid
};
