const { createUser, upload, userLogin } = require('../controller/userController');

const express = require('express')

const router = express.Router()

// create user
router.post('/create-user', upload, createUser)

// Login user
router.post('/login', userLogin)

module.exports =  router;