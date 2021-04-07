
const User = require('../models/Users');

async function сheckFriendFalse3(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {

        const { userId, friendId } = req.body;

        const user = await User.findOne({ _id: friendId });
        if (user.friendsList.includes(userId)) {
            next();
            return false;
        }
        if (user.friendsOutList.includes(userId)) {
            res.json({ isOk: true, newStatusFriend: 'friendIn' })
            return false;
        }
        if (!user.friendsList.includes(userId) && !user.friendsOutList.includes(userId)) {
            res.json({ isOk: true, newStatusFriend: false })
        }


    } catch (e) {
        console.log(e);

        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
}

module.exports = сheckFriendFalse3;