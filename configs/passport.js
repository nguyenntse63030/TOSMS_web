var passport = require('passport')
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
const constant = require('./constant')
var responseStatus = require('./responseStatus')
const config = require('../config')
var LocalStrategy = require('passport-local').Strategy
const userController = require('../api/v1/controllers/userController')


async function createPassportConfig(app) {
  try {
    passport.use(new LocalStrategy(
      {
        usernameField: 'phone',
        passwordField: 'password',
        passReqToCallback: true
      },
      async function (req, username, password, done) {
        // const usernameTrim = trimUsername(username);
        let user = await User.findOne({ phone: usernameTrim })
        if (!user) {
          return done(responseStatus.Code400({ errorMessage: responseStatus.INVALID_REQUEST }))
        }
        if (!await user.authenticate(password)) {
          return done(responseStatus.Code401({ errorMessage: responseStatus.IVALID_PHONE_OR_PASSWORD }), false)
        }

        let token = ''
        if (user.role === constant.userRole.MANAGER) {
          token = jwt.sign({ id: user._id, phone: user.phone, name: user.name, role: user.role, apartment: user.apartment, loggedInTimestamp: Date.now() }, config.secret, {
            expiresIn: config.tokenExpire
          })
        }
        delete user.password
        return done(null, true, {
          user: user,
          token: token
        })
      }
    ))

    passport.use(new GoogleStrategy(
      {
        clientID: '469629757306-eb87hjdvp4167srimhk4bam7uanurdv1.apps.googleusercontent.com',
        clientSecret: '4fsDLQPlmiNi438dbIxYx7m0',
        callbackURL: 'https://apartmentprc391.herokuapp.com/api/v1/auth/google/callback'
        // callbackURL: 'http://localhost:1998/api/v1/auth/google/callback'
      },
      function (req, accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }, async function (err, user) {
          if (err) { return done(err) }
          if (user) {
            var token = jwt.sign({ id: user._id, phone: user.phone, name: user.name, role: user.role, loggedInTimestamp: Date.now() }, config.secret, {
              expiresIn: config.tokenExpire
            })
            return done(null, true, {
              user: user,
              token: token
            })
          }
          if (!user) {
            let newUser = {
              email: profile.emails[0].value,
              name: profile.name.givenName + profile.name.familyName,
              isGoogleAcc: true,
            }
            let dataReturn = await userController.signUpForSocial(newUser);
            done(null, user, dataReturn)
          }
        })
      }
    ))
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
  const trimUsername = name => {
    return name.replace(/[\s.,]/g, '')
  }

  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports = {
  createPassportConfig: createPassportConfig,
  passport: passport
}
