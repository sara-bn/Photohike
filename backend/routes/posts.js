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

// @route    GET api/posts
// @desc     Get all posts
// @access   Public
router.get('/', async (req, res) => {
	try {
		//sort posts by data
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route    GetByUserId api/posts/:id
// @desc     Get all posts from a user
// @access   Private
router.get('/myposts', auth, async (req, res) => {
	try {
			const posts = await Post.find({userId:req.user.id});
            res.json(posts);
            
	} catch (err) {
		console.error(err.message);

		res.status(500).send('Server Error');
	}
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', auth, async (req, res) => {
	try {
			const post = await Post.findById(req.params.id);

			if (!post) {
				return res.status(404).json({ msg: 'Post not found' });
			}

			// Check user
			if (post.userId.toString() !== req.user.id) {
				return res.status(401).json({ msg: 'User not authorized' });
			}

			await post.remove();

			res.json({ msg: 'Post removed' });
	} catch (err) {
		console.error(err.message);

		res.status(500).send('Server Error');
	}
});

module.exports = router;