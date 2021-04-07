const { Router } = require('express');
const checkAuthorization = require('../middlewares/checkAuthorization');
const checkPublication = require('../middlewares/checkPublication');
const Publication = require('../models/Publication');
const User = require('../models/Users');

const router = Router();

// api/publication/publications
router.get('/by_user/:userId', checkAuthorization, async (req, res) => {
    const { userId } = req.params;

    try {
        const publications = await Publication.find({ authorId: userId }).sort({ date: -1 });

        if (!publications) {
            res.status(204).json({ isOk: true, message: 'Ви ще нічого не публікували' });
        }
        res.json({ isOk: true, publications })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})


// api/publication/add_publication
router.post('/add_publication', checkAuthorization, async (req, res) => {
    let { userId: authorId, textPublication: text } = req.body;
    try {
        if (text.trim().length < 10) {
            res.status(400).json({ isOk: false, message: 'Публікація - не менше 10 символі' });
            return false;
        }
        const publication = await new Publication({
            text: text,
            authorId
        })
        if (!publication) {
            throw new Error('Ошибка сервера')
        }
        await publication.save();
        res.json({ isOk: true, message: 'Публікація добавлена' })
    }
    catch (e) {
        console.log(e);
        if (e.message) console.log(e.message)
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }


})

// api/publication/delete/:publicationId
router.delete('/delete/:publicationId', checkAuthorization, async (req, res) => {
    const { publicationId: _id } = req.params;

    try {
        const result = await Publication.deleteOne({ _id });
        if (result.deletedCount !== 1) {
            throw new Error('Не було видалено');
        }
        res.status(200).json({ isOk: true, message: 'Публікація була видалена' });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})



// api/publication/edit
router.patch('/edit', checkAuthorization, async (req, res) => {
    const { value: text, id: _id } = req.body;
    try {
        if (text.trim().length < 10) {
            res.status(400).json({ isOk: false, message: 'Публікація - не менше 10 символі' });
            return false;
        }
        const result = await Publication.updateOne(
            { _id },
            {
                $set: { text }
            })
        if (!result) {
            throw new Error('Ошибка сервера')
        }
        res.json({ isOk: true, message: 'Публікацію було змінено' })
    }
    catch (e) {
        console.log(e);
        if (e.message) console.log(e.message)
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})



// api/publication/add_comment
router.patch('/add_comment', checkAuthorization, checkPublication, async (req, res) => {
    const { value: text, publicationId: _id, authorId } = req.body;    // id - id публікації не author id
    try {
        if (text.trim().length < 10) {
            res.status(400).json({ isOk: false, message: 'Коммент - не менше 10 символів' });
            return false;
        }
        const author = await User.findOne({ _id: authorId });
        const { name, surname } = author;

        const result = await Publication.findOneAndUpdate({
            _id
        }, {
            $push: {
                comments: { text, authorId, authorName: `${name} ${surname}` }
            }
        }, {
            new: true
        })
        if (!result) {
            throw new Error('Ошибка сервера');
        }
        res.json({ isOk: true, message: 'Коментар було додано', comments: result.comments });
    }
    catch (e) {
        console.log(e);
        if (e.message) console.log(e.message)
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})

// api/publication/delete_comment
router.delete('/delete_comment', checkAuthorization, checkPublication, async (req, res) => {
    const { publicationId: _id, commentId } = req.body;
    try {
        const result = await Publication.findOneAndUpdate({
            _id
        }, {
            $pull: {
                comments: { _id: commentId }
            }
        }, {
            new: true
        })
        if (!result) {
            throw new Error('Ошибка сервера');
        }
        res.json({ isOk: true, message: 'Коментар було видалено', comments: result.comments });
    }
    catch (e) {
        console.log(e);
        if (e.message) console.log(e.message)
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})


router.post('/get_list', checkAuthorization, async (req, res) => {
    const { ids } = req.body;   // масив id`s



    try {
        const idsForMongo = ids.map((id) => { return { authorId: id } });

        const result = await Publication.find({ $or: idsForMongo }).sort({ date: -1 });
        if (result) {
            res.json({ isOk: true, publications: result })
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ isOk: false, message: 'Ошибка сервера' });
    }
})



module.exports = router;