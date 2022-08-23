const { DATE } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      // super는 부모를 가리킴, 여기선 Sequelize.Model
      {
        likeId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
      },
      {
        sequelize,
        timestamps: true, // true로 해놓으면 createdAt, updatedAt 자동추가
        underscored: false, // true면 created_At  // false면 createdAt
        modelName: "Like", // sequelize의 모델 이름
        tableName: "likes", // mysql의 테이블 이름
        paranoid: false, // true면 삭제 날짜 기록 (e.g.회원탈퇴 후 1년간 보관한다는 약정 있는 경우 사용)
        charset: "utf8", // 언어셋  // utf8 해줘야 한글 사용 가능  // utf8mb4는 이모티콘까지 가능
        collate: "utf8_general_ci", // utf8_general_ci  // utf8mb4_general_ci
      }
    );
  }

  static associate(db) {
    // 관계 설정
    db.Like.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
      onDelete: "CASCADE",
    });
    db.Like.belongsTo(db.Post, {
        foreignKey: "postId",
        targetKey: "postId",
        onDelete: "CASCADE",
    });
  }
};
