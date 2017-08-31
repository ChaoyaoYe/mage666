/**
 * Created by ChaoyaoYe on 2017/8/31.
 */

const http = require('http');
const express = require('express');
const app = express();
const server  =   http.createServer(app);
      server.listen(8081);
const apiRouter = express.Router();
apiRouter.all('/campus/gradeManage/getGradeList',function (req, res){
        res.json({
            code: 0,
            data: {
                name:'111'
            }
        })
});
app.use('/mock',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
},apiRouter);
console.log('模拟数据成功');