const logger = require("../config/logger")
exports.errorHandlerMiddleware = (err, req, res, next) => {
    if(!err.isBoom){
        logger.error("예상치 못한 에러");
        return res.status(500).json({error : "예상치 못한 에러가 발생했습니다."});
    }
    logger.error(err.output.payload.message);
    return res.status(err.output.statusCode).json({error : err.output.payload.message});
}