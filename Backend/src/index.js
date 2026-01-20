import connectDB from "./db/db.js";
import dotenv from "dotenv";
import app from "./app.js";
import express from "express";

const app = express()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

dotenv.config()

const port = process.env.PORT || 4000

connectDB().
    then(() => {
        app.listen(port,()=>{
            console.log("Data Base is Connected port is : ",port)
        })
    }).catch((error)=>{
       console.log("Database connection Fialed : ",error) 
    })
