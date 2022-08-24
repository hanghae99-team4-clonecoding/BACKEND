const express = require("express");
const router = express.Router();
const { Like, Post } = require("../models");

const Joi = require("joi");
const { Op } = require("sequelize");

router.post("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const user = res.locals.user;

    existedLike = await Like.findOne({
      where: { userId: user.userId, postId },
    });
    if (!existedLike) {
      await Like.create({ userId: user.userId, postId });
      const count = await Like.count({ where: { postId } });
      const existsPost = await Post.findOne({ where: { postId } });
      existsPost.likeCount = count;
      existsPost.save();
      return res.status(200).json({ message: "좋아요 클릭!" });
    } else {
      await existedLike.destroy();
      const count = await Like.count({ where: { postId } });
      const existsPost = await Post.findOne({ where: { postId } });
      existsPost.likeCount = count;
      existsPost.save();
      return res.status(200).json({ message: "좋아요 지우기!" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
