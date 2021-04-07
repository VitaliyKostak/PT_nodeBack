const { Router } = require('express');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const router = Router();
const config = require('../config.json');

// ||   /api/authentication/registration
router.post(
    '/registration',
    [
        check('name').isLength({ min: 2 }).withMessage('Ім\'я - менше 2 символів'),
        check('surname').isLength({ min: 2 }).withMessage('Прізвище - менше 2 символів'),
        check('email').isEmail().withMessage('Некоректний email'),
        check('password').isLength({ min: 6 }).withMessage('Пароль - менше 2 символів')
    ],
    async (req, res) => {
        try {
            const inputDataErrors = validationResult(req);
            if (!inputDataErrors.isEmpty()) {
                return res.status(400).json({
                    isOk: false,
                    message: 'Некоректні дані',
                    errors: inputDataErrors.array().map(error => error.msg)
                })
            }

            const { name, surname, email, password } = req.body;


            const user = await User.findOne({ email }); // Можливо user з таким email вже існує

            if (user) {
                res.status(400).json({ isOk: false, message: 'Користувач з таким email вже існує' });
                return false;
            }

            const hashedPass = await bcrypt.hash(password, 12);
            const newUser = await new User({ name, surname, email, password: hashedPass });
            await newUser.save();

            res.status(201).json({ isOk: true, message: "Регістрація успішна" })


        } catch (e) {
            console.log(e)
            res.status(500).json({ isOk: false, message: "Ошибка сервера" })
        }
    });

// ||   /api/authentication/login
router.post(
    '/login',
    [
        check('email').isEmail().withMessage(('Некоректний email')),
        check('password').isLength({ min: 2 }).withMessage(('Пароль - менше 2 символів'))
    ],
    async (req, res) => {
        try {
            const inputDataErrors = validationResult(req);
            if (!inputDataErrors.isEmpty()) {
                return res.status(400).json({
                    isOk: false,
                    message: 'Некоректні дані',
                    errors: inputDataErrors.array()
                })
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ isOk: false, message: 'Користувача з email не існує' });
            }
            const isTruePass = await bcrypt.compare(password, user.password);

            if (!isTruePass) {
                return res.status(400).json({ isOk: false, message: 'Пароль не вірний' })
            }

            const token = jwt.sign({
                email: user.email,
                id: user._id
            }, config.jwt, { expiresIn: 60 * 1000 })

            res.json({ isOk: true, message: 'Авторизація успішна', token, userId: user.id })

        } catch (e) {
            console.log(e.message)
            res.status(500).json({ isOk: false, message: "Ошибка сервера" })
        }
    });

module.exports = router;