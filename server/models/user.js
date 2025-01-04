const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Passowrd is too weak")
            }
        }
    },
    age: {
        type: Number,
        min: 16
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is invalid");
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo urls is not valid")
            }
        }
    },
    about: {
        type: String,
        default: "Please write something in about section"
    },
    skills: {
        type: [String]
    }
},
    { timestamps: true }
)

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, "nillu$nillu", { expiresIn: "1d" })
    return token
}

userSchema.methods.validatePassword = async function (password) {
    const user = this
    const passCompare = await bcryptjs.compare(password, user.password)
    return passCompare
}

const User = mongoose.model("User", userSchema)

module.exports = User