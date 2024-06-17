const { Watch, Member, Comment } = require('../models/allModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
var passport = require('passport');

class memberController {
    getHome(req, res, next) {
        res.render('index', { title: 'Watch project', errors: [] });
    }
    async getMemberInfo(req, res) {
        const membername = req.session.membername;
        const memberId = req.session.memberId;
        const watches = await Watch.find({ 'comments.author': memberId });

        // Extract comments from the watches
        const comments = [];
        watches.forEach(watch => {
            watch.comments.forEach(comment => {
                if (comment.author.toString() === memberId) {
                    comments.push({
                        content: comment.content,
                        rating: comment.rating,
                        watchName: watch.watchName,
                        watchImage: watch.image,
                    });
                }
            });
        });
        res.render('profile', {
            title: 'Profile',
            membername,
            errors: [],
            comments,
        });
    }
    async editMemberInfo(req, res) {
        try {
            const memberId = req.session.memberId; // Assuming you store the memberId in the session upon login
            const { username, newPassword, name, yob } = req.body;
            const membername = req.session.membername;
            const comments = await Comment.find({ author: memberId });
            let errors = []
            if (!name && !yob && !username && !newPassword) {
                errors.push({ msg: 'Please enter any fields' });
            }
            if (newPassword.length > 0 && newPassword.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
            }
            const currentYear = new Date().getFullYear();
            if (isNaN(yob) || yob < 1900 || yob > currentYear) {
                errors.push({ msg: `Year of birth must be between 1900 and ${currentYear}` });
            }
            // Find the member by ID
            const member = await Member.findById(memberId);
            if (!member) {
                errors.push({ msg: 'Member not found' });
            }
            if (errors.length > 0) {
                res.render('profile', {
                    title: 'Profile',
                    membername,
                    errors,
                    comments,
                });
            } else {
                // Update member information
                if (username) {
                    member.membername = username;
                }
                if (name) {
                    member.name = name;
                }
                if (yob) {
                    member.yob = yob;
                }
                if (newPassword) {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    member.password = hashedPassword;
                }
                // Save the updated member information
                await member.save();
                req.session.memberId = member._id;
                req.session.isAdmin = member.isAdmin;
                req.session.membername = username;
                res.redirect('/profile');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
    async getAccount(req, res) {
        try {
            const memberlist = await Member.find({});
            res.render('memberlist', {
                title: 'List of Members',
                memberlist,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
}

module.exports = new memberController();