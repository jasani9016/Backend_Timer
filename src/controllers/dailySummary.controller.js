const httpStatus = require("http-status");
const Joi = require("joi");
const { Daily } = require("../models");
const { dailySummaryService } = require("../services");

const createDailySummaryManagment = {
  validation: {
    body: Joi.object().keys({
      summary: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const body = {
      ...req.body,
      user: req.user.id,
    };

    const result = await new Daily(body).save();
    return res.status(httpStatus.CREATED).send(result);
  },
};

const getDailySummaryManagmentById = {
  handler: async (req, res) => {
    const { userId } = req.query;
    const summary = await Daily.find({ user: userId });
    return res.send(summary);
  },
};
module.exports = {
  createDailySummaryManagment,
  getDailySummaryManagmentById,
  // getAllTimeManagement,
};
