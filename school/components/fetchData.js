// 应用业务逻辑和数据状态（model）
import reqwest from 'reqwest';
import Qs from 'qs';
import Reflux from 'reflux';
import Tools from './tools';

import _isPlainObject from 'lodash.isplainobject';



let Actions = Reflux.createActions(['login','logOut','uploadFile','getAccountAndResource','getDeveloperList','getBrandList','getCityList','getCityList1','getUserList',
    'getUserPictureStatis','getDeviceUserNumStatisRate','getSubType','getProductLists','getAdvList','getTestJson','updateDeviceErrorProtocol','getOneProductDeviceStat',
    'getDeviceErrorProtocolList','getDeviceOrderTypeList','getProtoConfig','addOrderConfig','updateOrderConfig','getDeviceOrderConfigList','getProtoConfig','orderConfigOpe',
    'getProductDeviceStat','getDevSubTypeList','addDevSubType','updateDevSubType','deleteDevSubtype','getDevSubType','getDeviceNo','getTaskList','getIntegralRuleList',
    'integralRuleOpe','getIntegralRule','getGoodsList','getMallPro','getIntegralRule','getGoodsList','editMall','getExchageRecordList','cancelTrade','updateTradeInfo',
    'getCityList1','getNewDeviceProportion','getNewDeviceList','getProductDeviceList','getNewDeviceStat','getAddUserStatisList','getAbnormalDeodorantDeviceErrorData',
    'getDeodorantDeviceCurveDataList','getAbnormalDeodorantDeviceDataList','getDevicePostitionList','getWaterPurifierDeviceErrorData','getWaterPurifierDeviceCurveDataList',
    'getWaterPurifierDeviceDataList','getWaterPurifierDeviceDataList2','getFreshAirDeviceErrorData','getFreshAirDeviceCurveDataList','getFreshAirDeviceDataList',
    'exportDeodorantData','exportWaterPurifierData','exportFreshAirData','getDeviceDataList','insertOrUpdateDeviceData','getDeviceDataByNo','getDeviceDataByNo2',
    'getDevTest','getDevTypeList','addDevType','updateDevType','deleteDevType','getDevType','getClassRoomList','getdataStatisLatest','getUserPictureStatis',
    'getDeviceUserNumStatisRate','getDetailByDate','getUserInfo','getUserServeList','getUserServeDetail','addVisitReturn','getFeedBackList','getProvince','getCity',
    'getArea','getActivityList','addActivity','editActivity','updateActivity','addSchool','getSchoolNo','getGradeId','insertOrUpdateGradeData','getGradeById',
    'getGradeDataList','getClassDataList','getClassById','insertOrUpdateClassData','getClassId','getclassRoomId','insertOrUpdateClassRoomData','getClassRoomById','getClassRoomDataList',
    'getGradeList','getTeacherList','classGradute','getSchoolData','updateSchoolData','getSchoolList','getSchoolData2','insertOrUpdateTeacherData','getTeacherById','getTeacherDataList','importTeacehr',
    'getClassGradeList','getStudentReportList','getAbnormalReportList','getStudentDataList','insertOruUpdateStudent','getStudentDataByStudentId','getClassListByGradeId','getStudentBmiDataList',
    'getStudentTemperatureDataList','getStudentStepsOfNumDataList','getStudentHeartRateDataList','getStudentVisionDataList','updateStudentVersionByStudentId','insertBatchStudentVersion',
    'exportStudentDataListByType','importStuVision','getStudenSleepDataList','getHealthReportSummary','updateVisionById','insertBatchStudentVision','downloadVisionModel','getStudentList',
    'getPacketDetail','importStudent','downloadExportModel','getClassListByGradeIdTwo','getClassRoomByClassId']);




let Stores = {};

//请求数据公共方法
Reflux.StoreMethods.fetch = function(options){  
	let defaults = {
        url: '',
        method: 'get',           
        data: '',
        success: function(data){},
        fail: function(err,msg){},
        complete: function(res){},
        crossOrigin: false,
        headers: null,
        type: '',
        contentType: '', // eg:application/json  或 application/x-www-form-urlencoded
        jsonpCallback: ''  // eg: 'cb'
   	};  	
  	options = Object.assign({},defaults,options);
    options.data = Object.assign({_k: new Date().getTime()},options.data);
  	let params = Tools.filterParam({
  		url: options.url,
        method: options.method,           
        data: options.data,
        headers: options.headers,
        type: options.type,  // html, xml, json, or jsonp
        contentType: options.contentType,
        crossOrigin: options.crossOrigin,
        jsonpCallback: options.jsonpCallback
  	});
	let r = reqwest(params).then((data)=>{
		if(Tools.isString(data)){
            data = JSON.parse(data);
        }
        if(Tools.isFunction(options.success)){
            options.success(data);
        }
	}).fail((xhr)=>{
    	if(Tools.isFunction(options.fail)){
            options.fail(xhr);
        }
  	}).always((res)=>{
	    if(Tools.isFunction(options.complete)){
            options.complete(res);
        }
	});   

    return r;
};

