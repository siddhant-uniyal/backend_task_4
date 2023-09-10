import mongoose from "mongoose"

export const connectToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI , {
        dbName:"dictionary",
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
    console.log("Connected to Database")
    }
    catch(e){
        console.error(e)
    }
}