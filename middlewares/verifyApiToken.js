const User = require('../models/User')

async function verifyApiToken(req, res, next) {
    const token = req.body.api_token
    if(!token){
        return res.json("No token")
    }
    // console.log(token)
    const user = await User.findOne({
        api_token: token
    })
    // console.log(user)
    if(!user){
        return res.status(500).json({
            data: {
                message: "Invalid Api Token",
                status: false
            }
        })
    }
    req.user = user
    next()
}

module.exports = verifyApiToken