const { Router } = require('express');
const mongoose = require('mongoose');
const checkAuthorization = require('../middlewares/checkAuthorization');
const User = require('../models/Users');

const router = Router();

router.get('/users', async (req, res) => {  //всі користувачі
    try {
        const result = await User.find();
        res.json({ isOk: true, users: result });
    } catch (e) {
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
})

// /api/user/by_id/:userId
router.get('/by_id/:userId', async (req, res) => {
    const { userId: _id } = req.params;
    try {
        const user = await User.findOne({
            _id
        });
        if (user) {
            res.json({ isOk: true, user })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
})

// /api/user/:userId/:authorId
router.get('/:userId/:authorId', async (req, res) => {
    const { authorId: _id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    try {
        if (!isValid) throw new Error();
        const user = await User.findOne({
            _id
        });
        if (user) {
            res.json({ isOk: true, user })
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
})



module.exports = router;