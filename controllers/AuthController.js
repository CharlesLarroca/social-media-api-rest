const User = require('../models/User')
const bcryptjs = require('bcryptjs')

module.exports = class AuthController{
  static async register(req, res){
    try {
      //generate hashed password
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(req.body.password, salt)
  
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      })
  
      //save user and response
      const user = await newUser.save()
      res.status(200).json(user)
    } catch (error) {
      res.json(error)
    }
  }

  static async login(req, res){
    const {email, password} = req.body
    
    try {
      //validation if user exists
      const user = await User.findOne({email: email})
      !user && res.status(404).send('User not find!')
  
      //compare password
      const validPassword = await bcryptjs.compare(password, user.password)
      !validPassword && res.status(400).send('Wrong Password!')
  
      res.status(200).send(user)
  
    } catch (error) {
      res.status(500).json(error)
    }
  }
}