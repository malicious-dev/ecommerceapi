require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const userRouters = require('./routes/user')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('Engine Started...'))
.catch(err => console.log(err.message));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouters);

app.listen(process.env.PORT || 5000, () => {
  console.log('System Initiated .. at 5000');
})