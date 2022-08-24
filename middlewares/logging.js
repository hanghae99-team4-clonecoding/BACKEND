const logger = require("../config/logger");


exports.logging = (req, res, next) => {
    var logStr = {}
    try {
        // 접속 경로
        logStr.url = req.originalUrl;

        // 메소드
        logStr.method = req.method;

        // switch (req.method) {
        //     case 'GET':
        //         logStr.params = req.query;
        //         logStr.query = req.query;
        //         break;
        //     case 'POST':
        //         logStr.params = req.parmas;
        //         logStr.body = req.body;
        //         break;
        //     case 'PATCH':
        //         logStr.body = req.body;
        //         break;
        //     case 'DELETE':
        //         logStr.query = req.query;
        //         break;
        // }

        logger.info(JSON.stringify(logStr))

        next();
    }
    catch (Err) {
        logger.error(Err)
        res.send({ success: false });
    }
}



// const logger = require("../config/logger")

// exports.logging = (req, res, next) =>{
//     const logStr = {};
//     try{
//         logStr.url=req.originalUrl;
//         logStr.method= req.method;
//         if(res.status>=400){
//             logStr.errorMessage = res.body;
//             logger.error(JSON.stringify(logStr));
//         }
//         else{
//             logger.info(JSON.stringify(logStr));
//         }
    
//     next();
//     }
//     catch(err){
//         logger.error(JSON.stringify(err));
//         res.status(500).send({
//             error: err,
//           });
//     }
// }