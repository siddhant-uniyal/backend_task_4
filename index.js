/* algo: 
1) give id as a parameter in route
2) find by id and delete
3) update */



const express = require("express")
const mongoose = require("mongoose")

const app = express()

//middleware

app.use(express.json())
app.listen(1900,()=>{console.log("Server is working")})

//1) create and connect to a db
const connectToDB = async() =>{ //async to avoid promise chain
  try{
    await mongoose.connect("mongodb://0.0.0.0:27017",{
      dbName:"dictionary" ,//initialize db
      useNewUrlParser : true,  //remove deprecation warning
      useUnifiedTopology : true, //remove deprecation warning
    })
  }
  catch(e){
    console.log(e);
  }
}

connectToDB();


const wordSchema = new mongoose.Schema({
  word :{
    type : String,
    maxlength : 12,
  },
  definition : String,
  synonyms : String,
  antonyms : String,
})

const Word = mongoose.model('Word', wordSchema);


//3) a delete method handler

app.delete("/words/:id" , async (req , res) => {
  try{
  const idToRemove = req.params.id;
  
  const wordToRemove = await Word.findByIdAndDelete(idToRemove);

  if(!wordToRemove) return res.status(404).send("Word does not exist");

  res.send(wordToRemove);
  }
  catch(e){
    res.status(500).send(e);
  }
})
  
app.patch("/words/update/:id" , async (req , res)=>{
  try{
  const wordToUpdate = req.params.id;
  
  const updatedWord = await Word.findOneAndUpdate({_id : wordToUpdate} , req.body, {new:true});

  res.json(updatedWord)
  }
  catch(e){
    console.error(e)
  }
})

app.get("/words/search/:prefix" , async (req,res)=>{
  const prefix = new RegExp(`^${req.params.prefix}`)

  const wordsWithPrefix = await Word.find({word:prefix})


  const first = wordsWithPrefix[0]

  const wordsWithSameMeaning = await Word.find({ definition: first.definition})

  res.json(wordsWithSameMeaning)
})





 







 