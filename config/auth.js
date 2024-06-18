module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Please log in first!');
        res.redirect('/auth/login');
    },
    checkAdmin: function (req, res, next) {
        if(req.session.passport.user.isAdmin) {
            console.log('abc')
            return next();
        }
        res.redirect('/notfound');
    }
}
