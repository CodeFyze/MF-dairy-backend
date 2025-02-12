import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { deleteFeedConsumtionRecord, eveningFeedConsumtion, getFeedConsumtionRecordByMonth, getTodayFeedConsumtionCount, getTodayFeedConsumtionRecord, morningFeedConsumtion } from "../controller/feedConsumtion.controller.js";

const feedConsumtionRoute=Router()

feedConsumtionRoute.route("/morningFeed").post(auth,morningFeedConsumtion)
feedConsumtionRoute.route("/eveningFeed").post(auth,eveningFeedConsumtion)
feedConsumtionRoute.route("/getFeedConsumtionRecordByMonth/:month").get(auth,getFeedConsumtionRecordByMonth)
feedConsumtionRoute.route("/getTodayFeedConsumtionRecord/:date").get(auth,getTodayFeedConsumtionRecord)
feedConsumtionRoute.route("/getTodayFeedConsumtionCount/:date").get(auth,getTodayFeedConsumtionCount)
feedConsumtionRoute.route("/deleteFeedConsumtionRecordById/:_id").delete(auth,deleteFeedConsumtionRecord)
export {feedConsumtionRoute}