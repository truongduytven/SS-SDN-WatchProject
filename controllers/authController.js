class authController {
    getLogin(req, res) {
        res.render('login', { title: 'Login', errors: [] });
    }
    getRegister(req, res) {
        res.render('register', { title: 'Register', errors: [] });
    }
}

module.exports = new authController()