function createStore(actionName,apiName,method,isTriggerFail){
    let store;
    let requestMethod = method || 'get';
    let opts = {
        listenables: Actions
    };
    let url = '';
    if(/^\/mock/.test(apiName)){
        url = apiName;
    }else{
        url = Tools.domainName + apiName;
    }
    opts['on'+ actionName] = (model,other)=>{
        store.fetch({
            url: url,
            method: method,
            data: model,
            success: (data)=>{
                store.trigger(data,other);
            },
            fail: (xhr)=>{
                if(Tools.isBoolean(isTriggerFail) && isTriggerFail){
                    if(xhr.response.charAt(0) == '{' && xhr.response.charAt(xhr.response.length-1) == '}'){
                        store.trigger(JSON.parse(xhr.response));
                    }else{
                        store.trigger({code: null, msg: xhr.status+' '+xhr.statusText});
                    }
                }
            }
        });
    };

    store = Reflux.createStore(opts);

    return store;
}

// 登录
// Stores.loginStore = createStore('Login','/manage/common/admin/loginCheck','post',true);

Stores.loginStore = createStore('Login','/campus/common/admin/loginCheck','post',true);

// 退出登录
// Stores.logOutStore = createStore('LogOut','/manage/common/admin/logout');

Stores.logOutStore = createStore('LogOut','/campus/common/admin/logout');


//获取当前用户和权限信息
// Stores.getAccountAndResource = createStore('GetAccountAndResource','/manage/auth/account/getSessionAccount',null,true);

Stores.getAccountAndResource = createStore('GetAccountAndResource','/campus/system/account/getSessionAccount',null,true);




// 图片上传
Stores.uploadFile = Reflux.createStore({  
    listenables: Actions,
    onUploadFile (model,formObj,type,index) { 
        console.log("why",model,formObj,type,index);
        $(formObj).ajaxSubmit({
            url: Tools.domainName + '/manage/common/file/upload',
            type:'post',
            dataType:'json',
            // data: model,
            success: (responseText,statusText)=>{  //成功后回调
                if(statusText == 'success'){
                    this.trigger(responseText,type,index);
                }
            },
            error: (event,errorText,errorType)=>{  //错误时调用

                this.trigger(event.responseJSON);
            },
            timeout:30000   
        });
    }
});

// Stores.getTestJson = createStore('GetAdvList','../routes/test.json');
Stores.getTestJson = Reflux.createStore({  
    listenables: Actions,
    onGetTestJson (model,formObj,type,index) { 
          
            console.log("123111111111111");
            $.ajax({
                url: Tools.domainName + '/manage/common/file/getTestJson',
                type:'get',
                dataType:'json',
                success:(data)=>{
                    console.log('成功');
                },
                error:(errorData)=>{
                    console.log('失败');
                   
                    this.trigger(  {
    "code":0,
    "data":{
        "pager": {
            "totalRows": 1,
            "pageRows": 10,
            "pageIndex": 1,
            "paged": false,
            "defaultPageRows": 20,
            "totalPages": 1,
            "currPageRows": 1,
            "pageStartRow": 0,
            "pageEndRow": 9,
            "hasPrevPage": false,
            "hasNextPage": false
        },
        "list" : [{
            "studentId" : "001",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰是个帅哥",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "002",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰是个",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "003",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰很丑",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "004",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰很渣",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "005",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰很有爱",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "006",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰很和善",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "007",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰欧耶",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "008",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰Yellow",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "009",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰Yellow",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "010",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰Yellow",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           },{
            "studentId" : "011",            
            "createDate" : "2017-05-02",  
            "dataTime" : "16：09：01",  
            "studentName" : "邓志杰Yellow",  
            "gradeName" : "一年级",  
            "className" : "一班",   
            "sex" : "男",           
            "age" : "19",            
            "height" : "180",         
            "weight" : "56.9",      
            "bmi" : "15"           
           }
       ]
    }
})
                }
            })
    }
});



//设备管理 
//设备管理---获取设备列表 ---campus/deviceManage/getDeviceDataList
Stores.getDeviceDataList = createStore('GetDeviceDataList','/campus/deviceManage/getDeviceDataList');

//设备管理---获取设备编号  campus/deviceManage/getDeviceNo
Stores.getDeviceNo = createStore('GetDeviceNo','/campus/deviceManage/getDeviceNo');

//设备管理---添加设备和编辑设备  campus/deviceManage/insertOrUpdateDeviceData
Stores.insertOrUpdateDeviceData = createStore('InsertOrUpdateDeviceData','/campus/deviceManage/insertOrUpdateDeviceData');

//设备管理---获取设备信息 campus/deviceManage/getDeviceDataByNo
Stores.getDeviceDataByNo = createStore('GetDeviceDataByNo','/campus/deviceManage/getDeviceDataByNo');

Stores.getDeviceDataByNo2 = createStore('GetDeviceDataByNo2','/campus/deviceManage/getDeviceDataByNo');

// 教室管理---获取教室列表(不分页，供设备管理用)
Stores.getClassRoomList = createStore('GetClassRoomList','/campus/classRoomManage/getClassRoomList');




