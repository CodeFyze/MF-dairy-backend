import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addVendor, deleteVendor, getAllVendors } from "../controller/milkSaleVendor.controller.js";



const milkSaleVendorRoute=Router()


milkSaleVendorRoute.route("/").post(auth,addVendor).get(auth,getAllVendors)
milkSaleVendorRoute.route("/:vendorId").delete(auth,deleteVendor)


export {milkSaleVendorRoute}