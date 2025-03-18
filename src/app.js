import { config } from "dotenv";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
export const app=express()
config({path:"./.env"})

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
app.use(cors({origin:process.env.ORIGIN,credentials:true}))



import { userRoute } from "./route/user.route.js";
app.use("/api/user",userRoute)

import { cowRoute } from "./route/cow.route.js";
app.use("/api/cow",cowRoute)

import {feedConsumtionRoute} from "./route/feedConsumtion.route.js"
app.use("/api/feed",feedConsumtionRoute)

import { milkProductionRoute } from "./route/milkProduction.route.js";
app.use("/api/milk",milkProductionRoute)

import { dairyFarmRoute } from "./route/daiyFarm.route.js";
app.use("/api/daiyfarm",dairyFarmRoute)

import { feedInventoryRoute } from "./route/feedInventoryRoute.js";
app.use("/api/feedInventory",feedInventoryRoute)

import { medicalRecordRoute } from "./route/medicalRecordRoute.js";
app.use("/api/medicalRecord",medicalRecordRoute)


import { milkSaleRoute } from "./route/milkSale.route.js";
app.use("/api/milkSale",milkSaleRoute)

import { taskRoute } from "./route/task.route.js";
app.use("/api/task",taskRoute)

import { milkSaleVendorRoute } from "./route/milkSaleVendor.route.js";
app.use("/api/milkSaleVendor",milkSaleVendorRoute)

import { personalUsageMilkRouter } from "./route/personalUsage.route.js";
app.use("/api/personaMilkUsage",personalUsageMilkRouter)


import { dashboardRoute } from "./route/dashboard.route.js";
app.use("/api/dashboard",dashboardRoute)