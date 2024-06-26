const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const { Member } = require('../models/allModel');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ username: 'username' }, (username, password, done) => {
            //Match user
            Member.findOne({ membername: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'This username is not registed' });
                    }
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: 'Password is incorrect' });
                        }
                    })
                })
                .catch(err => console.log(err));

        })
    )
    passport.serializeUser(function (user, done) {
        process.nextTick(function () {
            done(null, user);
        });
    });

    passport.deserializeUser(function (user, done) {
        process.nextTick(function () {
            return done(null, user);
        }); 
    });
}
