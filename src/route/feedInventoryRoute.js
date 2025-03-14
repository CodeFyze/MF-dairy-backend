

import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addAmountToExistsInventory, addFeed, getFeedInventoryDetails, getFeedInventoryDetailsByDay, getFeedInventoryDetailsByTwoDates, subtractAmount } from "../controller/feedInventory.controller.js";


const feedInventoryRoute=Router()


feedInventoryRoute.route("/month/:date").get(auth,getFeedInventoryDetails)
feedInventoryRoute.route("/day/:date").get(auth,getFeedInventoryDetailsByDay)
feedInventoryRoute.route("/getDetailsBetweenTwoDates").get(auth,getFeedInventoryDetailsByTwoDates)
feedInventoryRoute.route("/addFeed").put(auth,addFeed)
feedInventoryRoute.route("/plusAmount/:inventoryId").patch(addAmountToExistsInventory)
feedInventoryRoute.route("/subtractAmount/:inventoryId").patch(subtractAmount)

export {feedInventoryRoute}