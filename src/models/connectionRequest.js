const mongoose = require("mongoose")
const User = require("./user")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is not allowed'
        }
    }
},
    {
        timestamps: true
    }
)

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("We can't send connection request to yourself")
    }
    next()
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest