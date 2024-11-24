const express = require("express")
const requestRouter = express.Router()
const userAuth = require("../middlewares/auth")
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            throw new Error("That status is not allowed")
        }

        const checkToUserIdValid = await User.findById(toUserId)
        if (!checkToUserIdValid) {
            throw new Error("User not exist")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }]
        })
        if (existingConnectionRequest) {
            throw new Error("Connection request already exist")
        }

        // validate for self? check model

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        await connectionRequest.save()
        res.json({ message: `Connection ${status} sent successfully`, data: connectionRequest })
    } catch (error) {
        res.status(400).json("Error occur " + error)
    }
})

module.exports = requestRouter