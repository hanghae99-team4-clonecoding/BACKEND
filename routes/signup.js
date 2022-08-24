const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const boom = require("@hapi/boom");

// 회원가입
router.post("/", async (req, res, next) => {
  try {
    const { email, password, passwordCheck } = req.body;
    const regEmail = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]{2,6}$/;
    const regPassword = /^.{4,20}$/;
    if (!regEmail.test(email)) {
      throw boom.badRequest("이메일 양식에 맞지 않습니다.");
    }
    if (!regPassword.test(password)) {
      // || password.search(email) > -1
      throw boom.badRequest("비밀번호 양식이 맞지 않습니다.");
    }
    if (password !== passwordCheck) {
      throw boom.badRequest("패스워드가 패스워드 확인란과 다릅니다.");
    }

    const existsUsers = await User.findAll({
      where: {
        [Op.or]: { email },
      },
    });
    if (existsUsers.length) {
      throw boom.badRequest("입력하신 이메일은 사용중입니다.");
    }
    const userData = { email, password };
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    await User.create(userData);
    res.status(201).send({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
