import mongoose from "mongoose"

const wordSchema = new mongoose.Schema({
    word: {
      type: String,
      maxlength: 12,
   
    },
    definition:{
        type : String,
   
    },
    synonyms: String,
    antonyms: String,
  });


  export const Word = mongoose.model("Word" , wordSchema)