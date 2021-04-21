const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth');
});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (username === '' || password === '') {
        res.render('auth/signup', 
        {errorMessage: 'indicate username and password'})
        return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if (passwordRegex.test(password) === false) {
        res.render('auth/signup', 
        { errorMessage: 'Password is too weak' });
        return;
    }
    const user = await User.findOne({ username: username});
    if (user !== null) {
        res.render('auth/signup', 
        { errorMessage: 'user already exists' });
        return;
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({
        username,
        email, 
        password: hashedPassword
    });
    res.redirect('/');
});

module.exports = router;