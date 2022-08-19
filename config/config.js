require("dotenv").config();
module.exports = {
  development: {
    username: process.env.SEQUELIZE_USER_DEV,
    password: process.env.SEQUELIZE_PW_DEV,
    database: process.env.SEQUELIZE_DB_DEV,
    host: process.env.SEQUELIZE_HOST_DEV,
    dialect: "mysql",
  },
  test: {
    username: process.env.SEQUELIZE_USER_TEST,
    password: process.env.SEQUELIZE_PW_TEST,
    database: process.env.SEQUELIZE_DB_TEST,
    host: process.env.SEQUELIZE_HOST_TEST,
    dialect: "mysql",
  },
  production: {
    username: process.env.SEQUELIZE_USER_PD,
    password: process.env.SEQUELIZE_PW_PD,
    database: process.env.SEQUELIZE_DB_PD,
    host: process.env.SEQUELIZE_HOST_PD,
    dialect: "mysql",
  },
};
