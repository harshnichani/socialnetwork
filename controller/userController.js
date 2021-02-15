const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
require("dotenv").config({ path: "../config/dbconn.env" });

// Middleware for multer
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

let upload = multer({
    storage,
}).single("file");

const login_get = (req, res) => {
    res.render("login", { msg: "" });
};

const register_get = (req, res) => {
    res.render("register", { msg: "" });
};

const register_post = async (req, res) => {
    const { email, password, password2 } = req.body;

    if (password === password2) {
        const userDetails = await new User({
            email,
            password,
        });

        const token = await userDetails.generateToken();

        res.cookie("jwtauth", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
        });

        await userDetails.save();

        res.render("register", { msg: "User Registered Successfully!!!" });
    } else {
        res.render("register", { msg: "Passwords does not Match" });
    }
};

const login_post = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);

        const token = await user.generateToken();

        res.cookie("jwtauth", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
        });

        if (isMatch) {
            res.redirect("/profile");
        } else {
            res.render("login", { msg: "User Details Invalid" });
        }
    } catch (error) {
        res.render("login", { msg: "User Details Invalid" });
    }
};

const profile_get = async (req, res) => {
    res.render("profile", { msg: "" });
};

const update_details_post = async (req, res) => {
    try {
        const { username, number } = req.body;
        const token = req.cookies.jwtauth;
        const verifiedUser = await jwt.verify(token, process.env.SECRET_KET);
        const user = await User.updateOne({ _id: verifiedUser._id }, { $set: { username, number } });
        res.render("profile", { msg: "Records Updated Successfully" });
    } catch (error) {
        res.redirect("/");
    }
};

const update_avatar_post = async (req, res) => {
    try {
        let image = req.file.filename;

        const token = req.cookies.jwtauth;
        const verifiedUser = await jwt.verify(token, process.env.SECRET_KET);
        const user = await User.updateOne({ _id: verifiedUser._id }, { $set: { image } });

        res.redirect("/profile");
    } catch (error) {
        res.redirect("/");
    }
};

const change_password_post = async (req, res) => {
    try {
        let { oldpassword, newpassword, confpassword } = req.body;

        const token = req.cookies.jwtauth;
        const verifiedUser = await jwt.verify(token, process.env.SECRET_KET);
        const user = await User.findOne({ _id: verifiedUser._id });

        let getPassword = user.password;

        if (bcrypt.compareSync(oldpassword, getPassword)) {
            if (newpassword == confpassword) {
                user.password = newpassword;

                await user.save();

                res.render("profile", { msg: "Password Changed Successfully" });
            } else {
                res.render("profile", { msg: "User Details Invalid" });
            }
        } else {
            res.render("profile", { msg: "User Details Invalid" });
        }
    } catch (error) {
        res.redirect("/");
    }
};

const logout_get = (req, res) => {
    res.clearCookie("jwtauth");
    res.redirect("/");
};

module.exports = {
    login_get,
    register_get,
    register_post,
    login_post,
    profile_get,
    update_details_post,
    update_avatar_post,
    change_password_post,
    logout_get,
    upload,
};
