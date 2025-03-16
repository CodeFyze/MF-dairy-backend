import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addMedicalRecord, deleteMedicalRecord, getMedicalRecord, getMedicalRecordBetweenTwoDatesByCowId, getMedicalRecordByCowId, updateMedicalRecord } from "../controller/medicalRecord.controller.js";



const medicalRecordRoute=Router()


medicalRecordRoute.route("/add").post(auth,addMedicalRecord)
medicalRecordRoute.route("/getMonthlyMedicalRecord/:date").get(auth,getMedicalRecord)
medicalRecordRoute.route("/getCowMedicalRecord/:cowId/:date").get(auth,getMedicalRecordByCowId)
medicalRecordRoute.route("/deleteMedicalRecord/:_id").delete(auth,deleteMedicalRecord)
medicalRecordRoute.route("/updateMedicalRecord/:_id").patch(auth,updateMedicalRecord)
medicalRecordRoute.route("/getMedicalRecordBetweenDates/:cowId").get(auth,getMedicalRecordBetweenTwoDatesByCowId)

export {medicalRecordRoute}