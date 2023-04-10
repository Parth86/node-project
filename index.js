const express = require('express');
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()
var multer = require('multer');
var upload = multer();

const PORT = process.env.PORT || 8800;

const userRouter = require('./routes/users')
const orderRouter = require('./routes/orders')
const verifyApiToken = require("./middlewares/verifyApiToken")

app.use(express.json())

// for parsing multipart/form-data
app.use(upload.single('api_token')); 
// app.use(express.static('public'));

app.use('/api/users', userRouter)
app.use('/api/orders', verifyApiToken, orderRouter)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('connected'))
.catch(err => console.error(err))

app.listen(PORT, function() {
    console.log('server running')
})