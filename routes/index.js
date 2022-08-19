const express = require("express");
const router = express.Router();

// const userRouter = require("./users");
const loginRouter = require("./login");
// const postRouter = require("./posts")

// router.use("/", userRouter);
router.use("/", loginRouter);
// router.use("/post", postRouter);

module.exports = router;