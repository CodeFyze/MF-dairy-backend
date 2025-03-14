import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { addSaleMilk, deleteMilkSalesRecordbyId, getMilksaleRecordBtwTwoDates, getMonthlyMilkSaleRecord,getSaleMilkBtDatesAndVendorId,getSaleMilkByVendorId,updateMilkSaleRecordById } from "../controller/milkSale.controller.js";



const milkSaleRoute=Router()

milkSaleRoute.route("/addSaleMilk").post(auth,addSaleMilk)
milkSaleRoute.route("/getMilkSaleRecordByMonth/:date").get(auth,getMonthlyMilkSaleRecord)
milkSaleRoute.route("/getMilkSaleMonthlyRecordByVendorId/:vendorId").get(auth,getSaleMilkByVendorId)
milkSaleRoute.route("/deleteMilkSaleRecordById/:_id").delete(auth,deleteMilkSalesRecordbyId)
milkSaleRoute.route("/updateMilkSaleRecordById/:_id").patch(auth,updateMilkSaleRecordById)
milkSaleRoute.route("/getMilkSaleRecordBtwTwoDates").get(auth,getMilksaleRecordBtwTwoDates)
milkSaleRoute.route("/getMilkSaleRecordBtwTwoDatesByVendorId/:vendorId").get(auth,getSaleMilkBtDatesAndVendorId)



export {milkSaleRoute}