Stores.getDevTest = Reflux.createStore({  
    listenables: Actions,
    onGetDevTest (model,formObj,type,index) { 
            
            console.log("模拟-getDevTest-接口");
            $.ajax({
                url: Tools.domainName + '/manage/common/file/getDevTest',
                type:'get',
                dataType:'json',
                success:(data)=>{
                    console.log('成功');
                },
                error:(errorData)=>{
                    console.log('失败');
                   this.trigger({

    "code":0,
    "data":{
            "pager": {
            "totalRows": 1,
            "pageRows": 10,
            "pageIndex": 1,
            "paged": false,
            "defaultPageRows": 20,
            "totalPages": 1,
            "currPageRows": 1,
            "pageStartRow": 0,
            "pageEndRow": 9,
            "hasPrevPage": false,
            "hasNextPage": false
        },
        "list" : [ {
            "deviceNo":"001",    
            "deviceName" : "新风系统",  //设备名称 
            "classRoomId"  : "001",   //教室名称（放置位置）
            "deviceMac" : "xxxxx",  //设备mac 
            "deviceType":"2"         
            },{
            "deviceNo":"002",    
            "deviceName" : "除臭机",  //设备名称 
            "classRoomId"  : "B504",   //教室名称（放置位置）
            "deviceMac" : "xxxxx",  //设备mac
            "deviceType":"1"           
            },{
            "deviceNo":"003",    
            "deviceName" : "净饮机",  //设备名称 
            "classRoomId"  : "B504-2",   //教室名称（放置位置）
            "deviceMac" : "xxxxx",  //设备mac
            "deviceType":"3"           
            }
       ]
    }

                   })
            }
    
        })    
        }
});


//设备数据查看
// 获取设备位置列表-除臭机-新风系统-净饮机--三机合一
Stores.getDevicePostitionList = createStore('GetDevicePostitionList','/campus/deviceData/getDevicePostitionList');  

//除臭机
// 获取设备异常数据-除臭机
Stores.getAbnormalDeodorantDeviceErrorData = createStore('GetAbnormalDeodorantDeviceErrorData','/campus/deviceData/getAbnormalDeodorantDeviceErrorData');
// 除臭机--曲线
Stores.getDeodorantDeviceCurveDataList = createStore('GetDeodorantDeviceCurveDataList','/campus/deviceData/getDeodorantDeviceCurveDataList');
// 分页获取设备数据（10分钟一条）-除臭机
Stores.getAbnormalDeodorantDeviceDataList = createStore('GetAbnormalDeodorantDeviceDataList','/campus/deviceData/getAbnormalDeodorantDeviceDataList');
// 数据导出-除臭机
Stores.exportDeodorantData = createStore('ExportDeodorantData','/campus/deviceData/exportDeodorantData');


//净饮机
// 获取设备异常数据-净饮机
Stores.getWaterPurifierDeviceErrorData = createStore('GetWaterPurifierDeviceErrorData','/campus/deviceData/getWaterPurifierDeviceErrorData');
// 净饮机--曲线
Stores.getWaterPurifierDeviceCurveDataList = createStore('GetWaterPurifierDeviceCurveDataList','/campus/deviceData/getWaterPurifierDeviceCurveDataList');
// 分页获取设备数据（10分钟一条）-净饮机
Stores.getWaterPurifierDeviceDataList = createStore('GetWaterPurifierDeviceDataList','/campus/deviceData/getWaterPurifierDeviceDataList');
// 数据导出-净饮机
Stores.exportWaterPurifierData = createStore('ExportWaterPurifierData','/campus/deviceData/exportWaterPurifierData');


//新风系统
// 获取设备异常数据-新风系统
Stores.getFreshAirDeviceErrorData = createStore('GetFreshAirDeviceErrorData','/campus/deviceData/getFreshAirDeviceErrorData');
// 新风--曲线
Stores.getFreshAirDeviceCurveDataList = createStore('GetFreshAirDeviceCurveDataList','/campus/deviceData/getFreshAirDeviceCurveDataList');
// 分页获取设备数据（10分钟一条）-新风机
Stores.getFreshAirDeviceDataList = createStore('GetFreshAirDeviceDataList','/campus/deviceData/getFreshAirDeviceDataList');
// 数据导出-新风机
Stores.exportFreshAirData = createStore('ExportFreshAirData','/campus/deviceData/exportFreshAirData');




//校园管理
// 学校管理


Stores.getSchoolData = createStore('GetSchoolData', '/campus/schoolManage/getSchoolData');  //获取校园信息
Stores.getSchoolData2 = createStore('GetSchoolData2', '/campus/schoolManage/getSchoolData');  //获取校园信息

Stores.updateSchoolData = createStore('UpdateSchoolData', '/campus/schoolManage/updateSchoolData');  //学校信息的更新
Stores.getSchoolList = createStore('GetSchoolList', '/campus/schoolManage/getSchoolList');  //学校列表的查询



