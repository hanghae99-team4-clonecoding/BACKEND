const logger = require("../config/logger")

exports.logging = (req, res, next) =>{
    const logStr = {};
    // try{
        logStr.url=req.originalUrl;
        logStr.method= req.method;
        console.log(res.status)
        console.log(res.body)
        if(res.status>=400){
            logStr.errorMessage = res.body;
            logger.error(JSON.stringify(logStr));
        }
        else{
            logger.info(JSON.stringify(logStr));
        }
    
    next();
    // }
    // catch(err){
    //     logger.error(JSON.stringify(err));
    //     res.status(500).send({
    //         error: err,
    //       });
    // }
}