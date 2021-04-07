
const Publication = require('../models/Publication');

async function checkPublication(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {

        const { publicationId: _id } = req.body;

        const publication = await Publication.findOne({ _id });

        if (!publication) {
            res.json({ isOk: false, noPub: true });
            return false;
        }
        next();


    } catch (e) {
        console.log(e);

        res.status(500).json({ isOk: false, message: 'Ошибка сервера' })
    }
}

module.exports = checkPublication;