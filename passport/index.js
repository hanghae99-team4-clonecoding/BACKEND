const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models");
const google = require('./google');
const kakao = require('./kakao');
require("dotenv").config();

module.exports = () => {
  //로그인시에만 실행됨.
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  //매 요청 시 실행됨.
  passport.deserializeUser((user, done) => {
    done(null, user)
  });
  google();
  kakao();
};
