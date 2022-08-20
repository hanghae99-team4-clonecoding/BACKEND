const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, password } });

    if (!user || bcrypt.compareSync(req.body.password, user.password)) {
      res.status(400).send({
        error: "이메일 또는 비밀번호가 일치하지 않습니다.",
      });
    }

    const token = jwt.sign({ userId: user.userId }, "clone4-secret-key");
    console.log(token, "토큰확인");

    res.status(200).json({ token, email, message: "로그인이 완료되었습니다." });
    console.log("로그인이 완료되었습니다.");
  } catch (error) {
    res.status(401).send({
      error: "로그인 후 사용하세요.",
    });
  }
});

module.exports = router;
