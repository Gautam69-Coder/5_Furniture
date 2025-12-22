import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

//Connect to DataBase
const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        // console.log(`Mongo DB connected Host : ${connectInstance.connection.host}`)
    } catch (error) {
        console.log("Data Base Connection error : ",error);
        process.exit(1) //or throw to get error
    }
}

export default connectDB;