# 2022.08.12 ~ 2022.08.18 미니프로젝트

## 주제
### > 프로젝트 이름 : 픽카(PickCar)
### > 프로젝트 설명 : 중고차 구매를 위한 고민 공유와 댓글을 통한 의견 공유 페이지
### > [미니프로젝트 6조 노션](https://www.notion.so/6-SA-005cfb64db044e4490e5d5e71796f272)
---
## 팀원 정보
![팀원정보](https://user-images.githubusercontent.com/107025988/188275925-033a77f6-f5dd-40ec-8ba1-cdd7aee815b5.png)

---
## Backend 기술 스택
- express
- mysql
- sequelize
- jsonwebtoken
---
## 구현 기능
### - 게시글 CRUD
### - 서버 배포 및 관리
### - 깃 레포지토리 관리
### - 추후 코드 정리

   - timestamp의 기준이 UTC 시간 기준으로 되어있는 점을 확인
     - config.json에 아래 코드 작성하여 한국시간 기준으로 변경 

```
   "timezone":"+09:00",            
    "dialectOptions":{
      "dateStrings":true,            
      "typeCast":true
    }
```
<br>

   - 댓글 조회 사용자 인증 삭제
      - 프론트 쪽에서 댓글 조회부분이 사용자 인증없이 사용 가능하도록 요청
      - routes/comment.js에서 댓글 조회 코드에서 사용자 미들웨어를 삭제 <br>-> 하지만, 서버가 여전히 사용자 인증이 필요하다고 동작하고 있었음.
      - 다시 확인해보니 routes/index.js에 작성한 경로에서 사용자 인증 미들웨어가 적용되어 있음을 확인하여 index에 적용해놓은 미들웨어를 삭제한 후, comment.js에 사용자 인증을 해야하는 곳에 사용자 인증 미들웨어를 작성하여 완성함.     
<br>

   - api에 작성한 에러메세지와 다르게 작성된 부분 메세지 통일하였음.

---
## 트러블슈팅
### - nickname 당 1개의 게시글과 댓글밖에 작성이 안됨.
- nickname unique문제
<br>->  user, post, comment 모두 models에서 nickname에 unique를 걸었더니 발생한 문제로 unique 삭제 후 테이블 삭제 후 재생성해서 테스트해보니 해결되었음.

<br>

### - 서버연결 후 포스트맨으로 데이터를 넣어봤지만, 오류 발생
- users 모델에 userId가 autoIncrement되어 있지 않았던 문제였던 것으로 판단하여 코드 수정 후 다시 서버 연결하여 확인해보니 해결되었음.

<br>

### - 서버 연결 오류 
- timestamps 기준 변경 후 서버 재연결을 위해 git bash 작동 중 config.json 파일 오류로 서버가 연결되지 않았음<br>-> config.json 파일 안에 들어갈 코드 미비로 연결이 되지않았고, vim config.json 안에 전체 코드 붙여넣은 후 서버가 잘 구동되었음.

<br>

### - 사용자 인증 미들웨어 오류
- 사용자 인증 미들웨어를 적용하지 않은 게시글, 댓글 조회 구현 시 '로그인 후 사용해주세요' 에러 발생
  - routes/index.js에 /posts 경로에 auth-middleware가 거치도록 진행한 상태에서, 게시글 조회 부분이 /posts로 진입하기 때문에 auth-middleware를 거치면서 발생된 문제.
  <br>->  routes/index.js에 /posts 경로에 auth-middleware를 제거하고 routes/post.js에 인증 미들웨어를 거쳐야 하는 부분에만 auth-middleware를 거치도록 수정하여 해결되었음.
