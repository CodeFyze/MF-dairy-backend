import mongoose from "mongoose"
import { DB_URL } from "./env.js"

const dbConnection =async()=>{
    try {
       const connection=await mongoose.connect(`${DB_URL}/dairy-app`) 
       
      console.log("Db Connected")
    } catch (error) {
        console.log("Error: while connecting with database",error)
    }
}
export {dbConnection}