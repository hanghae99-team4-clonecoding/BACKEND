const express = require("express");
const app = express();
const { sequelize } = require("./models");
const cors = require("cors");
const router = require("./routes");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const { errorHandlerMiddleware } = require("./middlewares/errorHandler");
// const passportConfig = require("./passport");

require("dotenv").config(); // npm i dotenv
const port = process.env.PORT || 3000; //process.env는 내장 함수로 .env파일의 PORT란 변수를 불러와줌.

//cors 설정
const corsOption = {
  origin: true,
  credentials: true,
};

//db 생성 부분
sequelize
  .sync({ force: false }) //db reset할 일 있으면 true 변경
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

const requestMiddleWare = (req, res, next) => {
  console.log("request URL: ", req.originalUrl, " - ", new Date());
  next();
};

app.use(cors(corsOption));

if (process.env.NODE_ENV === "product") {
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleWare);
// passportConfig()
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "clonecoding",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use("/api", router);
app.use(passport.initialize()); // passport를 초기화 하기 위해서 passport.initialize 미들웨어 사용
app.use(passport.session());
app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
