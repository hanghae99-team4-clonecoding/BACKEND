const express = require("express");
const router = express.Router();
const { Post } = require("../models");

const Joi = require("joi");
const { Op } = require("sequelize");

const postSchema = Joi.object({
  email: Joi.string().required(),
  content: Joi.string().required(),
  image: Joi.string().required(),
});

//게시글 작성 삭제 수정 조회(프로필), 나중에 미들웨어 추가해야함 +게시글 수정 작성 할때 숙련주차처럼 body검사 자세히 해야되는지

router.get("/", async (req, res) => {
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
    }));

    res.status(200).json({ data: postsData });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "정상적으로 게시글을 출력할 수 없습니다." });
  }
});

//일단 게시글 작성은 형식이 req.body가 validate, verify등을 통과했는 지 검사를 한다
//하는 이유 일단 게시글을 작성하는 거니  무조건 존재해야 된다. 실제로 존재하냐 정도의 테스트를 한다고 보면 될듯?
router.post("/", async (req, res) => {
  try {
    const resultSchema = postSchema.validate(req.body);

    if (resultSchema.error) {
      return res.status(400).json({
        error: "데이터 형식이 올바르지 않습니다.",
      });
    }

    const { content, image, email } = resultSchema.value;
    console.log(content, image, email);

    await Post.create({ content, email, image });

    return res
      .status(201)
      .json({ success: true, message: "포스팅에 성공했습니다." });
  } catch (error) {
    console.log(content, image, email);

    return res.status(400).json({ error: "게시글 작성에 실패했습니다." });
  }
});

//게시글 삭제
//일단 해당 postId를 가진 게시글이 존재하는 지 보고 있으면 삭제하면 되는거 아닌가?
//근데 로그인한 유저id가 해당 postid랑 같아야 하니 userId도 필요하다
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByPk(postId);
    const user = res.locals.user;

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "해당 게시글이 존재하지 않습니다" });
    }

    const count = await Post.destroy({ where: { postId, email: user.email } }); // postId와 userId(email)가 일치하면 삭제한다

    if (count < 1) {
      return res.status({
        error: "게시글이 정상적으로 삭제되지 않았습니다.",
      });
    }

    // return res.status(200).json({ message: "게시글을 삭제했습니다." });
    //게시글 삭제후 전제조회

    const posts = await Post.findAll({ order: [["createdAt", "desc"]] });
    const postsData = posts.map((post) => ({
      postId: post.postId,
      email: post.email,
      content: post.content,
      image: post.image,
    }));
    return res.status(200).json({ data: postsData });
  } catch (error) {
    return res.status(401).json({
      error: "게시글 삭제에 실패했습니다.",
    });
  }
});

//게시글 수정
//삭제와 마찬가지로 userid와 postId가 같은지 확인하고
//다른 점은 req.body에 있는 거 받아와서 수정해 주는 거 정도일듯
// 근데 req.body가 joi를 거쳐 validate검사를 한다 => why? 게시글 수정하는 데 게시글이 잘못되면 안되니까 인듯
// 게시글 작성에도 해야 될듯하다 req.body에 validate..
router.put("/:postId", async (req, res) => {
  try {
    const resultSchema = postSchema.validate(req.body);
    if (resultSchema.error) {
      return res.status(412).json({
        errorMessagfe: "데이터 형식이 올바르지 않습니다.",
      });
    }

    const { postId } = req.params;
    const { userId } = req.locals.user;
    const { content } = resultSchema.value;

    const post = await Post.findOne({ where: { postId: postId } });

    if (!post) {
      return res.status(400).json({ error: "게시글이 존재하지 않습니다." });
    }

    const count = await Post.update({ content }, { where: { postId, userId } });

    if (count < 1) {
      return res
        .status(400)
        .json({ errorMessage: "게시글이 정상적으로 수정되지 않았습니다." });
    }

    return res.status(200).json({ message: "게시글을 수정했습니다." });
  } catch (error) {
    return res.status(400).json({ error: "게시글 수정에 실패했습니다." });
  }
});

//프로필
//상세조회랑 크게 다를 건 없지않나?
//userId랑 postId 같은지 보고 같으면 게시글 전체 조회마냥 쓴 글 다 출력해주기 하면될듯
//근데 경로가 profile이라 걍 userId로 userId가 db에 존재하면 게시글 전체 보여주기가 나을듯
//그럼 findAll( where: ~~~ userId ) 이렇게 하면 될까?
//아니면 걍 findOne으로 하나씩 찾고 그걸 map같은거 돌려도 될듯
router.get("/profile", async (req, res) => {
  try {
    const user = res.locals.user;
    const myPosts = await Post.findAll({
      where: {
        [Op.and]: [{ email: user.email }], //게시글 중에 userId인걸 다 찾는다
      },
      order: [["createdAt", "desc"]],
    });
    const myPostsData = myPosts.map((post) => ({
      postId: post.postId,
      email: post.email,
      content: post.content,
      image: post.image,
    }));

    return res.status(200).json({
      data: myPostsData,
      // data : {
      //   ...post, //배열이 아닌 상태로 반환
      // },
    });
  } catch (error) {
    return res.status(400).json({
      error: "프로필 조회에 실패하였습니다.",
    });
  }
});

module.exports = router;

//1.검색기능을 넣는다면?
//2.특정 게시물을 찾아서 보여준다
//3.특정 게시물은 Post에 있을테니 검색바가 있다면 그정보를 body로 가져와서
//4.그 정보가 Post안에 존재하는지 봐야겠지
//5. 어떻게? title이 없으니까 content내용이 비슷한 것들 ex) "김치찌개 맛있었다" "고기 맛있었다"면 맛있었다 "맛있었다 맜있었다! 맜있었다~"를 검색하면 3개가 뜨게 (마지막을 뜨게하는게 어렵다고 한다)
//기능자체는 크게는 어렵지는 않을거 같은데 5번이 예전에 잠깐 봤을때 뭔가 해야되는 게 많아서 알아봐야할듯
//아니면 query를 이용해서 query=검색값 해서 검색값가져와서 하는 방법도 있을 듯
router.post("/search", async (req, res) => {
  const search = req.body.search; // 검색한 내용을 가져온다 일단 req.body에서 가져온다 치자
  const data = await Post.findAll({
    where: { content: search },
  });

  return res.status(200).json({ data: data }); // 일단 여기까지가 생각한 4번까지

  //찾아보니까 db마다 search index를쓰는 방법이 다르다고 한다...
});

//query string 써보기
//?데이터이름=데이터값 형태
//전제 조건: 프론트에서 button으로 검색정보를 주고, js문법으로
//버튼클릭하면 window.location.replace('/seqrch?value=값')을 준다고 치면 req.querystring.value ?로 가져오면 끝
//검색기능 자체는 쉬운듯근데 5번을  구현하는 게 어려운게 아닌가 싶다
