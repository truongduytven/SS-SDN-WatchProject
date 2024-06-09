const { Watch, Member, Comment } = require('../models/allModel');
const bcrypt = require('bcrypt');

class memberController {
    async registerMember(req, res) {
        try {
            const { username, password } = req.body;
            let errors = []

            if (!username || !password) {
                errors.push({ msg: 'Please enter all fields' });
            }
            if (password.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
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
                    membername: username,
                    password: hashedPassword,
                    isAdmin: false,
                });
                newMember.save();
                // Save the user to the database
                req.session.memberId = newMember._id;
                req.session.isAdmin = newMember.isAdmin;
                req.session.membername = username;
                res.redirect('/watches');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }

    async loginMember(req, res) {
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
            const isMatch = await bcrypt.compare(password, member.password);
            if (!isMatch) {
                errors.push({ msg: 'Invalid username or password' });
            }
            if (errors.length > 0) {
                res.render('index', {
                    title: 'Watch project',
                    errors,
                });
            } else {
                // Set session
                req.session.memberId = member._id;
                req.session.isAdmin = member.isAdmin;
                req.session.membername = username;
                res.redirect('/watches');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
    async logoutMember(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Failed to logout');
            }
            res.redirect('/');
        });
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
            const { username, newPassword } = req.body;
            const membername = req.session.membername;
            const comments = await Comment.find({ author: memberId });
            let errors = []
            if (!username && !newPassword) {
                errors.push({ msg: 'Please enter any fields' });
            }
            if (newPassword.length > 0 && newPassword.length < 6) {
                errors.push({ msg: 'Password must be at least 6 characters' });
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
}

module.exports = new memberController();