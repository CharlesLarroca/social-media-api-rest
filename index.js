const express =  require('express')
const app = express()

const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const helmet = require('helmet')

const usersRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes')
const postsRoutes = require('./routes/postsRoutes')

dotenv.config()

try {
  mongoose.connect(process.env.MONGODB_URL)
  console.log('Connected to Database')
} catch (error) {
  console.log('Connection failed!')
}

//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

//routes
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)

app.listen(5000, () => console.log(`Backend Server is running! http://localhost:5000/`))