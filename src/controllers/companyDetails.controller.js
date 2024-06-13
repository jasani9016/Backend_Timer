const httpStatus = require("http-status");
const pick = require("../utils/pick");
const { companyDetailsService } = require("../services");
const { User, Company } = require("../models");
const Joi = require("joi");

//Company Deatils

const updateCompanyDetails = {
  validation: {
    body: Joi.object().keys({
      companyName: Joi.string(),
      companyAddress: Joi.string(),
      email: Joi.string(),
      contactNo: Joi.string(),
    }),
  },
  handler: async (req, res) => {
    const checkDataExits = await Company.findOne();
    if (checkDataExits) {
      await  Company.findOneAndUpdate({ _id: checkDataExits._id }, req.body);
    } else {
      await new Company(req.body).save();
    }

    return res.status(httpStatus.OK).send({ message: "Update Successfully" });
  },
};

const getCompanyDetails = {
  handler: async (req, res) => {
    const user = await Company.find();
    return res.status(httpStatus.OK).send(user);
  },
};

module.exports = {
  updateCompanyDetails,
  getCompanyDetails,
};
