const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    const data = connectionRequest.map((rows) => {
      if (rows.fromUserId._id.equals(loggedUser)) {
        return rows.toUserId;
      }
      return rows.fromUserId;
    });

    res.json({ message: "Data fetch successfully", data });
  } catch (error) {
    res.status(400).send("Error occur " + error);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedUser._id,
        },
        { toUserId: loggedUser._id },
      ],
    });

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        {
          _id: { $ne: loggedUser._id },
        },
      ],
    }).select(userSafeData);

    res.send(users);
  } catch (error) {
    res.status(400).send("Error occur " + error);
  }
});

module.exports = userRouter;
