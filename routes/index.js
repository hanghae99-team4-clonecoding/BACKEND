const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth-middleware");

//const userRouter = require("./users");
const loginRouter = require("./login");
const postRouter = require("./posts");
const signupRouter = require("./signup");
const likeRouter = require("./likes");
const passportConfig = require("../passport");


const testPostRouter = require("./testPosts");
const testLikeRouter = require("./testLike");

//router.use("/", userRouter);
router.use("/", loginRouter);
router.use("/signup", signupRouter);
router.use("/post", auth, postRouter);
router.use("/like", auth, likeRouter);
passportConfig()


router.use("/test/post", testPostRouter);
router.use("/test/like", testLikeRouter);

module.exports = router;
