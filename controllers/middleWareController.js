const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.token;
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, '2003', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function checkAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    next();
}
module.exports = checkAdmin;
module.exports = authenticateToken;