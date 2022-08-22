const express = require("express");
const app = express();
const { sequelize } = require("./models");
const cors = require("cors");
const router = require("./routes");

require("dotenv").config(); // npm i dotenv
const port = process.env.PORT; //process.env는 내장 함수로 .env파일의 PORT란 변수를 불러와줌.

//cors 설정
const corsOption = {
  origin: true,
  credentials: true,
}

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
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleWare);
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
