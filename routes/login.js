const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { belongsToMany } = require("../models/user");
const boom = require("@hapi/boom");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw boom.badRequest("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const token = jwt.sign({ userId: user.userId }, SECRET_KEY);
    console.log(token, "토큰확인");

    res.status(200).json({ token, email, message: "로그인이 완료되었습니다." });
    console.log("로그인이 완료되었습니다.");
  } catch (error) {
    next(error);
    //   if(!error.isBoom){
    //     error = new Error("로그인 후 사용하세요.");
    //     error.httpStatusCode = 401;
    //     next(error);
    //   }
    //   else{
    //     next(error);
    //   }
  }
});

//카카오 로그인
const kakaoCallback = (req, res, next) => {
  try {
    passport.authenticate(
      "kakao",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) {
          throw boom.badRequest("카카오 로그인 실패");
        } //return next(err);

        const { userId, email } = user;
        const token = jwt.sign({ userId: user.userId }, SECRET_KEY);

        result = {
          userId,
          token,
          email,
        };
        res.send({ user: result });
      }
    )(req, res, next);
  } catch (error) {
    next(error);
    //res.status(400).send({error: "카카오 로그인 실패"});
  }
};

//로그인페이지로 이동
router.get("/auth/kakao", passport.authenticate("kakao"));
//카카오에서 설정한 redicrect url을 통해 요청 재전달
router.get("/auth/kakao/callback", kakaoCallback);

module.exports = router;
