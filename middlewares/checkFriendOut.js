
const User = require('../models/Users');

async function checkFriendOut(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {

        const { userId, friendId } = req.body;

        const user = await User.findOne({ _id: userId });
        if (user.friendsInList.includes(friendId)) {
            res.json({ isOk: true, newStatusFriend: 'friendIn' })
            return false;
        }
        next();


    } catch (e) {
        console.log(e);

        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
}

module.exports = checkFriendOut;