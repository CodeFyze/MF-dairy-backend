import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_KEY = process.env.CLOUD_KEY;
const CLOUD_SECRET = process.env.CLOUD_SECRET;

export {
  PORT,
  ORIGIN,
  DB_URL,
  JWT_SECRET,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
};
