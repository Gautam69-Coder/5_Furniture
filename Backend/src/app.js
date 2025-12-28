import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectCloudinary from "./config/cloudinary.js"
const app = express();

app.use(cors({
    origin: [
        "https://five-furniture.onrender.com",
        "https://furniture.gautamdoliya69.workers.dev",
        "https://5-furniture.pages.dev"
    ],
    credentials: true,  
}))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json({ limit: "16kb" }))
app.use(express.static("public"))

if (connectCloudinary()) {
    console.log("Cloudinary is Connected")
} else {
    console.log("Not Connected")
}


//import Routes
import UserRoutes from './routes/user.routes.js'
app.use("/api/v1/user", UserRoutes)
app.use("/api/v1/userotp", UserRoutes)
app.use("/api/v1/", UserRoutes)

import ProductData from "./routes/product.routers.js"
app.use("/api/v1/", ProductData)

import CartData from "./routes/cart.routers.js"
app.use("/api/v1/", CartData)

import Payment from "./routes/payment.routers.js"
app.use("/api/v1/", Payment)

import OrderData from "./routes/order.routers.js"
app.use("/api/v1/", OrderData)

import UserAnalysis from "./routes/acitivity.routers.js"
app.use("/api/v1/", UserAnalysis)

import GoogleAuth from "./routes/authRoutes.routers.js"
app.use("/api/v1/", GoogleAuth)


export default app;