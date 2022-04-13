const jwt = require('jsonwebtoken');
const User = require("../modules/user/userModel");

exports.protect = async(req, res, next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(400).json({
            message:"The user is not authenticated",
            user:null
        })
    }

    try{
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        
        console.log(decoded)
        const currentTime = Date.now()/1000
        if(currentTime>decoded.exp){
            return res.status(401).json({
                message:"The token has expired, user need to reauthenticate again",
                user: null
            })
        }
        req.user = await User.findById(decoded.data);
        next();
    }catch(error){
        return res.status(401).json({
            message:"The user is not authenticated",
            user:null
        })
    }
}

exports.registerProtect = async(req, res, next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(403).json({
            message:"The user is not authenticated",
            user:null
        })
    }

    try{
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        
        const currentTime = Date.now()/1000
        if(currentTime>decoded.exp){
            return res.status(401).json({
                message:"The token has expired, user need to reauthenticate again",
                user: null
            })
        }
        req.phone = decoded.data;
        next();
    }catch(error){
        return res.status(403).json({
            message:"The user is not authenticated",
            user:null
        })
    }
}


