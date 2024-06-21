const { Member } = require('../models/allModel');
const bcrypt = require('bcrypt');
var passport = require('passport');

class authController {
    getLogin(req, res) {
        res.render('login', { title: 'Login', errors: [] });
    }
    getRegister(req, res) {
        res.render('register', { title: 'Register', errors: [] });
    }
    async registerMember(req, res) {
        try {
            const { username, password, name, yob } = req.body;
            let errors = []

            if (!username || !password || !name || !yob) {
                errors.push({ msg: 'Please enter all fields' });
            }
            if (password.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
            }
            const currentYear = new Date().getFullYear();
            if (isNaN(yob) || yob < 1900 || yob > currentYear) {
                errors.push({ msg: `Year of birth must be between 1900 and ${currentYear}` });
            }
            // Check if the email is already taken
            const existingMember = await Member.findOne({ membername: username });
            if (existingMember) {
                errors.push({ msg: 'Username already exists' });
            }
            if (errors.length > 0) {
                res.render('index', {
                    title: 'Watch project',
                    errors,
                });
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new user with the default role 'member'
                const newMember = new Member({
                    name: name,
                    yob: yob,
                    membername: username,
                    password: hashedPassword,
                    isAdmin: false,
                });
                newMember.save();
                // Save the user to the database
                res.redirect('/auth/login');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }

    async loginMember(req, res, next) {
        try {
            const { username, password } = req.body;
            let errors = []

            if (!username || !password) {
                errors.push({ msg: 'Please enter all fields' });
            }
            if (password.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
            }

            // Find the member by username
            const member = await Member.findOne({ membername: username });
            if (!member) {
                errors.push({ msg: 'Invalid username or password' });
            }

            // Check if the password matches
            if (member) {
                const isMatch = await bcrypt.compare(password, member.password);
                if (!isMatch) {
                    errors.push({ msg: 'Invalid username or password' });
                }
            }
            if (errors.length > 0) {
                return res.render('login', {
                    title: 'Authentication Failed',
                    errors: errors,
                });
            }
            passport.authenticate('local', {
                successRedirect: '/watches',
                failureRedirect: '/',
                failureFlash: true
            })(req, res, next);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
    logoutMember(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.flash('success_msg', 'You are logged out successfully');
            res.redirect('/auth/login');
        });
    }

}

module.exports = new authController()