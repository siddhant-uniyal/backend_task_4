
import { app } from "./app.js";

import {connectToDB} from "./data/db.js"

connectToDB()

app.get("/" , (req , res)=>{
    console.log("Welcome to my app. Make a delete or update request with Postman , and also try out search synonym and search antonym!")
})

app.listen(process.env.PORT , (req,res)=>{
    console.log(`Server is working on port ${process.env.PORT}`)
})