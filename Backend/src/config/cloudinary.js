import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SERECT_KEY || process.env.CLOUDINARY_SECRET_KEY,
    });
};

configureCloudinary();

const connectCloudinary = () => {
    configureCloudinary();
    return Boolean(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY);
};

export default connectCloudinary;
export { cloudinary };