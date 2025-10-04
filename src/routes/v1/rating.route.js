const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { ratingController } = require('../../controllers');

const router = express.Router();

router.post('/add-rate',auth(), catchAsync(ratingController.createRating.handler));
router.get('/getRateById',auth(), catchAsync(ratingController.getRatingById.handler));
router.get('/getAllRate',auth(), catchAsync(ratingController.getAllRating.handler));

module.exports = router;