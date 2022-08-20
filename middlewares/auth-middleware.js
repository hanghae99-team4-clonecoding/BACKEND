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
    const decoded = jwt.verify(authToken, "clone4-secret-key");

    User.findOne({ where: { userId: decoded.userId } }).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).send({
      error: "로그인 후 사용하세요.",
    });
    return;
  }
};
