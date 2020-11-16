const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth')
const User = require('../models/User');
const Post = require('../models/Post');


// @route    GET api/posts
// @desc     Get all posts
// @access   Public
router.get('/allposts', async (req, res) => {
	var page=req.query.page;
	var limit=req.query.take;
	try {
			var limit = parseInt(limit);
			var skip = (parseInt(page)-1) * parseInt(limit);
			const measurements = await Post.find().sort({ date: -1 }).skip(skip).limit(limit);
			const totalBodyMeasurmetns = await Post.find();
			res.json({
				"total": totalBodyMeasurmetns.length,
				"data": measurements
			});
            
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

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
// @desc     Get all posts for specific user
// @access   Private
router.get('/', auth, async (req, res) => {
	var page=req.query.page;
	var limit=req.query.take;
	try {
			var limit = parseInt(limit);
			var skip = (parseInt(page)-1) * parseInt(limit);
			const measurements = await Post.find({userId:req.user.id}).sort({ date: -1 }).skip(skip).limit(limit);
            res.json(measurements);
            
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