exports.errorHandlerMiddleware = (err, req, res, next) => {
    if(!err.isBoom){
        return res.status(500).json({error : "예상치 못한 에러가 발생했습니다."});
    }
    return res.status(err.output.statusCode).json({error : err.output.payload.message});
}