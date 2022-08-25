const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const boom = require("@hapi/boom");

const Joi = require("joi");
const { Op } = require("sequelize");

const postSchema = Joi.object({
  email: Joi.string().required(),
  content: Joi.string().required(),
  image: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    let offset = 0;
    const limit = 5;
    const pageNum = req.query.page;

    if (pageNum > 1) {
      offset = limit * (pageNum - 1); //5 10
    }

    const posts = await Post.findAll({
      order: [["createdAt", "desc"]],
      offset: offset,
      limit: limit,
    });
    if (!posts.length) {
      return res.status(200).json({ message: "게시글이 없습니다." });
    }
    const postsData = posts.map((post) => ({
      postId: post.postId,
      email: post.email,
      content: post.content,
      image: post.image,
      likeCount: post.likeCount,
    }));

    res.status(200).json({ data: postsData });
  } catch (error) {
    next(error);
  }
});

//게시글 작성 삭제 수정 조회(프로필), 나중에 미들웨어 추가해야함 +게시글 수정 작성 할때 숙련주차처럼 body검사 자세히 해야되는지

//일단 게시글 작성은 형식이 req.body가 validate, verify등을 통과했는 지 검사를 한다
//하는 이유 일단 게시글을 작성하는 거니  무조건 존재해야 된다. 실제로 존재하냐 정도의 테스트를 한다고 보면 될듯?
router.post("/", async (req, res, next) => {
  try {
    const resultSchema = postSchema.validate(req.body);

    if (resultSchema.error) {
      throw boom.badRequest("데이터 형식이 올바르지 않습니다.");
    }

    const { content, image, email } = resultSchema.value;
    console.log(content, image, email);

    await Post.create({ content, email, image });

    return res
      .status(201)
      .json({ success: true, message: "포스팅에 성공했습니다." });
  } catch (error) {
    next(error);
  }
});

//게시글 삭제
//일단 해당 postId를 가진 게시글이 존재하는 지 보고 있으면 삭제하면 되는거 아닌가?
//근데 로그인한 유저id가 해당 postid랑 같아야 하니 userId도 필요하다
router.delete("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByPk(postId);
    const email = "never@naver.com";

    if (!post) {
      throw boom.notFound("해당 게시글이 존재하지 않습니다");
    }

    const count = await Post.destroy({ where: { postId, email } }); // postId와 userId(email)가 일치하면 삭제한다

    if (count < 1) {
      throw boom.notFound("게시글이 정상적으로 삭제되지 않았습니다.");
    }

    // return res.status(200).json({ message: "게시글을 삭제했습니다." });
    //게시글 삭제후 전체조회

    const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
    const postsData = posts.map((post) => ({
      postId: post.postId,
      email: post.email,
      content: post.content,
      image: post.image,
    }));

    return res.status(200).json({ data: postsData });
  } catch (error) {
    next(error);
  }
});

//프로필
//상세조회랑 크게 다를 건 없지않나?
//userId랑 postId 같은지 보고 같으면 게시글 전체 조회마냥 쓴 글 다 출력해주기 하면될듯
//근데 경로가 profile이라 걍 userId로 userId가 db에 존재하면 게시글 전체 보여주기가 나을듯
//그럼 findAll( where: ~~~ userId ) 이렇게 하면 될까?
//아니면 걍 findOne으로 하나씩 찾고 그걸 map같은거 돌려도 될듯
router.get("/profile", async (req, res, next) => {
  try {
    const email = "never@naver.com";
    const myPosts = await Post.findAll({
      where: {
        [Op.and]: [{ email }], //게시글 중에 userId인걸 다 찾는다
      },
      order: [["createdAt", "desc"]],
    });

    const myPostsData = myPosts.map((post) => ({
      postId: post.postId,
      email: post.email,
      content: post.content,
      image: post.image,
      likeCount: post.likeCount,
    }));

    return res.status(200).json({
      data: myPostsData,
      // data : {
      //   ...post, //배열이 아닌 상태로 반환
      // },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
