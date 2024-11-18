const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            throw new Error("Not a valid token")
        }
        const decodedMessage = await jwt.verify(token, "nillu$nillu")
        const { _id } = decodedMessage
        const user = await User.findById({ _id: _id })
        if (!user) {
            throw new Error("No user found")
        }
        req.user = user
        next()
    }
    catch (err) {
        res.status(400).send("Something went wrong while authentication " + err)
    }

}

module.exports = userAuth