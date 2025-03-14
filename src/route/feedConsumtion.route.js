import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { deleteFeedConsumtionRecord, eveningFeedConsumtion, getFeedConsumtionRecordBtwTwoDates, getFeedConsumtionRecordByMonth, getTodayFeedConsumtionCount, getTodayFeedConsumtionRecord, morningFeedConsumtion } from "../controller/feedConsumtion.controller.js";

const feedConsumtionRoute=Router()

feedConsumtionRoute.route("/morningFeed").post(auth,morningFeedConsumtion)
feedConsumtionRoute.route("/eveningFeed").post(auth,eveningFeedConsumtion)
feedConsumtionRoute.route("/getFeedConsumtionRecordByMonth/:date").get(auth,getFeedConsumtionRecordByMonth)
feedConsumtionRoute.route("/getTodayFeedConsumtionRecord/:date").get(auth,getTodayFeedConsumtionRecord)
feedConsumtionRoute.route("/getTodayFeedConsumtionCount/:date").get(auth,getTodayFeedConsumtionCount)
feedConsumtionRoute.route("/deleteFeedConsumtionRecordById/:_id").delete(auth,deleteFeedConsumtionRecord)
feedConsumtionRoute.route("/getFeedConsumtionRecordBtwTwoDates").get(auth,getFeedConsumtionRecordBtwTwoDates)
export {feedConsumtionRoute}