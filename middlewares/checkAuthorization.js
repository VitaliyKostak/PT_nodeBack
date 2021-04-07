const jwt = require('jsonwebtoken');
const config = require('../config.json');
function checkAuthorization(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const userId = req.body.userId || req.params.userId;
        if (!token && !userId) {
            res.status(401).json({ isOk: false, message: 'Ви не авторизовані' });
        }

        const decodedToken = jwt.verify(token, config.jwt);
        if (decodedToken.id && decodedToken.id === userId) {
            next();
            return false;
        }
        res.status(401).json({ isOk: false, message: 'Ви не авторизовані' });


    }
    catch (e) {
        console.log(e)
        res.status(401).json({ isOk: false, message: 'Ви не авторизовані' });
    }
}

module.exports = checkAuthorization;