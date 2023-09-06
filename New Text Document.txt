const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word:String,
	meaning:String,
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;