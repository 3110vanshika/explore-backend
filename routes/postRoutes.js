

const express = require('express');
const { upload, createPost, fetchAllPost, updatePost } = require('../controller/postController');

const router = express.Router()

// create post
router.post('/', upload, createPost)

// Fetch all post
router.get('/', fetchAllPost)

// Update post
router.put('/update-post/:_id', upload, updatePost)

module.exports =  router;