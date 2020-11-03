//registration
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', [ 
    check('email', 'Please include a valid email').isEmail(),
    check(
    'password',
    'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
],  async (req, res) => {

    const {email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let userWithSameEmail = await User.findOne({ email });

        if (userWithSameEmail) {
        return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }
        
        user = new User({
        email,
        password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
        user: {
            id: user.id
        }
        };

        jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

module.exports = router;