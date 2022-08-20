const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middlewares");

//const userRouter = require("./users");
const loginRouter = require("./login");
const postRouter = require("./posts");

//router.use("/", userRouter);
router.use("/", loginRouter);
router.use("/post", auth, postRouter);

module.exports = router;
