const express = require('express');
const { sendNotification } = require('../controllers/notificationController');

module.exports = function mountNotificationRoutes(app) {
  const router = express.Router();
  router.post('/send', sendNotification);
  app.use('/notifications', router);
};
