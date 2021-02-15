const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const { auth, checkemail } = require("../middleware/auth");

router.get("/", userController.login_get);

router.get("/register", userController.register_get);

router.post("/register", checkemail, userController.register_post);

router.post("/", userController.login_post);

router.get("/profile", auth, userController.profile_get);

router.post("/update_details", auth, userController.update_details_post);

router.post("/update_avatar", auth, userController.upload, userController.update_avatar_post);

router.post("/change_password", auth, userController.change_password_post);

router.get("/logout", auth, userController.logout_get);

module.exports = router;
