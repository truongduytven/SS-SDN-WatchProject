const { Watch, Member, Comment } = require('../models/allModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

class memberController {
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
                // const accessToken = jwt.sign({ 
                //     membername: member.membername, 
                //     isAdmin: member.isAdmin }, '2003', 
                // { expiresIn: '1h'});
                // // Set session
                // res.json({
                //     memberName: member.membername,
                //     memberId: member._id,
                //     isAdmin: member.isAdmin,
                //     accessToken: accessToken,
                // },)
                req.session.memberId = member._id;
                req.session.isAdmin = member.isAdmin;
                req.session.membername = member.membername;
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