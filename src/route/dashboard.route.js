import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { getCowAnalyticsBetweenTwoDates, getTodayCowAnalytics } from "../controller/dashboard.controller.js";


const dashboardRoute=Router()


dashboardRoute.route("/cowAnalyticsBetweenTwoDatescowId/:cowId").get(auth,getCowAnalyticsBetweenTwoDates)
dashboardRoute.route("/cowTodayAnalytics/:date").get(auth,getTodayCowAnalytics)

export {dashboardRoute}