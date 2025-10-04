const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
const { date } = require('joi');

const rateSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    rate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
rateSchema.plugin(toJSON);

/**
 * @typedef Rate
 */
const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
