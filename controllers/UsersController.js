const User = require('../models/User')
const bcryptjs = require('bcryptjs')

module.exports = class UsersController{
  //update user
  static async update(req, res){
    if(req.body.userId === req.params.id || req.body.isAdmin){
      if(req.body.password){
        try {
          const salt = await bcryptjs.genSalt(10)
          req.body.password = await bcryptjs.hash(req.body.password, salt)
        } catch (error) {
          return res.status(500).json(error)
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body
        })
        res.status(200).json('User updated')
      } catch (error) {
        return res.status(500).json(error)
      }
    } else {
      res.status(403).json('You can only update your account!')
    }
  }
  //delete user
  static async delete(req, res){
    if(req.body.userId === req.params.id || req.body.isAdmin){
      try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted!')
      } catch (error) {
        return res.status(500).json(error)
      }
    } else {
      res.status(403).json('You can only delete your account!')
    }
  }
  //get a user
  static async getAUser(req, res){
    try {
      const user = await User.findById(req.params.id)
      const {_id, password, createdAt, updatedAt, isAdmin, ...other} = user._doc
      res.status(200).json(other)
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  //follow a user
  static async follow(req, res){
    if(req.body.userId !== req.params.id){
      try {
        const user = await User.findById(req.params.id) // User want to follow
        const currentUser = await User.findById(req.body.userId) // User of the account
        // Validation if the user is already followed by the current user
        if(!user.followers.includes(req.body.userId)){
          await currentUser.updateOne({$push:{followings:req.params.id}})
          await user.updateOne({$push:{followers:req.body.userId}})
          res.status(200).json('You are following this user now!')
        } else {
          res.status(403).json('You already follow this user!')
        }
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(403).json("You can't follow yourself!")
    }
  }
  //unfollow a user
  static async unfollow(req, res){
    if(req.body.userId !== req.params.id){
      try {
        const user = await User.findById(req.params.id) // User want to follow
        const currentUser = await User.findById(req.body.userId) // User of the account
        // Validation if the user is already followed by the current user
        if(user.followers.includes(req.body.userId)){
          await currentUser.updateOne({$pull:{followings:req.params.id}})
          await user.updateOne({$pull:{followers:req.body.userId}})
          res.status(200).json('You unfollow this user!')
        } else {
          res.status(403).json('You are not following this user!')
        }
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(403).json("You can't unfollow yourself!")
    }
  }
}