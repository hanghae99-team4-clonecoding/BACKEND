const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization, "auth 확인");
  //공백기준으로 Bearer와 토큰을 나눔.
  const [authType, authToken] = (authorization || "").split(" ");

  //인증값이 Bearer로 시작하지 않으면 인증 실패
  if (authType !== "Bearer") {
    res.status(401).send({
      error: "로그인 후 사용하세요.",
    });
    return;
  }
  try {
    jwt.verify(authToken, "clone4-secret-key");

    //인증결과 에러 발생시 에러 메세지 전달
    async (error, decoded) => {
      if (error) {
        res.status(401).send({
          error: "이용에 문제가 있습니다.",
        });
        return;
      }

      let user = await User.findOne({ where: { userId: decoded.userId } });
      res.locals.user = user;
    };
  } catch (error) {
    res.status(401).send({
      error: "로그인 후 사용하세요.",
    });
    return;
  }
};
