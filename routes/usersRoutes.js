const router = require('express').Router()
const UsersController = require('../controllers/UsersController')

router.put('/:id', UsersController.update)

router.delete('/:id', UsersController.delete)

router.get('/:id', UsersController.getAUser)

router.put('/:id/follow', UsersController.follow)
router.put('/:id/unfollow', UsersController.unfollow)

module.exports = router