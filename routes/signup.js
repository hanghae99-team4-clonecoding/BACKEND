const User = require("../models/user");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

// 회원가입
router.post("/", async (req, res) => {
    const { email, password, passwordCheck } = req.body;
    //const User = new user();
    const regEmail = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]{2,6}$/;
    const regPassword = /^.{4,20}$/;
    if (!regEmail.test(email)) {
      return res
        .status(400)
        .send({ error: "이메일 양식에 맞지 않습니다." });
    }
    if (!regPassword.test(password)) { // || password.search(email) > -1
      return res
        .status(400)
        .send({ errorMessage: "비밀번호 양식이 맞지 않습니다." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .send({ errorMessage: "패스워드가 패스워드 확인란과 다릅니다." });
    }

    const existsUsers = await User.findAll({
        where: {
          [Op.or]: {email} ,
        },
      });
      if (existsUsers.length) {
        return res
          .status(400)
          .send({ errorMessage: "입력하신 이메일은 사용중입니다." });
      }
    
      await User.create({ email, password });
      res.status(201).send({message : "회원가입이 완료되었습니다."});
});

module.exports = router;
