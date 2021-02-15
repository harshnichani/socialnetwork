const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
require("dotenv").config({ path: "../config/dbconn.env" });

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtauth;
        const verifiedUser = await jwt.verify(token, process.env.SECRET_KET);
        const user = await User.findOne({ _id: verifiedUser._id });
        res.locals.user = user;
        next();
    } catch (error) {
        res.render("login", { msg: "Session Expired" });
    }
};

// Middleware for checking email
const checkemail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            res.render("register", { msg: "Email Already Exist" });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { auth, checkemail };
