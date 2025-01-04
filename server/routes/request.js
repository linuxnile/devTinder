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

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params
        const loggedUser = req.user._id

        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            throw new Error("Status not allowed")
        }

        const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggedUser, status: "interested" })
        if (!connectionRequest) {
            return res.status(404).send("No request found")
        }

        connectionRequest.status = status
        const data = await connectionRequest.save()

        res.json({ message: "Connection request " + status + " successfully", data })
    } catch (error) {
        res.status(400).send("Error: " + error)
    }
})

module.exports = requestRouter