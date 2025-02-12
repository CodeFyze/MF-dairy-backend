import { ApiError } from "../utlis/ApiError.js";
import { cloudinaryUpload } from "../utlis/cloudinary.js";
import { Cow } from "../models/cow.model.js";

const registerCow = async (req, res, next) => {
  const { animalNumber, age, breed } = req.body;

  if (breed.trim() == "") {
    return next(new ApiError(400, "All Fields are required"));
  }

  const exitsCow = await Cow.findOne({
    $and: [{ animalNumber }, { dairyFarmId: req.user.dairyFarmId }],
  });

  if (exitsCow) {
    return next(new ApiError(400, "This Cow is Already Created"));
  }

  const imagePath = req.file?.path;

  if (!imagePath) {
    return next(new ApiError(400, "Image is required"));
  }

  const cloudinaryImagePath = await cloudinaryUpload(imagePath);

  if (!cloudinaryImagePath) {
    return next(new ApiError(500, "Error uploading image to cloudinary"));
  }

  const cow = await Cow.create({
    animalNumber,
    age,
    breed,
    image: cloudinaryImagePath?.url || "",
    createdBy: req.user._id,
    dairyFarmId: req.user.dairyFarmId,
  });

  if (!cow) {
    return next(new ApiError(500, "Error registering cow"));
  }

  res.status(201).json({
    message: "Cow registered successfully",
    success: true,
  });
};

const getCows = async (req, res, next) => {
  const cows = await Cow.find({ dairyFarmId: req.user.dairyFarmId });
  if (!cows) {
    return next(new ApiError(404, "Getting cow failed"));
  }

  res.status(200).json({
    message: "Cows retrieved successfully",
    success: true,
    cows,
  });
};

const deleteCow = async (req, res, next) => {
  const { cowId } = req.params;

  try {
    const deletedCow = await Cow.deleteOne({ _id: cowId });

    if (!deletedCow) {
      return next(new ApiError(404, "Cow not found"));
    }

    res.status(200).json({
      message: "Cow deleted successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const updateCow = async (req, res, next) => {
  const { cowId } = req.params;

  const { age, pregnancyStatus, breed } = req.body;
 

  try {
    const cow = await Cow.findOne({ _id: cowId });

    if (!cow) {
      return next(new ApiError(404, "Cow not found"));
    }

    cow.age = age;
    cow.pregnancyStatus = pregnancyStatus;
    cow.breed = breed;
  
    await cow.save();
    
    res.status(200).json({
      message: "Cow updated successfully",
      success: true,
    });


  } catch (error) {
    next(error);
  }
};


const updateCowPicture = async (req, res, next) => {
  const { cowId } = req.params;
   try {
    const imagePath=req.file?.path
   if(!imagePath){
    return next(new ApiError(400, "Image is required"));
   }
  const cow=await Cow.findOne({_id:cowId})

  if(!cow){
    return next(new ApiError(404, "Cow not found"));
  }
   const cloudinaryImagePath=await cloudinaryUpload(imagePath)
   if(!cloudinaryImagePath){
    return next(new ApiError(500, "Error uploading image to cloudinary"));
   }


   cow.image=cloudinaryImagePath?.url || ""
   
   await cow.save()

   res.status(200).json({
    message: "Cow picture updated successfully",
    success: true,
   });


   } catch (err ) {
    next(err);
   }
}

const getCowById = async(req, res, next) =>{
  const {cowId} = req.params

  try {
    const cow = await Cow.findOne({_id:cowId})

    if(!cow){
      return next(new ApiError(404, "Cow not found"));
    }


    res.status(200).json({
      message: "Cow retrieved successfully",
      success: true,
      cow
    });
  } catch (error) {
    next(error);
  }
}
export { registerCow, getCows, deleteCow,updateCow,updateCowPicture ,getCowById};
