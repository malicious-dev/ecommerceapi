const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if(authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if(err) {
        res.status(401).send(err.message);
        req.user = user;
        next();
      }
    })
  }else{
    return res.sttus(401).json("you are not authorized")
  }
}

const verifyTokenAndAuthorization = (req, res, next) => {
verifyToken(req, res, () => {
  if(req.user.id === req.params.id || req.user.isAdmin){
    next();
  }else {
    res.status(403).json("you are not allowed to access this!!")
  }
})
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin){
      next();
    }else {
      res.status(403).json("you are not allowed to access this!!")
    }
  })
  }

module.exports = {verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
}