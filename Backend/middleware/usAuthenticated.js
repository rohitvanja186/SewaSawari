const jwt = require("jsonwebtoken")
const {promisify} = require("util")

exports.isAuthenticated = async (req,res,next) => {
    const token = req.Cookies.Token

    // check if token given or not
    if(!token){
        return res.send("Token must be provided")
    }

    // verify token if it is legit or not
    const decryptedResult = await promisify (jwt.verify)(token,process.env.SECRETKEY)
    console.log(decryptedResult)
    
}