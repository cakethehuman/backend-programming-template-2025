const express = require('express');

const usersController = require('./users-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', usersController.getUsers);

  // Create a new user
  route.post('/', usersController.createUser);

  // User spin
  route.post('/gacha', usersController.gacha);

  // See gacha history based on user id
  route.get('/:id/history', usersController.getHistoryId);

  // liat sisa prize
  route.get('/prizes', usersController.getPrizes);

  // see history for all the winners
  route.get('/history', usersController.getHistory)
  
  // Get user detail
  route.get('/:id', usersController.getUser);

  // Update user
  route.put('/:id', usersController.updateUser);

  // Change password
  route.put('/:id/change-password', usersController.changePassword);

  // Delete user
  route.delete('/:id', usersController.deleteUser);
};
