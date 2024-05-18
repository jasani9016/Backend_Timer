const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');
// const { saveFile } = require('../utils/helper');
const { Time } = require('../models');
const { ObjectId } = require('mongodb');
const { objectId } = require('../validations/custom.validation');
const moment = require('moment');
const cron = require('node-cron');



const createTimeManagment = {
  validation: {
    body: Joi.object().keys({
      projectName: Joi.string().required(),
      taskTitle: Joi.string().required(),
      startTime: Joi.date().required(),
    }),
  },
  handler: async (req, res) => {
    // const endTime = new Date(Date.now() + 6 * 6 * 100);

    const body = {
      ...req.body,
      user: req.user.id
    }

    const result = await new Time(body).save();
    return res.status(httpStatus.CREATED).send(result);
  }
}


const getTimeManagment = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  let results;

  if (startDate && endDate) {
    results = await Time.aggregate(
      [
        {
          $match: {
            user: ObjectId(req.user.id),
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate)
            }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        }
      ],
    );
  } else {
    results = await Time.find({ user: req.user.id }).sort({ createdAt: -1 });
  }

  return res.status(httpStatus.OK).send({ results });
});

// const getAllTimeManagement = catchAsync(async (req, res) => {
//   const time = await Time.find();
//   return res.status(httpStatus.OK).send({ time });

// })

const getAllTimeManagement = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  let time;

  if (startDate && endDate) {
    time = await Time.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate)
            }
          }
        }
      ],
    );
  } else {
    time = await Time.find();
  }

  return res.status(httpStatus.OK).send({ time });
});

const checkTimerStart = catchAsync(async (req, res) => {
  const time = await Time.findOne({ user: req.user.id, endTime: null }).sort({ createdAt: -1 });
  return res.status(httpStatus.OK).send({ result: time });
});

const todayTotalCount = catchAsync(async (req, res) => {
  // today total count expext end time null
  const time = await Time.find({ 
    user: req.user.id, 
    endTime: {
      $ne: null
    },
    createdAt: {
      $gte: new Date(new Date().setHours(00, 00, 00)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  });

  const total = time.reduce((acc, curr) => {
    const startTime = moment(curr.startTime);
    const endTime = moment(curr.endTime);
    const duration = moment.duration(endTime.diff(startTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
  
    // Convert the duration to total seconds
    const elapsedSeconds = (hours * 3600) + (minutes * 60) + seconds;
  
    // Add the elapsed seconds to the accumulator
    return acc + elapsedSeconds;
  }, 0);

  const totalHours = Math.floor(total / 3600);
  const totalMinutes = Math.floor((total % 3600) / 60);
  const totalSeconds = total % 60;

  const formattedTotal  = `${padZero(totalHours)}:${padZero(totalMinutes)}:${padZero(totalSeconds)}`;

  return res.status(httpStatus.OK).send({ total : formattedTotal, totalElapsedSeconds : total });

});

const padZero = (num) => {
  return num.toString().padStart(2, '0');
};

const updateTimeManagment = {
  validation: {
    params: Joi.object().keys({
      id: Joi.string(),
    }),
    body: Joi.object().keys({
      endTime: Joi.string(),
    }),
  },
  handler: catchAsync(async (req, res) => {
    const timeData = await Time.findById(req.params.id);
    if (!timeData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'not found');
    }

    const { endTime: endTimeDate } = req.body;

    const startTime = moment(timeData.startTime);
    const endTime = moment(endTimeDate);

    const duration = moment.duration(endTime.diff(startTime));

    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const elapsedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

    timeData.elapsedTime = elapsedTime;
    timeData.endTime = endTime;

    const result = await timeData.save();

    return res.status(httpStatus.OK).send({ message: 'Record updated successfully', result });
  })
}

//cron job
// every day at 8 pm stop the timer
cron.schedule('0 20 * * *', async () => {
  const time = await Time.find({ endTime: null });
  if (time?.length > 0) {
    time?.forEach(async (element) => {
      const startTime = moment(element.startTime);
      const endTime = moment();
      const duration = moment.duration(endTime.diff(startTime));
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      const elapsedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
      element.elapsedTime = elapsedTime;
      element.endTime = endTime;
      await element.save();
    });
  }
});


module.exports = {
  createTimeManagment,
  getTimeManagment,
  updateTimeManagment,
  getAllTimeManagement,
  checkTimerStart,
  todayTotalCount
};