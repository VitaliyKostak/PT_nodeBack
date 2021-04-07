const { Router } = require('express');

const User = require('../models/Users');
const checkAuthorization = require('../middlewares/checkAuthorization');
const checkFriendOut = require('../middlewares/checkFriendOut');
const checkFriendFalse = require('../middlewares/checkFriendFalse');
const checkFriend = require('../middlewares/checkFriend');
const checkFriendFalse2 = require('../middlewares/checkFriendFalse2');
const сheckFriendFalse3 = require('../middlewares/сheckFriendFalse3');

const router = Router();
// /api/friend/friendOut - відправити заявку в друзі
router.patch('/friendOut', checkAuthorization, checkFriendOut, async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const firstStep = await User.findOneAndUpdate(  // користувачу який відправляв зявку....
            { _id: userId },
            {
                $push: {
                    friendsOutList: friendId
                }
            },
            { new: true }
        )
        if (!firstStep) {
            throw new Error()
        }
        const secondStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: friendId },
            {
                $push: {
                    friendsInList: userId
                }
            }
        )
        if (!secondStep) {
            throw new Error()
        }
        res.json({ isOk: true, newStatusFriend: 'friendOut' })

    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }

})
// /api/friend/friendOut - відкликати свою заявку в друзі
router.patch('/friendFalse', checkAuthorization, checkFriendFalse, async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const firstStep = await User.findOneAndUpdate(  // користувачу який відправляв зявку....
            { _id: userId },
            {
                $pull: {
                    friendsOutList: friendId
                }
            },
            { new: true }
        )
        if (!firstStep) {
            throw new Error()
        }
        const secondStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: friendId },
            {
                $pull: {
                    friendsInList: userId
                }
            }
        )
        if (!secondStep) {
            throw new Error()
        }
        res.json({ isOk: true, newStatusFriend: false })

    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }

})
// /api/friend/friend - прийняти заявку в друзі
router.patch('/friend', checkAuthorization, checkFriend, async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const firstStep = await User.findOneAndUpdate(  // користувачу який відправляв зявку....
            { _id: userId },
            {
                $pull: {
                    friendsInList: friendId
                }
            },
            { new: true }
        )
        if (!firstStep) {
            throw new Error()
        }
        const secondStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: friendId },
            {
                $pull: {
                    friendsOutList: userId
                }
            }
        )
        if (!secondStep) {
            throw new Error()
        }
        const thirdStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: friendId },
            {
                $push: {
                    friendsList: userId
                }
            }
        )
        if (!thirdStep) {
            throw new Error()
        }
        const fourthStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: userId },
            {
                $push: {
                    friendsList: friendId
                }
            }
        )
        if (!fourthStep) {
            throw new Error()
        }
        res.json({ isOk: true, newStatusFriend: 'friend' })

    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }

})

// /api/friend/friend - відхилити заявку в друзі
router.patch('/friendFalse-', checkAuthorization, checkFriendFalse2, async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const firstStep = await User.findOneAndUpdate(  // користувачу який відправляв зявку....
            { _id: userId },
            {
                $pull: {
                    friendsInList: friendId
                }
            },
        )
        if (!firstStep) {
            throw new Error()
        }
        const secondStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: friendId },
            {
                $pull: {
                    friendsOutList: userId
                }
            }
        )
        if (!secondStep) {
            throw new Error()
        }

        res.json({ isOk: true, newStatusFriend: false })

    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }

})
// /api/friend/friend - видалити з друзів
router.patch('/friendFalse--', checkAuthorization, сheckFriendFalse3, async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const firstStep = await User.findOneAndUpdate(  // користувачу який відправляв зявку....
            { _id: userId },
            {
                $pull: {
                    friendsList: friendId
                }
            },
        )
        if (!firstStep) {
            throw new Error()
        }
        const secondStep = await User.findOneAndUpdate(  // користувачу якому відправляють зявку....
            { _id: friendId },
            {
                $pull: {
                    friendsList: userId
                }
            }
        )
        if (!secondStep) {
            throw new Error()
        }

        res.json({ isOk: true, newStatusFriend: false })

    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }

})

router.get('/friendsByUser/:userId', checkAuthorization, async (req, res) => {
    const { userId: _id } = req.params;

    try {
        const user = await User.findOne({ _id });

        if (!user) {
            res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
            return false;
        }
        console.log(user);
        if (!user.friendsList.length && !user.friendsInList.length && !user.friendsOutList.length) {
            res.json({ isOk: true, noSomebody: true });
            return false
        }
        const ids = [...user.friendsList, ...user.friendsInList, ...user.friendsOutList];

        const unSortFriends = await User.find({ _id: { $in: ids } });

        const sortFriends = unSortFriends.reduce((accum, friend) => {
            if (user.friendsList.includes(friend._id)) {
                accum.friendsList.push(friend)
            }
            if (user.friendsInList.includes(friend._id)) {
                accum.friendsInList.push(friend)
            }
            if (user.friendsOutList.includes(friend._id)) {
                accum.friendsOutList.push(friend)
            }
            return accum;
        }, {
            friendsList: [],
            friendsInList: [],
            friendsOutList: []
        })

        res.json({ isOk: true, ...sortFriends })

    } catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})
module.exports = router;