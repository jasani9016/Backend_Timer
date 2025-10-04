const httpStatus = require('http-status');
const Joi = require('joi');
const { Rate } = require('../models');


const createRating = {
  validation: {
    body: Joi.object().keys({
      rate:  Joi.string().required(),
    }),
  },
  handler: async (req, res) => {

    const newUser = await new Rate(req.body).save(); 
    return res.status(httpStatus.CREATED).send(newUser);
  }
}

// Route: GET /api/users/:id
const getRatingById = {
    handler: async (req, res) => {
        try {
          const ratings = await Rate.find({ user: req.user.id });
          const rateDatas = ratings?.map((item) => item?.rate) || [];

          const totalRate = rateDatas?.reduce((sum, rate) => sum + Number(rate), 0);
          
          const result = (totalRate * 100) / ratings?.length;
          const formatted = (result / 100).toFixed(2)
    
          return res.status(200).json({totalRate:formatted});
        } catch (err) {
          return res.status(500).json({ message: 'Server error' });
        }
      }
};

const getAllRating = {
    handler: async (req, res) => {
        try {
          const ratings = await Rate.find();
          return res.status(200).json({ratings});
        } catch (err) {
          return res.status(500).json({ message: 'Server error' });
        }
      }
};
module.exports = {
    createRating,
    getRatingById,
    getAllRating
};