'use strict';

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
var WebSocket = require('../components/websocket');
var WSMessage = require('../components/ws_message.js');
var jsonwebtoken = require('jsonwebtoken');
var jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    Users.getUserByEmail(username)
          .then((user) => {
              if (user === undefined) {
                return done(null, false, { message: 'Incorrect e-mail.' });
              } else {
                  if (!Users.checkPassword(user, password)) {
                    return done(null, false, { message: 'Wrong password.' });
                  } else {
                      return done(null, user);
                  }
              }
          }).catch(err => done(err));
    })
);


module.exports.authenticateUser = function authenticateUser (req, res, next) {
  
  if(req.query.type == "login"){
      passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err)
          return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, {session: false}, (err) => {
          if (err)
            return next(err);

          //notify all the clients that a user has logged in the service  
          Users.getActiveTaskUser(user.id)
          .then((task) => {
            var loginMessage;
            if(task == undefined) loginMessage = new WSMessage('login', user.id, user.name, undefined, undefined);
            else loginMessage = new WSMessage('login', user.id, user.name, task.id, task.description);
            WebSocket.sendAllClients(loginMessage);
            WebSocket.saveMessage(user.id, loginMessage);

            const token = jsonwebtoken.sign({ user: user.id }, jwtSecret);
            res.cookie('jwt', token, { httpOnly: true, sameSite: true});
            return res.json({ id: user.id, name: user.name });

          })
          
        });
      })(req, res, next);
    }
    
    else if(req.query.type == "logout"){
      const email = req.body.email;
      Users.getUserByEmail(email)
          .then((user) => {
              if (user === undefined) {
                  utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }],}, 404);
              } else {
                //notify all clients that a user has logged out from the service
                var logoutMessage = new WSMessage('logout', user.id, user.name);
                WebSocket.sendAllClients(logoutMessage);
                WebSocket.deleteMessage(user.id);
                //clear the cookie
                req.logout();
                res.clearCookie('jwt').end();
                }
              })
    }

    else{
      utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': "value for the query parameter not accepted" }],}, 400);
    }

  };

module.exports.getUsers = function getUsers (req, res, next) {
    Users.getUsers()
      .then(function (response) {
        if(!response){
          utils.writeJson(res, response, 404);
       } else {
         utils.writeJson(res, response);
      }
      })
      .catch(function (response) {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      });
  };

module.exports.getSingleUser = function getSingleUser (req, res, next) {
    Users.getUserById(req.params.userId)
      .then(function (response) {
        if(!response){
          utils.writeJson(res, response, 404);
       } else {
         utils.writeJson(res, response);
      }
      })
      .catch(function (response) {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      });
  };