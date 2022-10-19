require('dotenv').config();
const router = require('express').Router();
const User = require('../models/User.js');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')
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
  return res.status(401).json("Wrong Credentials!!")
    }
    const hashedPasswords = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
  const OriginalPassword = hashedPasswords.toString(CryptoJS.enc.Utf8);

  if(OriginalPassword !== req.body.password){
    return res.status(401).json("Wrong Password!!");
  } 

const accessToken = jwt.sign({
  id:user._id,
  isAdmin:user.isAdmin,
}, process.env.JWT_SEC, {expiresIn: "3d"});

const {password, ...others} = user._doc;

return res.status(200).json({...others, accessToken});
  }catch (err){
     return res.status(500).json(err);
  }
})

module.exports = router;