import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addMilkUsage } from "../controller/personalMilkUsage.controller.js";


const personalUsageMilkRouter=Router()


personalUsageMilkRouter.route("/add").post(auth,addMilkUsage)


export {personalUsageMilkRouter}