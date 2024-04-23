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
    const startTime = new Date();
    // const endTime = new Date(Date.now() + 6 * 6 * 100);

    const body = {
      ...req.body,
      startTime,
      // endTime,
      user: req.user.id
    }

    const result = await new Time(body).save();
    return res.status(httpStatus.CREATED).send(result);
  }
}

// const getTimeManagment = catchAsync(async (req, res) => {
//   const result = await Time.find({
//     user: req.user.id
//   });
//   return res.status(httpStatus.OK).send({ result });
// });

const getTimeManagment = catchAsync(async (req, res) => {
  const results = await Time.find({ user: req.user.id });


  // const timeResults = results.map(result => {
  //   const startTime = new Date(result.startTime);
  //   const endTime = new Date(result.endTime || Date.now());
  //   const timeDifference = endTime - startTime;
  //   const totalTime = timeDifference / (1000 * 60); // Convert milliseconds to minutes
  //   return { ...result.toJSON(), totalTime };
  // });

  return res.status(httpStatus.OK).send({ results });
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

    const formateTime = () => {
      const endTime = new Date();
      const startTime = new Date(festivals.startTime);
      const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000); // Convert milliseconds to seconds
      const hours = Math.floor(elapsedTimeInSeconds / 3600);
      const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
      const seconds = elapsedTimeInSeconds % 60;
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
    festivals.endTime = endTime;
    festivals.elapsedTime = elapsedTimeInSeconds;
    // console.log('formateTime', formateTime)
    // Update the end time and elapsed time

    const result = await festivals.save();

    return res.status(httpStatus.OK).send({ message: 'Record updated successfully', result,formateTime });
  })
}



module.exports = {
  createTimeManagment,
  getTimeManagment,
  updateTimeManagment
};