Stores.getProvince = createStore('GetProvince', '/env/provincialCascade/province');  //省份
Stores.getCity = createStore('GetCity', '/env/provincialCascade/city');      //城市
Stores.getArea = createStore('GetArea', '/env/provincialCascade/area');      //区域
Stores.addSchool = createStore('AddSchool', '/campus/schoolManage/addSchool');      //学校的添加
Stores.getSchoolNo = createStore('GetSchoolNo', '/campus/schoolManage/getSchoolNo');    //获取校园编号

//年级管理
Stores.getGradeDataList = createStore('GetGradeDataList', '/campus/gradeManage/getGradeDataList');  //年级管理---分页获取年级列表
Stores.getGradeById = createStore('GetGradeById', '/campus/gradeManage/getGradeById');              //获取年级信息
Stores.insertOrUpdateGradeData = createStore('InsertOrUpdateGradeData', '/campus/gradeManage/insertOrUpdateGradeData');  //年级管理---添加或者更新年级
Stores.getGradeId = createStore('GetGradeId', '/campus/gradeManage/getGradeId');                    //年级管理---获取年级编号
Stores.getGradeList = createStore('GetGradeList', '/mock/campus/gradeManage/getGradeList');   //年级管理---获取年级列表(不分页)


//教室管理
Stores.getClassRoomDataList = createStore('GetClassRoomDataList', '/campus/classRoomManage/getClassRoomDataList');  //年级管理---分页获取年级列表
Stores.getClassRoomById = createStore('GetClassRoomById', '/campus/classRoomManage/getClassRoomById');              //获取年级信息
Stores.insertOrUpdateClassRoomData = createStore('InsertOrUpdateClassRoomData', '/campus/classRoomManage/insertOrUpdateClassRoomData');  //班级管理---添加或者更新班级
Stores.getclassRoomId = createStore('GetclassRoomId', '/mock/campus/classRoomManage/getclassRoomId');                    //班级管理---获取班级编号



//班级管理 
Stores.getClassDataList = createStore('GetClassDataList', '/campus/classManage/getClassDataList');  //年级管理---分页获取年级列表
Stores.getClassById = createStore('GetClassById', '/campus/classManage/getClassById');              //获取年级信息
Stores.insertOrUpdateClassData = createStore('InsertOrUpdateClassData', '/campus/classManage/insertOrUpdateClassData');  //班级管理---添加或者更新班级
Stores.getClassId = createStore('GetClassId', '/campus/classManage/getClassId');                    //班级管理---获取班级编号
Stores.classGradute = createStore('ClassGradute', '/campus/classManage/classGradute');                    //班级管理---获取班级编号
Stores.getClassRoomByClassId = createStore('GetClassRoomByClassId', '/campus/classRoomManage/getClassRoomByClassId');       //教室管理---获取教室列表(获取未匹配班级的教室列表)




//教师管理
Stores.getTeacherList = createStore('GetTeacherList', '/campus/teacherManage/getTeacherList');             //获取教师列表（不分页）
Stores.insertOrUpdateTeacherData = createStore('InsertOrUpdateTeacherData', '/campus/teacherManage/insertOrUpdateTeacherData');       // 添加或者更新教师信息
Stores.getTeacherById = createStore('GetTeacherById', '/campus/teacherManage/getTeacherById');             //根据教师Id获取教室信息
Stores.getTeacherDataList = createStore('GetTeacherDataList', '/campus/teacherManage/getTeacherDataList');             //获取教师列表

// Stores.importTeacehr = createStore('ImportTeacehr', '/v1/web/campus/teacherManage/importTeacehr');             //教师信息的导入


//学生管理
Stores.getStudentDataList = createStore('GetStudentDataList', '/campus/studentManage/getStudentDataList');             //获取学生列表
Stores.insertOruUpdateStudent = createStore('InsertOruUpdateStudent', '/campus/studentManage/insertOruUpdateStudent');             //添加或者修改学生信息
Stores.getStudentDataByStudentId = createStore('GetStudentDataByStudentId', '/campus/studentManage/getStudentDataByStudentId');    //获取学生信息
Stores.downloadExportModel = createStore('DownloadExportModel', '/campus/studentManage/downloadExportModel');    //学生导入模板的下载



//健康统计报表

Stores.getStudentReportList = createStore('GetStudentReportList', '/campus/studentHealthReport/getStudentReportList');             //分页获取学生健康日报表
Stores.getAbnormalReportList = createStore('GetAbnormalReportList', '/campus/studentHealthReport/getAbnormalReportList');             //分页获取异常统计报表
Stores.getClassListByGradeId = createStore('GetClassListByGradeId', '/campus/classManage/getClassListByGradeId');             //根据年级获取班级列表
Stores.getClassListByGradeIdTwo = createStore('GetClassListByGradeIdTwo', '/campus/classManage/getClassListByGradeId');             //根据年级获取班级列表

//学生健康报表

