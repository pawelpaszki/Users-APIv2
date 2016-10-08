var User = require('../models/user');
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

// body parser to get data from the body
router.use(bodyParser.urlencoded({
  extend: true
}));
router.use(bodyParser.json());

// GET /users
// Get a list of users
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      return res.status(500).json({
        error: "Error listing users: " + err
      });
    }

    res.json(users);
  });
});

// GET /users/:id
// Get a user by ID
router.get('/:id', function(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: "Error reading user: " + err
      });
    }

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  });
});

// POST /users/create
// Post details of new user
router.post('/create', function(req, res, next) {
  var user = new User(req.body);
  user.save().then(function(newUser) {
    res.status(200).json(newUser);
  });
});

module.exports = router;
