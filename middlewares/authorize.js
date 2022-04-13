//grant acess to specific roles
exports.authorize = (...roles) =>{
    return(req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to acess this route`, 401))
        }
        next()
    }
}