Stores.getStudentBmiDataList = createStore('GetStudentBmiDataList', '/campus/studentHealthReport/getStudentBmiDataList');  //分页获取学生身高体重BMI信息列表
Stores.getStudentTemperatureDataList = createStore('GetStudentTemperatureDataList', '/campus/studentHealthReport/getStudentTemperatureDataList');  //分页获取学生体温信息列表
Stores.getStudentStepsOfNumDataList = createStore('GetStudentStepsOfNumDataList', '/campus/studentHealthReport/getStudentStepsOfNumDataList');  //分页获取学生步数信息列表
Stores.getStudentHeartRateDataList = createStore('GetStudentHeartRateDataList', '/campus/studentHealthReport/getStudentHeartRateDataList'); //分页获取学生心率信息列表

Stores.getStudentVisionDataList = createStore('GetStudentVisionDataList', '/campus/studentHealthReport/getStudentVisionDataList');  //分页获取学生视力信息列表
Stores.updateStudentVersionByStudentId = createStore('UpdateStudentVersionByStudentId', '/campus/studentManage/updateStudentVersionByStudentId');  //修改学生视力信息
Stores.insertBatchStudentVersion = createStore('InsertBatchStudentVersion', '/campus/studentManage/insertBatchStudentVersion');  //批量添加学生视力信息
Stores.exportStudentDataListByType = createStore('ExportStudentDataListByType', '/campus/studentHealthReport/exportStudentDataListByType');  //导出学生信息列表
// Stores.importStuVision = createStore('ImportStuVision', '/campus/studentHealthReport/importStuVision');  //导入学生视力信息


Stores.updateVisionById = createStore('UpdateVisionById', '/campus/studentHealthReport/updateVisionById');  //修改学生视力信息
Stores.insertBatchStudentVision = createStore('InsertBatchStudentVision', '/campus/studentHealthReport/insertBatchStudentVision');  //批量添加学生视力信息
Stores.downloadVisionModel = createStore('DownloadVisionModel', '/campus/studentHealthReport/downloadVisionModel');  //下载导入模板
Stores.getStudentList = createStore('GetStudentList', '/campus/studentHealthReport/getStudentList');  //批量录入视力的获取学生分页接口



Stores.getStudenSleepDataList = createStore('GetStudenSleepDataList', '/campus/studentHealthReport/getStudenSleepDataList');  //分页获取学生睡眠信息列表
Stores.getHealthReportSummary = createStore('GetHealthReportSummary', '/campus/studentHealthReport/getHealthReportSummary');  //健康报表汇总

// 获取红包详情-----------------------
Stores.getPacketDetail = createStore('GetPacketDetail', '/csleep/cms/redPacket/getPacketDetail');






// Stores.getStudentTemperatureDataList = Reflux.createStore({  
//     listenables: Actions,
//     GetStudentTemperatureDataList (model,formObj,type,index) { 
            
//             console.log("模拟-getDevTest-接口");
//             $.ajax({
//                 url: Tools.domainName + '/getStudentTemperatureDataList',
//                 type:'get',
//                 dataType:'json',
//                 success:(data)=>{
//                     console.log('成功');
//                 },
//                 error:(errorData)=>{
//                     console.log('失败');
//                    this.trigger({

//     "code":0,
//     "data":{
//             "pager": {
//             "totalRows": 1,
//             "pageRows": 10,
//             "pageIndex": 1,
//             "paged": false,
//             "defaultPageRows": 20,
//             "totalPages": 1,
//             "currPageRows": 1,
//             "pageStartRow": 0,
//             "pageEndRow": 9,
//             "hasPrevPage": false,
//             "hasNextPage": false
//         },
//         "list" : [ {
//             "studentId" : "001",            //学生编号
//             "createDate" : "2017-05-02",   //测量日期
//             "dataTime" : "16：09：01",   //测量时间
//             "studentName" : "邓志杰",   //学生姓名
//             "gradeName" : "一年级",   //年级
//             "className" : "一班",   //班级
//             "sex" : "男",            //性别
//             "age" : "19",            //年龄              
//             "temperature" : "36.9",  //体温（℃）
//             "abnormal" : "0"         //是否异常（0-正常 1-异常）
//             }
//        ]
//     }

//                    })
//             }
    
//         })    
//         }
// });














//向服务器拉取数据（借助原生Promise），兼容IE9或以上（需添加Promise和fetch的兼容代码）
Reflux.StoreMethods.fetchData = function(url, options) {
    options = _isPlainObject(options) ? options : {};
    // let request;
    // let init = {
    // method: 'GET',
    // body: '',
    // mode: 'cors', // string，值： cors、same-origin、cors-with-forced-preflight、no-cors
    // headers: {}, // Object，key：Content-Type、Content-Length、X-Custom-Header、Accept-Encoding、Accept、Connection、User-Agent
    // credentials: 'include',  // string，值：omit、same-origin、include
    // cache: 'default',  // string，值：default、no-store、reload、no-cache、force-cache、only-if-cached
    // redirect: 'manual',  // string，值：manual、error、follow
    // referrer: 'no-referrer',  // string，值：no-referrer, client, or a URL
    // referrerPolicy: 'no-referrer',  // string，值：no-referrer-when-downgrade, origin, origin-when-cross-origin, unsafe-url
    // integrity: '',  // string，值：如sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=
    // signal: new FetchController().signal,
    // observe: (observer)=>{
    //     observer.onresponseprogress = (e)=> {
    //         console.log(e);
    //         progress.max = e.total;
    //         progress.value = e.loaded;
    //     };
    //     observer.onstatechange = ()=>{
    //         if (observer.state = 'complete') {
    //           reports.textContent = 'Download complete';
    //         }
    //     };
    // },
    // The following properties are node-fetch extensions------------
    // follow: 20,         // maximum redirect count. 0 to not follow redirect
    // timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
    // compress: true,     // support gzip/deflate content encoding. false to disable
    // size: 0,            // maximum response body size in bytes. 0 to disable
    // agent: null,         // http(s).Agent instance, allows custom proxy, certificate etc.
    // counter: 2
    // };

    // request = new Request(url, options);

    return fetch(url, options).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    }).then((response) => {
        switch (options.bodyType) {
            case 'json':
                return response.json();
                break;
            case 'text':
                return response.text();
                break;
            case 'buffer':
                return response.arrayBuffer();
                break;
            case 'blob':
                return response.blob();
                break;
            case 'form':
                return response.formData();
                break;
            default:
                return response.json();
        }
    });
};




