const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth')
const User = require('../models/User');
const Post = require('../models/Post');

// @route    POST api/posts
// @desc     add post
// @access   Private
router.post('/', [auth, [check('caption', 'Caption is required').not().isEmpty()]],  async (req, res) => {
    console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const user = await User.findById(req.user.id).select('-password');

        post = new Post({
            caption:req.body.caption,
            userId: req.user.id,
            username: user.username
        });
        post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

module.exports = router;