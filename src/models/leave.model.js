const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const leaveSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate : {
      type: Date,
      required: true,
    },
    endDate : {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['full', 'half'],
    },
    halfType: {
      type: String,
      enum: ['first', 'second'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

leaveSchema.plugin(toJSON);

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
