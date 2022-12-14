require("dotenv").config();
const passport = require("passport");
// const KakaoStrategy = require("passport-kakao").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

//구글 로그인
module.exports = () => {
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        console.log(accessToken, "구글 access토큰 확인");
        console.log(profile, "구글 프로필");
        try {
          const exUser = await User.findOne({
            snsId: profile.id,
            provider: "google",
          });
          // 이미 가입된 구글 프로필이면 성공
          if (exUser) {
            done(null, exUser);
          } else {
            const newUSer = await User.create({
              snsId: profile.id,
              nickname: profile.displayName,
              provider: "google",
              email: profile.emails[0].value,
            });
            done(null, newUSer);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
