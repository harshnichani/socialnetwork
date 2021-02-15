const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/dbconn.env" });

const userSchema = mongoose.Schema({
	username: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
	},
	password: {
		type: String,
		required: true,
	},
	number: {
		type: Number,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	image: {
		type: String,
	},
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.generateToken = async function () {
	try {
		const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KET);
		return token;
	} catch {
		console.log("Error!!");
	}
};

const User = mongoose.model("user", userSchema);

module.exports = User;
