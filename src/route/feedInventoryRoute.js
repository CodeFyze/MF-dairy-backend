

import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addAmountToExistsInventory, addFeed, getFeedInventoryDetails, subtractAmount } from "../controller/feedInventory.controller.js";


const feedInventoryRoute=Router()


feedInventoryRoute.route("/:date").get(auth,getFeedInventoryDetails)
feedInventoryRoute.route("/addFeed").put(auth,addFeed)
feedInventoryRoute.route("/plusAmount/:inventoryId").patch(addAmountToExistsInventory)
feedInventoryRoute.route("/subtractAmount/:inventoryId").patch(subtractAmount)
export {feedInventoryRoute}