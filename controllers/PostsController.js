const Post = require('../models/Post')
const User = require('../models/User')

module.exports = class PostsController{
  //create post
  static async createPost(req, res){
    const newPost = new Post(req.body)
    try {
      const savedPost = await newPost.save()
      res.status(200).json(savedPost)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  //update post
  static async updatePost(req, res){
    try {
      const post = await Post.findById(req.params.id)
      if(post.userId === req.body.userId){
        await Post.findByIdAndUpdate(req.params.id, {$set: req.body})
        res.status(200).json('Post Update!')
      } else {
        return res.status(403).json('You can only update your posts!')
      }
    } catch (error) {
      res.status(500).json(error)
    }
    
  }
  //delete post
  static async deletePost(req, res){
    try {
      const post = await Post.findById(req.params.id)
      if(post.userId === req.body.userId){
        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json('Post deleted!')
      } else {
        return res.status(403).json('You can only delete your posts!')
      }  
    } catch (error) {
      res.status(500).json(error)
    }
  }
  //like a post
  static async likePost(req, res){
    const post = await Post.findById(req.params.id)
    try {
      if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push: {likes: req.body.userId}})
        res.status(200).json('You like this post!')
      } else {
        await post.updateOne({$pull: {likes: req.body.userId}})
        res.status(200).json('You unlike this post!')
      }
    } catch (error) {
      res.status(500).json(error)
    }
    
  }
  //get a post
  static async getPost(req, res){
    try {
      const post = await Post.findById(req.params.id)
      res.status(200).json(post)
    } catch (error) {
      res.status(500).json(error)
    }
  }
  //get timeline posts
  static async getPosts(req, res){
    try {
      const currentUser = await User.findById(req.body.userId)
      const userPosts = await Post.find({userId: currentUser._id})
      const friendsPosts = await Promise.all(
        currentUser.followings.map(friendId => {
          return Post.find({userId: friendId})
        })
      )
      res.json(userPosts.concat(...friendsPosts))
    } catch (error) {
      res.status(500).json(error)
    }
  }
}