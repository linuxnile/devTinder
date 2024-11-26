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

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedUser, status: "accepted" },
                { toUserId: loggedUser, status: "accepted" },
            ],
        }).populate("fromUserId", userSafeData).populate("toUserId", userSafeData);

        const data = connectionRequest.map((rows) => {
            if (rows.fromUserId._id.equals(loggedUser)) {
                return rows.toUserId
            }
            return rows.fromUserId
        })

        res.json({ message: "Data fetch successfully", data });
    } catch (error) {
        res.status(400).send("Error occur " + error);
    }
});

module.exports = userRouter;
