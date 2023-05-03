// importing mongoose library
const mongoose = require("mongoose");

// creating a schema
const Options = new mongoose.Schema({
  _id:{
    type:mongoose.Schema.Types.ObjectId
},
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: false,
    default: 0,
  },
  link_to_vote: {
    type: String,
    required: false,
    default: "",
  },
});

// setting it as a Model
const Option = mongoose.model("Option", Options);

// exporting it
module.exports = Option;
