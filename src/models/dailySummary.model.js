const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../config/tokens");
const { date } = require("joi");

const dailySummarySchema = mongoose.Schema(
  {
    summary: {
      type: String,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
dailySummarySchema.plugin(toJSON);

/**
 * @typedef Daily
 */
const Daily = mongoose.model("Daily", dailySummarySchema);

module.exports = Daily;
