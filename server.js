const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/dbconn.env" });

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 4000;

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        app.listen(port, () => {
            console.log("Database Connection Successfull!!!");
        });
    })
    .catch((err) => console.log(err));

app.use(userRoutes);
