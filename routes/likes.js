const express = require("express");
const router = express.Router();
const { Like, Post } = require("../models");

const Joi = require("joi");
const { Op } = require("sequelize");



router.post("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const user = res.locals.user;

    existedLike= await Like.findOne({where : {userId : user.userId, postId}});
    if (!existedLike){
        Like.create({userId : user.userId, postId}).then(()=>{
            Like.count({where:{postId},}).then((count)=>{
                Post.findOne({where : {postId}}).then((existsPost)=>{
                    existsPost.likeCount=count;
                    existsPost.save();
                    return res.status(200).json({message : "좋아요 클릭!"});
                });
            });
        });
    }else {
        existedLike.destroy().then(()=>{
            Like.count({where:{postId},}).then((count)=>{
                Post.findOne({where: {postId}}).then((existsPost)=>{
                    console.log("count가 있는지? : ",count);
                    existsPost.likeCount=count;
                    existsPost.save();
                    return res.status(200).json({message : "좋아요 지우기!"});
                });
            });
        });
    }

  } catch (error) {
    console.log("좋아요 error 표시 : ", error);
    return res.status(400).json({ error: "좋아요 클릭/삭제에 실패했습니다." });
  }
});


module.exports = router;
