const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const timeSchema = mongoose.Schema(
  {
  
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
    },
    startTime:{
      type: Date,
    },
    endTime:{
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
timeSchema.plugin(toJSON);

/**
 * @typedef Time
 */
const Time = mongoose.model('Time', timeSchema);

module.exports = Time;
