const express = require("express");
const router = express.Router();
const { Like, Post } = require("../models");

const Joi = require("joi");
const { Op } = require("sequelize");

router.post("/:postId", async (req, res) => {
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
    console.log("좋아요 error 표시 : ", error);
    return res.status(400).json({ error: "좋아요 클릭/삭제에 실패했습니다." });
  }
});

module.exports = router;
