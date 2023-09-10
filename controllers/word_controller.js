
import {Word} from "../models/word_model.js"

export const updateWord = async(req , res)=>{
    try {
        const wordToUpdate = req.params.id;
    
        const updatedWord = await Word.findOneAndUpdate(    //i am saying that : id to be updated is req.params.id , req.body is what to update it with , and new : true will return the updated document 
          { _id: wordToUpdate },
          req.body,
          { new: true }               
        );
    
        if (!updatedWord)
          return res.status(404).send("Invalid ID , word could not be found"); //if id is wrong
    
        res.json(updatedWord);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error" });
      }
}

export const deleteWord = async(req , res)=>{
    try {
        const idToRemove = req.params.id;
    
        const wordToRemove = await Word.findByIdAndDelete(idToRemove);
    
        //if word doesn't exist
        if (!wordToRemove) return res.status(404).send("Word does not exist");
    
        res.send(wordToRemove);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error" });
      }
}

export const searchPre = async(req , res)=>{
    try {
        const prefix = new RegExp(`^${req.params.prefix}`); //regex to match prefixes , ^ signifies starting of a word
    
        const wordsWithPrefixJSON = await Word.find({ word: prefix });
        if (wordsWithPrefixJSON.length === 0)
          return res.status(404).json({ error: "No word with that prefix exists" }); 
        res.json(wordsWithPrefixJSON);
      } catch (e) {
        console.error(e);
        res.status(500).send("Error");
      }
}

export const searchSyn = async(req , res)=>{
    const prefix = new RegExp(`^${req.params.prefix}`); //regex to match prefixes

  const wordsWithPrefixJSON = await Word.find({ word: prefix });

  //wordsWithPrefixJSON is an array of objects. it won't work in .find
  // so i will extract the word field values from it and check for antonyms in that

  const words = wordsWithPrefixJSON.map((words) => words.word); //using map to extract word field from all "words" in JSON
  //words is now an array of words
  const wordsWithSameMeaning = await Word.find({ synonyms: { $in: words } }); //searching for those words whose synonyms field is in "words"

  //$in is querying every document in db , and checking if it's synonym is in words
  res.json(wordsWithSameMeaning);
}

export const searchAn = async(req , res)=>{
    const prefix = new RegExp(`^${req.params.prefix}`); //regex to match prefixes

  const wordsWithPrefixJSON = await Word.find({ word: prefix });

  const words = wordsWithPrefixJSON.map((words) => words.word);

  const wordsWithDiffMeaning = await Word.find({ antonyms: { $in: words } });

  res.json(wordsWithDiffMeaning);
}