
const User = require('../models/Users');

async function checkFriendFalse(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {

        const { userId, friendId } = req.body;

        const user = await User.findOne({ _id: friendId });
        if (user.friendsInList.includes(userId)) {
            next();
            return false;
        }
        else if (user.friendsList.includes(userId)) {
            res.json({ isOk: true, newStatusFriend: 'friend' })
            return false;
        }
        next();


    } catch (e) {
        console.log(e);

        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
}

module.exports = checkFriendFalse;