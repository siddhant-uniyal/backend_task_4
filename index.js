/* algo: 
for delete:
1) give id as a parameter in route
2) find by id and delete

for update:
1)give id as a parameter
2)put updated fields in request body
3) find word to update by id and update it

for search:
1)give prefix parameter
2)create regex for matching
3)send json containing matching words

for getting synonyms:
1)get an array of words having prefix
2) extract the words from this array
3).find() and $in to get words which are the synonyms of the words having our prefix

for getting antonyms:
same as above
*/

const express = require("express");
const mongoose = require("mongoose");

const app = express();

//middleware
app.use(express.json());

//create server
app.listen(4000, () => {
  console.log("Server is working");
});

//1) create and connect to a db
const connectToDB = async () => {
  //async to avoid promise chain
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017", {
      dbName: "dictionary", //initialize db
      useNewUrlParser: true, //remove deprecation warning
      useUnifiedTopology: true, //remove deprecation warning
    });
  } catch (e) {
    console.log(e);
  }
};

connectToDB();

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    maxlength: 12,
  },
  definition: String,
  synonyms: String,
  antonyms: String,
});

const Word = mongoose.model("Word", wordSchema);

//3) a delete method handler
app.delete("/words/:id", async (req, res) => {
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
});

//for updating
app.patch("/words/update/:id", async (req, res) => {
  try {
    const wordToUpdate = req.params.id;

    const updatedWord = await Word.findOneAndUpdate(
      { _id: wordToUpdate },
      req.body,
      { new: true }
    );

    if (!updatedWord)
      return res.status(404).send("Invalid ID , word could not be found");

    res.json(updatedWord);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error" });
  }
});

app.get("/words/search/:prefix", async (req, res) => {
  try {
    const prefix = new RegExp(`^${req.params.prefix}`); //regex to match prefixes

    const wordsWithPrefixJSON = await Word.find({ word: prefix });
    if (wordsWithPrefixJSON.length === 0)
      return res.status(404).json({ error: "No word with that prefix exists" });
    res.json(wordsWithPrefixJSON);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
});

//we want words that are the synonym or antonym of the word we are looking for
//therefore , we will display the words that have the word we are looking for in their synonyms/antonyms field
//route for synonyms
app.get("/words/search/synonyms/:prefix", async (req, res) => {
  const prefix = new RegExp(`^${req.params.prefix}`); //regex to match prefixes

  const wordsWithPrefixJSON = await Word.find({ word: prefix });

  //wordsWithPrefixJSON is an array of objects. it won't work in .find
  // so i will extract the word field values from it and check for antonyms in that

  const words = wordsWithPrefixJSON.map((words) => words.word); //using map to extract word field from all "words" in JSON
  //words is now an array of words
  const wordsWithSameMeaning = await Word.find({ synonyms: { $in: words } }); //searching for those words whose synonyms field is in "words"

  //$in is querying every document in db , and checking if it's synonym is in words
  res.json(wordsWithSameMeaning);
});

//route for antonyms
app.get("/words/search/antonyms/:prefix", async (req, res) => {
  const prefix = new RegExp(`^${req.params.prefix}`); //regex to match prefixes

  const wordsWithPrefixJSON = await Word.find({ word: prefix });

  const words = wordsWithPrefixJSON.map((words) => words.word);

  const wordsWithDiffMeaning = await Word.find({ antonyms: { $in: words } });

  res.json(wordsWithDiffMeaning);
});
