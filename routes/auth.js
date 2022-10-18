require('dotenv').config();
const router = require('express').Router();
const User = require('../models/User.js');
const CryptoJS = require('crypto-js');

router.post("/register", async(req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body)
  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC),
  });
  try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }catch(err){
    res.status(500).json(err.message);
  }
})

router.post('/login', async(req, res) => {
  try{
    const user = await User.findOne({username: req.body.username});
    if(!user) {
      return res.status(401).json('Doesnt exits!!')
    }
    const hashedPasswords = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
  const password = hashedPasswords.toString(CryptoJS.enc.Utf8);

if(password !== req.body.password){
  return res.status(401).json('Password does not match')
}else{
  return res.status(200).json(user)
}
  }catch (err){
    return res.status(500).json(err.message);
  }
})

module.exports = router;