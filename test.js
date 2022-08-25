const logger = require("./config/logger");

logger.info("hello world");
logger.error("hello world");
logger.warn("hello world");
logger.debug("hello world");
logger.verbose("hello world");
logger.silly("hello world");
logger.info("naver fff : ", {message : "이건 어케 나오는겨?"});

