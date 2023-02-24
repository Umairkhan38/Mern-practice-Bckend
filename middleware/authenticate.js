const User = require("../models/userSchema.js");
const jwt = require('jsonwebtoken');


const Authenticate=async(req,res,next)=>{
    try {
        const token=req.cookies.jwtoken;
        const verifyToken= jwt.verify(token, process.env.JWT_SECRET);  
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token})
        if(!rootUser){ throw new Error('user not found')  }

        req.token=token;
        req.rootUser=rootUser
        req.userID=rootUser._id

        next()

    } catch (error) {
           console.log(error);
           res.status(401).json({error:'unauthorized token'})
        
    }
}

module.exports= Authenticate;



