const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin } = require('./verifyToken')
const router = require('express').Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if(req.body.password){
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
  }
  try{
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {new: true}
    )
    res.status(200).json(updatedUser)
  }catch(err){
    return res.status(401).json(err.message)
  }

})

//delete
router.delete("/:id", verifyTokenAndAuthorization, async(req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been deleted")
  }catch(err){
    res.status(401).json("error: " + err.message)
  }
})

//get user profile

router.get("/find/:id", verifyTokenAndAdmin, async(req, res) => {
  try{
const user = await User.findById(req.params.id)
const {password, ...others} = user._doc;
res.status(200).json(others);
  }catch(err){
    res.status(500).json("error: " + err.message)
  }
})

module.exports = router;