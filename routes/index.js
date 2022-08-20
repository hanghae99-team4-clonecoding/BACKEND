const express = require("express");
const router = express.Router();

// const userRouter = require("./users");
const loginRouter = require("./login");
const signupRouter = require("./signup");
// const postRouter = require("./posts")


// router.use("/", userRouter);
router.use("/login", loginRouter);
router.use("/signup", signupRouter);
// router.use("/post", postRouter);

module.exports = router;