const express = require('express');
const UserRepo = require('../repos/user-repo');

const router = express.Router();

// Use repository pattern here to run the queries
// Not dierectly require in the Pool.
router.get('/users', async (req, res) => {
    // Get all users
    const users = await UserRepo.find();
  
    // Send the result back to the person
    // who made this request
    res.send(users);
  });
  
  router.get('/users/:id', async (req, res) => {
    //Get user by user's id
    const { id } = req.params;
  
    const user = await UserRepo.findById(id);
    // if the user with this id is found return the user(result of findById)
    // if it is not found, return 404 error.
    if (user) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  });
  
  router.post('/users', async (req, res) => {
    // create a user with username and their bio info
    const { username, bio } = req.body;
  
    const user = await UserRepo.insert(username, bio);

    // return the user(result of insert function) has been created. 
    res.send(user);
  });
  
  router.put('/users/:id', async (req, res) => {
    // update a user's name or bio when it is changed
    const { id } = req.params;
    const { username, bio } = req.body;
  
    const user = await UserRepo.update(id, username, bio);
  
    if (user) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  });
  
  router.delete('/users/:id', async (req, res) => {
    // delete a user by their ID
    const { id } = req.params;
  
    const user = await UserRepo.delete(id);
  
    if (user) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  });
  
  module.exports = router;
  