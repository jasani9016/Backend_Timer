const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');
// const { saveFile } = require('../utils/helper');
const { Time } = require('../models');


const createTimeManagment = {
  validation: {
    body: Joi.object().keys({
      projectName: Joi.string().required(),
      taskTitle: Joi.string().required(),
      // startTime: Joi.string(),
    }),
  },
  handler: async (req, res) => {

    const body = {
      ...req.body,
      startTime: new Date(),
      user: req.user.id
    }

    const result = await new Time(body).save();
    return res.status(httpStatus.CREATED).send(result);
    // return res.status(httpStatus.CREATED).send(result);
  }
}

const getTimeManagment = catchAsync(async (req, res) => {
  const result = await Time.find({
    user: req.user.id
  });
  return res.status(httpStatus.OK).send({ result });
});


const updateTimeManagment = {
  validation: {
    params: Joi.object().keys({
      id: Joi.string(),
    }),
  },
  handler: catchAsync(async (req, res) => {
    const festivals = await Time.findById(req.params.id);
    if (!festivals) {
      throw new ApiError(httpStatus.NOT_FOUND, 'not found');
    }

    const result = await Time.findByIdAndUpdate(req.params.id, { endTime: new Date() }, { new: true });

    return res.status(httpStatus.OK).send({ message: 'Record updated successfully', result });
  })
}



module.exports = {
  createTimeManagment,
  getTimeManagment,
  updateTimeManagment
  // updateFestivalsFrame
};