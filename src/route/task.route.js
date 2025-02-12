import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addTask, deleteTask, getMonthlyTasks, getTaskByUserId, getTasks, ToggleTaskStatus } from "../controller/task.controller.js";



const taskRoute=Router()


taskRoute.route("/create").post(auth,addTask)
taskRoute.route("/getTaskByUserId/:userId").get(auth,getTaskByUserId)
taskRoute.route("/getTasks").get(auth,getTasks)
taskRoute.route("/getMonthlyTasks/:month").get(auth,getMonthlyTasks)
taskRoute.route("/toggleTask/:taskId").patch(auth,ToggleTaskStatus)
taskRoute.route("/deleteTask/:taskId").delete(auth,deleteTask)
export {taskRoute}