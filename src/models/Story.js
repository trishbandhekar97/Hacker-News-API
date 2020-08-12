const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  by: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
});

module.exports = mongoose.model('Story', StorySchema);
