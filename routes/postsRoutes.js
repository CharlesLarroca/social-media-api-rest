const router = require('express').Router()
const PostsController = require('../controllers/PostsController')

router.post('/', PostsController.createPost)

router.put('/:id', PostsController.updatePost)

router.delete('/:id', PostsController.deletePost)

router.put('/:id/like', PostsController.likePost)

router.get('/timeline/all', PostsController.getPosts)

router.get('/:id', PostsController.getPost)


module.exports = router