const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

// Register Route
router.post('/register', AuthController.register)

//Login Route
router.post('/login', AuthController.login)

module.exports = router