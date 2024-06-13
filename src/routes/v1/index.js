const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const timeRoute = require('./time.route');
const leaveRoute = require('./leave.route');
const dailyRoute = require('./daily.route');
const companyRoute = require('./company.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/time',
    route: timeRoute,
  },
  {
    path: '/leave',
    route: leaveRoute
  },
  {
    path: '/summary',
    route: dailyRoute,
  },
  {
    path: '/company',
    route: companyRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
