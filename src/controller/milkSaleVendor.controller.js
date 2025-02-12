import { MilkSaleVendor } from "../models/milkSaleVendor.js";
import { ApiError } from "../utlis/ApiError.js";

const addVendor = async (req, res, next) => {
  const { name } = req.body;
  try {
    const vendor = await MilkSaleVendor.create({ name });
    if (!vendor) {
      return next(new ApiError(400, "Error occur while creating vendor"));
    }

    res
      .status(200)
      .json({ success: true, message: "Successfully created vendor" });
  } catch (error) {
    return next(error);
  }
};


const getAllVendors= async (req, res, next) => {

    try {
        const vendors=await MilkSaleVendor.find({})

        res.status(200).json({success:true,message:"successfully get all vendors",vendors})
    } catch (error) {
        
    }
}

const deleteVendor =async (req,res,next) => {
  const { vendorId } = req.params;

  try {
    const vendor=await MilkSaleVendor.deleteOne({_id:vendorId})

    if(!vendor){
        return next(new ApiError(404, "Vendor not found"))
    }

    res.status(200).json({success:true,message:"Vendor deleted successfully"})
  } catch (error) {
    next(error)
  }
}

export { addVendor,getAllVendors ,deleteVendor};
