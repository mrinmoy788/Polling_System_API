const mongoose = require("mongoose");
// importing Option Model
const Option = require("../models/OptionsModel");

// importing Questions Model
const Questions = require("../models/questionModel");

//To add options to a specific question
module.exports.addOption = async function (req, res) {
  try {
    // finding a particular question
    const question = await Questions.findById(req.params.id);
    if (!Array.isArray(req.body.options)) {
      return res.status(400).json({
        message: "Invalid request format. Options should be an array.",
      });
    }
    for (let option of req.body.options) {
      // creating options
      const currOption = new Option({
        _id: new mongoose.Types.ObjectId(),
        text: option,
    });
    await currOption.save();
      // creating dynamic link
      currOption.link_to_vote =
        "http://" +
        req.headers.host +
        "/options/" +
        currOption.id +
        "/add_vote";
      currOption.save();
      // pushing options id into question
      question.options.push(currOption.id);
      question.save();
    }
    // returning the response
    return res.status(200).json({
      message: "option added successfully",
    });
  } catch (err) {
    // checking for error
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

//To delete an option
module.exports.deleteOption = async function (req, res) {
  try {
    // finding the particular option
    const option = await Option.findById(req.params.id);
    // checking whether it contains any vote or not
    if (option.votes > 0) {
      return res.status(401).json({
        message: "You cannot delete that vote",
      });
    }
    // finding the question and updating it
    await Questions.updateOne(
      { options: { $in: req.params.id } },
      { $pull: { options: { $eq: req.params.id } } }
    );
    // deleting the particular option
    await option.remove();
    // returning the response
    return res.status(200).json({
      message: "option deleted succesfully",
    });
  } catch (err) {
    // checking for error
    return res.status(465).json({
      message: "internal server error",
      error: err.message,
    });
  }
};
//To increment the count of votes
module.exports.incrementVotes = async function (req, res) {
  try {
    // finding the particular option
    const option = await Option.findById(req.params.id);
    // incrementing the votes
    option.votes += 1;
    await option.save();
    // returning the response
    return res.status(200).json({
      message: "vote added",
      votes: option.votes,
    });
  } catch (err) {
    // checking for the error
    res.status(465).json({
      message: "could not increment the count",
      err: "internal server error",
    });
  }
};
