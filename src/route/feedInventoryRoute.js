

import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addAmountToExistsInventory, addFeed, getFeedInventoryDetails, getFeedInventoryHistoryByIvid, getFeedInventoryHistryBetweenTwoDatesByInvId, subtractAmount } from "../controller/feedInventory.controller.js";


const feedInventoryRoute=Router()


feedInventoryRoute.route("/month/:date").get(auth,getFeedInventoryDetails)
feedInventoryRoute.route("/:invId").get(auth,getFeedInventoryHistoryByIvid)

feedInventoryRoute.route("/getFeedInventoryHistoryByInventoryId/:invId").get(auth,getFeedInventoryHistryBetweenTwoDatesByInvId)
feedInventoryRoute.route("/addFeed").post(auth,addFeed)
feedInventoryRoute.route("/plusAmount/:inventoryId").patch(auth,addAmountToExistsInventory)
feedInventoryRoute.route("/subtractAmount/:inventoryId").patch(auth,subtractAmount)

export {feedInventoryRoute}