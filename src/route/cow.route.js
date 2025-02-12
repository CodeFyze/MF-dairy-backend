import { Router } from "express";

import { upload } from "../middleware/multer.js";
import { auth } from "../middleware/auth.js";
import {
  deleteCow,
  getCowById,
  getCows,
  registerCow,
  updateCow,
  updateCowPicture,
} from "../controller/cow.controller.js";

const cowRoute = Router();

cowRoute.route("/register").post(upload.single("image"), auth, registerCow);
cowRoute.route("/getCows").get(auth, getCows);
cowRoute
  .route("/updateImage/:cowId")
  .patch(auth, upload.single("image"), updateCowPicture);
cowRoute
  .route("/:cowId")
  .delete(auth, deleteCow)
  .patch(auth, updateCow)
  .get(auth, getCowById);


export { cowRoute };
