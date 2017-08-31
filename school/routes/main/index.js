
// 智慧健康校园项目
//校园管理
let schoolMng = require('./routes/schoolMng/');     //年级管理
let grade = require('./routes/grade/');             //年级管理
let classroom = require('./routes/classroom/');     //教室管理
let team = require('./routes/team/');               //班级管理
let teacher = require('./routes/teacher/');         //教师管理
let student = require('./routes/student/');         //学生管理
// let graduation = require('./routes/graduation/');   //毕业管理

let sleepActivity = require('./routes/sleepActivity/') ; //H5活动管理——睡眠

//设备管理
let devManage = require('./routes/devManage/');     //设备管理---设备管理
// let devRecBin = require('./routes/devRecBin/');  //设备管理---设备管理回收站
let devRecycleBin = require('./routes/devRecycleBin/'); //设备管理---设备管理回收站
let devDataView = require("./routes/devDataView/")  //设备数据查看
// let devTypeManage = require('./routes/devTypeManage/') ; //设备大类管理——开放平台


//健康统计报表
let dailyReport = require('./routes/dailyReport/');   //日报表
let exceptionCount = require('./routes/exceptionCount/');   //异常数据


//学生健康报表
let report = require('./routes/report/'); //报表汇总——学生健康报表管理
let bmi = require('./routes/bmi/'); //身高体重BMI——学生健康报表管理
// let sgbmi = require('./routes/sgbmi/'); //身高体重BMI——学生健康报表管理
// let bmi2 = require('./routes/bmi2/'); //身高体重BMI——学生健康报表管理

let temperature = require('./routes/temperature/'); //体温——学生健康报表管理
let stepcount = require('./routes/stepcount/'); //步数——学生健康报表管理
let heartrate = require('./routes/heartrate/'); //心率——学生健康报表管理
let vision = require('./routes/vision/'); //心率——学生健康报表管理


// let homePage = require('./routes/homePage/');

// let classroom2 = require('./routes/classroom2/'); //身高体重BMI——学生健康报表管理
// let report2 = require('./routes/report2/'); //报表汇总——学生健康报表管理
// let deviceType = require('./routes/deviceType/'); //马叔叔
// let users = require('./routes/users/'); //马叔叔





module.exports = {
    path: 'main',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/Main'));
        });
    },
    getChildRoutes(partialNextState, cb) {
        require.ensure([], (require) => {
          // cb(null, [
          //   info, message, proLink, help, maintain, cookbook, integral, brand, advert, media, label, clientstat, users, device, deviceType, deviceStat, service, feedback, account, character, editPassword, sleepActivity, envelop, graphic, medal, devTypeManage, devSubTypeManage, funcTemp, waterEcology, filter, pure, recommend, grade, classroom, team, teacher, student, report, bmi, temperature, stepcount, heartrate, vision
          // ]);
          cb(null, [
            schoolMng,grade,classroom,team,teacher,student,sleepActivity,devManage,devRecycleBin,devDataView,dailyReport,exceptionCount,report,bmi,temperature,stepcount,heartrate,vision
          ]);
        });       
    }
};
