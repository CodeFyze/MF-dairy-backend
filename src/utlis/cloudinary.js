import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { CLOUD_KEY, CLOUD_NAME, CLOUD_SECRET } from '../config/env.js';

          
cloudinary.config({ 
  cloud_name:CLOUD_NAME,
  api_key:CLOUD_KEY,
  api_secret:CLOUD_SECRET
});



const cloudinaryUpload=async function(imagePath){
    if(!imagePath)  return null
try {
    const response=await cloudinary.uploader.upload(imagePath,{
       resource_type:'auto',timeout:60000
    })
    fs.unlinkSync(imagePath)
    return response
} catch (error) {
    fs.unlinkSync(imagePath)
    console.log("While upoading the image on cloudinary",error)
}
}

export {cloudinaryUpload}