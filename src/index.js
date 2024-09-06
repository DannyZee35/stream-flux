import dotenv from "dotenv"
import connectDB from "./db/db.js"
import { app } from "./app.js"

dotenv.config({})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERRR",error);
        throw error
        
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port : ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.log("MongoDB CONNECTION ERROR",error);
})