//教师
Stores.importTeacehr = Reflux.createStore({     //excel文件上传
    listenables: Actions,
    onImportTeacehr(model, formObj, type, index) {

        console.log("model",model,formObj);

        if (window.FormData) {
            var formData = new FormData(formObj);
            this.fetchData(Tools.domainName + '/campus/teacherManage/importTeacehr', {
                method: 'post',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then((data) => {
                this.trigger(data, type, index);
            }).catch((response) => {
                // console.log(response);
                // this.trigger({code: null, msg: response.status+' '+response.statusText});
            });
        } else {
            $(formObj).ajaxSubmit({
                url: Tools.domainName + '/campus/teacherManage/importTeacehr',
                type: 'post',
                dataType: 'json',
                // data: model,
                success: (responseText, statusText) => { //成功后回调
                    if (statusText == 'success') {
                        // this.trigger(JSON.parse(responseText),type,index);
                        this.trigger(responseText, type, index);
                    }
                },
                error: (event, errorText, errorType) => { //错误时调用
                    // console.log(event);
                    // this.trigger({code: null, msg: errorType+' '+errorText});
                },
                timeout: 30000
            });
        }
    }

});

//视力
Stores.importStuVision = Reflux.createStore({     //excel文件上传
    listenables: Actions,
    onImportStuVision(model, formObj, type, index) {

        console.log("model",model,formObj);

        if (window.FormData) {
            var formData = new FormData(formObj);
            this.fetchData(Tools.domainName + '/campus/studentHealthReport/importStuVision', {
                method: 'post',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then((data) => {
                this.trigger(data, type, index);
            }).catch((response) => {
                // console.log(response);
                // this.trigger({code: null, msg: response.status+' '+response.statusText});
            });
        } else {
            $(formObj).ajaxSubmit({
                url: Tools.domainName + '/campus/studentHealthReport/importStuVision',
                type: 'post',
                dataType: 'json',
                // data: model,
                success: (responseText, statusText) => { //成功后回调
                    if (statusText == 'success') {
                        // this.trigger(JSON.parse(responseText),type,index);
                        this.trigger(responseText, type, index);
                    }
                },
                error: (event, errorText, errorType) => { //错误时调用
                    // console.log(event);
                    this.trigger({code: null, msg: errorType+' '+errorText});
                },
                timeout: 30000
            });
        }
    }

});

Stores.importStudent = Reflux.createStore({     //excel文件上传
    listenables: Actions,
    onImportStudent(model, formObj, type, index) {

        console.log("model",model,formObj,type,index);

        if (window.FormData) {
            var formData = new FormData(formObj);
            this.fetchData(Tools.domainName + '/campus/studentManage/importStudent?classId='+model.classId, {
                method: 'post',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then((data) => {
                console.log(data,type,index);
                this.trigger(data, type, index);
            }).catch((response,data) => {
                console.log(response,type,index);
                console.log("111111111",data)
                this.trigger({code: null, msg: response.status+' '+response.statusText});
            });
        } else {
            $(formObj).ajaxSubmit({
                url: Tools.domainName + '/campus/studentManage/importStudent',
                type: 'post',
                dataType: 'json',
                // data: model,
                success: (responseText, statusText) => { //成功后回调
                    if (statusText == 'success') {
                        // this.trigger(JSON.parse(responseText),type,index);
                        this.trigger(responseText, type, index);
                    }
                },
                error: (event, errorText, errorType) => { //错误时调用
                    // console.log(event);
                    // this.trigger({code: null, msg: errorType+' '+errorText});
                },
                timeout: 30000
            });
        }
    }

});



Stores.getClassGradeList = createStore('GetClassGradeList', '/campus/classManage/getClassGradeList');             //获取班级和年级列表（添加老师时专用）






// 获取活动列表
// Stores.getActivityList = createStore('GetActivityList', '/csleep/cms/activity/getActivityList');

// 添加活动
Stores.addActivity = createStore('AddActivity', '/csleep/cms/activity/addActivity', 'post');

// 编辑活动
Stores.editActivity = createStore('EditActivity', '/csleep/cms/activity/editActivity', 'post');
// 修改活动（发布，取消，删除）
Stores.updateActivity = createStore('UpdateActivity', '/csleep/cms/activity/updateActivity');



Stores.getActivityList123 = Reflux.createStore({  
    listenables: Actions,
    onGetActivityList (model,formObj,type,index) { 
            
            console.log("模拟-getDevTest-接口");
            $.ajax({
                url: Tools.domainName + '/manage/common/file/getActivityList123',
                type:'get',
                dataType:'json',
                success:(data)=>{
                    console.log('成功');
                },
                error:(errorData)=>{
                    console.log('失败');
                   this.trigger({

                        "code":[
                        {
                        "columnsName": "app_id",
                        "appId": 10001,
                        "appName": "微信公众号"
                        },
                        {
                        "columnsName": "app_id",
                        "appId": 10003,
                        "appName": "福特水杯"
                        },
                        {
                        "columnsName": "app_id",
                        "appId": 10007,
                        "appName": "海尔水盒子"
                        },
                        {
                        "columnsName": "app_id",
                        "appId": 10008,
                        "appName": "海尔水盒子"
                        }
                        ]

                   })
            }
    
        })    
        }
});










// 获取开发者厂商列表
Stores.getDeveloperList = createStore('GetDeveloperList','/manage/operate/manufacturer/getDeveloperList',null,true);

// 获取品牌列表
Stores.getBrandList = createStore('GetBrandList','/manage/operate/brand/getBrandList');

//获取城市（角色）
Stores.getCityList = createStore('GetCityList','/manage/auth/data/getCity');

// 用户画像统计
Stores.getUserPictureStatis = createStore('GetUserPictureStatis','/manage/user/getUserPictureStatis');

// 各硬件用户量占比
Stores.getDeviceUserNumStatisRate = createStore('GetDeviceUserNumStatisRate','/manage/user/getDeviceUserNumStatisRate');

//获取角色下产品小类
Stores.getSubType = createStore('GetSubType','/manage/auth/data/getSubType',null,true);

//获取产品型号（角色）
Stores.getProductLists = createStore('GetProductLists','/manage/auth/data/getProductBySubtypeId',null,true);


Stores.getAdvList = createStore('GetAdvList','/manage/adv/getAdvList');




//更新设备故障协议提示信息-马叔叔
Stores.updateDeviceErrorProtocol = createStore('UpdateDeviceErrorProtocol','/manage/device/deviceStat/updateDeviceErrorProtocol','post',true);
// 获取单个设备型号信息-马叔叔
Stores.getOneProductDeviceStat = createStore('GetOneProductDeviceStat','/manage/device/deviceStat/getOneProductDeviceStat',null,true);
//获取设备故障协议提示信息列表
Stores.getDeviceErrorProtocolList = createStore('GetDeviceErrorProtocolList','/manage/device/deviceStat/getDeviceErrorProtocolList',null,true);
// 获取指令类型列表
Stores.getDeviceOrderTypeList = createStore('GetDeviceOrderTypeList','/manage/orderConfig/getDeviceOrderTypeList',null,true);
// 获取设备硬件配置协议
Stores.getProtoConfig = createStore('GetProtoConfig','/manage/common/device/protocol/getProtoConfig',null,true);
// 新增语音控制配置
Stores.addOrderConfig = createStore('AddOrderConfig','/manage/orderConfig/add','post',true);
// 更新语音控制配置
Stores.updateOrderConfig = createStore('UpdateOrderConfig','/manage/orderConfig/update','post',true);
// 语音控制配置列表
Stores.getDeviceOrderConfigList = createStore('GetDeviceOrderConfigList','/manage/orderConfig/getDeviceOrderConfigList',null,true);
// 获取设备硬件配置协议
Stores.getProtoConfig = createStore('GetProtoConfig','/manage/common/device/protocol/getProtoConfig',null,true);
// 语音控制配置操作（启用，取消启用，删除）
Stores.orderConfigOpe = createStore('OrderConfigOpe','/manage/orderConfig/ope',null,true);
//获取设备型号统计列表
Stores.getProductDeviceStat = createStore('GetProductDeviceStat','/manage/device/deviceStat/productDeviceStat');




// 获取设备小类列表
Stores.getDevSubTypeList = createStore('GetDevSubTypeList','/manage/open/deviceSubType/getList');
// 新增设备小类
Stores.addDevSubType = createStore('AddDevSubType','/manage/open/deviceSubType/add','post',true);
// 修改设备小类
Stores.updateDevSubType = createStore('UpdateDevSubType','/manage/open/deviceSubType/update','post',true);
// 删除设备小类
Stores.deleteDevSubtype = createStore('DeleteDevSubtype','/manage/open/deviceSubType/delete',null,true);
// 获取小类详情
Stores.getDevSubType = createStore('GetDevSubType','/manage/open/deviceSubType/get',null,true);
// 获取设备大类列表
Stores.getDevTypeList = createStore('GetDevTypeList','/manage/open/deviceType/getList');

// 新增设备大类
Stores.addDevType = createStore('AddDevType','/manage/open/deviceType/add','post');

// 修改设备大类
Stores.updateDevType = createStore('UpdateDevType','/manage/open/deviceType/update','post');

// 删除设备大类
Stores.deleteDevType = createStore('DeleteDevType','/manage/open/deviceType/delete');

// 获取大类详情
Stores.getDevType = createStore('GetDevType','/manage/open/deviceType/get');




// 获取积分任务列表
Stores.getTaskList = createStore('GetTaskList','/point/rule/getTaskList',null,true);
// 获取积分规则列表
Stores.getIntegralRuleList = createStore('GetIntegralRuleList','/point/rule/getRuleList');
// 积分规则操作
Stores.integralRuleOpe = createStore('IntegralRuleOpe','/point/rule/deleteRule',null,true);
// 获取积分规则详情
Stores.getIntegralRule = createStore('GetIntegralRule','/point/rule/getRule',null,true);

// 获取积分商城礼品列表
Stores.getGoodsList = createStore('GetGoodsList','/point/goods/getGoodsList');
// 获取积分商城礼品详情
Stores.getMallPro = createStore('GetMallPro','/point/goods/getGoods',null,true);
// 获取积分规则详情
Stores.getIntegralRule = createStore('GetIntegralRule','/point/rule/getRule',null,true);

// 获取积分商城礼品列表
Stores.getGoodsList = createStore('GetGoodsList','/point/goods/getGoodsList');
// 添加和更新积分商城礼品
Stores.editMall = Reflux.createStore({  
    listenables: Actions,
    onAddMallPro(model) { 
        this.fetch({
            url: Tools.domainName + '/point/goods/addGoods',
            method: 'post',
            data: model,
            success: (data)=>{
                this.trigger(data);
            },
            fail: (xhr)=>{
                this.trigger(JSON.parse(xhr.response));
            }
        });
    },
    onUpdateMallPro(model){
        this.fetch({
            url: Tools.domainName + '/point/goods/updateGoods',
            method: 'post',
            data: model,
            success: (data)=>{
                this.trigger(data);
            },
            fail: (xhr)=>{
                this.trigger(xhr.response);
            }
        });
    }
});

// 获取订单列表
Stores.getExchageRecordList = createStore('GetExchageRecordList','/point/trade/getExchageRecordList');

// 订单作废
Stores.cancelTrade = createStore('CancelTrade','/point/trade/cancelTrade',null,true);

// 修改订单
Stores.updateTradeInfo = createStore('UpdateTradeInfo','/point/trade/updateTradeInfo',null,true);
Stores.getCityList1 = createStore('GetCityList1','/manage/auth/data/getCity');
//获取新增设备占比信息
Stores.getNewDeviceProportion = createStore('GetNewDeviceProportion','/manage/device/deviceStat/newDeviceProportion');
//获取新增设备列表
Stores.getNewDeviceList = createStore('GetNewDeviceList','/manage/device/deviceStat/newDeviceList');
//获取管理下的设备列表
Stores.getProductDeviceList = createStore('GetProductDeviceList','/manage/device/deviceStat/productDeviceList');
//获取新增设备统计信息
Stores.getNewDeviceStat = createStore('GetNewDeviceStat','/manage/device/deviceStat/newDeviceStat');
// 新增用户统计查询
Stores.getAddUserStatisList = createStore('GetAddUserStatisList','/manage/user/getAddUserStatisList');
//获取城市（角色）
Stores.getCityList = createStore('GetCityList','/manage/auth/data/getCity');
Stores.getCityList1 = createStore('GetCityList1','/manage/auth/data/getCity');
// 获取用户列表
Stores.getUserList = createStore('GetUserList','/manage/user/getUserList');



//最新数据统计接口
Stores.getdataStatisLatest = createStore('GetdataStatisLatest','/manage/user/getdataStatisLatest');

// 用户画像统计
Stores.getUserPictureStatis = createStore('GetUserPictureStatis','/manage/user/getUserPictureStatis');

// 各硬件用户量占比(getDeviceUserNumStatisRate)
Stores.getDeviceUserNumStatisRate = createStore('GetDeviceUserNumStatisRate','/manage/user/getDeviceUserNumStatisRate');

// 查看用户指标详情
Stores.getDetailByDate = createStore('GetDetailByDate','/manage/user/getDetailByDate');

// 查看用户数据
Stores.getUserInfo = createStore('GetUserInfo','/manage/user/getUserInfo');

//获取用户服务列表
Stores.getUserServeList = createStore('GetUserServeList','/manage/user/serve/userServeList');

//获取用户服务详情
Stores.getUserServeDetail = createStore('GetUserServeDetail','/manage/user/serve/userServeDetail');

//增加回访记录
Stores.addVisitReturn = createStore('AddVisitReturn','/manage/user/serve/addVisitReturn');

//获取反馈列表
Stores.getFeedBackList = createStore('GetFeedBackList','/manage/common/feedbackManage/feedBackList');





export {Actions, Stores};
