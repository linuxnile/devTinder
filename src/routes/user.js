const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userSafeData = "firstName lastName age about skills gender";

userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user._id;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedUser,
            status: "interested",
        }).populate("fromUserId", userSafeData);
        res.json({ message: "Data fetch successfully", data: connectionRequests });
    } catch (error) {
        res.status(400).send("Error occur " + error);
    }
});

module.exports = userRouter;
