/*
*  内容展示模块
*/
import React, {PropTypes,Component} from 'react';
import {Link} from 'react-router';
import Title from '../../../../../../../components/public/Title';
import Thead from '../../../../../../../components/public/Thead';
import { Actions, Stores} from '../../../../../../../components/fetchData';
import Tools from '../../../../../../../components/tools';
import Pager from '../../../../../../../components/public/Pager';  // 分页模块
import EmptyCnt from '../../../../../../../components/public/EmptyCnt';  // 暂无内容时显示的模块
import WaiterLoad from '../../../../../../../components/public/WaiterLoad';  // 加载等待模块
import Image from '../../../../../../../components/public/react-image';
import _isEqual from 'lodash.isequal';
import _filter from 'lodash.filter';
import moment from 'moment';
import Confirm from '../../../../../../../components/public/react-confirm-dt';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmTwo from '../../../../../../../components/public/react-confirm-dt-Two';



class PagerContainer extends Component{
    state = {
    };
    static defaultProps = {
    };
    static contextTypes = { 
      router: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    getPager (pIndex){
        let curQuery = this.props.location.query;
        if(parseInt(pIndex) > 1){
            curQuery.page = pIndex;
        }else{
            curQuery.page = null;
            curQuery = Tools.filterParam(curQuery);
        }

        // 点击分页时保存分页信息到历史记录
        this.context.router.push({ pathname: '/main/vision/list', query: curQuery});
    }
    render(){
        let {params, pager} = this.props;
        let totalRows = pager.totalRows;
        return (<div className='ui-box-pager clearfix'>
            <div className="pager-Modify">
                <span className='ui-total fl'><em>共</em><b>{totalRows}</b><em>条数据</em></span>
                <Pager pager={pager} getPager={this.getPager.bind(this)} />
            </div>
        </div>);
    }
}

class List extends Component{
    state = {
    };
    static defaultProps = {
    };
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    handleEdit(singleDeviceInfo){

        this.props._setParentState({singleDeviceInfo: singleDeviceInfo,EditDevicedNo:singleDeviceInfo.dataId,isShowEditDevice:true});
    }
    render(){
        let list = this.props.list;
        // console.log("List-----",list);
        let tr = list.map((ele,i,self)=>{            
            let {studentId,createDate,dataTime,studentName,gradeName,className,sex,age,leftAbnormal,leftVision,rightAbnormal,rightVision} = ele;

            let singleDeviceInfo = JSON.parse(JSON.stringify(ele));
            let num;
            if(this.props.pageIndex==1){
                num=i+1;
            }else{
                num = (this.props.pageIndex-1)*20+i+1;
            }

            let edit = null;
            let deleteHtml = null;
          
            let styles = {
                width: 60,
                height: 60,
                // backgroundColor: '#e3e3e3',
                // border: '1px solid #ddd',
                margin: '0 auto'
            };

            // leftVision = leftVision.toFixed(1);
            // rightVision = rightVision.toFixed(1);


           if(leftVision==null ){
                leftVision=leftVision;
            }else{
                leftVision=leftVision*1;
                leftVision = leftVision.toFixed(1);
            }

            if(rightVision==null){
                rightVision=rightVision;
            }else{
                rightVision=rightVision*1;
                rightVision = rightVision.toFixed(1);
            }
            



            return (<tr className='het-tr-hover' key={i}>
                <td>{num}</td>
                <td>{createDate || '--'}</td>
                <td>{studentId || '--'}</td>
                <td>{studentName || '--'}</td>
                <td>{gradeName || '--'}</td>
                <td>{className || '--'}</td>
                <td>{sex || '--'}</td>
                <td>{age==0?0:age || '--'}</td>
                <td style={{color:leftAbnormal==0?'red':'#696969'}}>{leftVision || '--'}</td>
                <td style={{color:rightAbnormal==0?'red':'#696969'}}>{rightVision || '--'}</td>
                <td>
                    <p><a href='javascript:void(0)' onClick={this.handleEdit.bind(this,singleDeviceInfo)}>编辑</a></p>
                </td>
               
            </tr>);
        });
        return (<tbody>{tr}</tbody>);
    }
}

//编辑视力---组件
class EditDevModel extends Component{  
    state = {
        studentName:'',
        leftVision:'',
        rightVision:'',
        showdevicePlace:'',
        whetherRevise:false     //判断是否有修改


    };
    static defaultProps = {
        
    };
    constructor(props) {
        super(props);

        this.unlisten = [];
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    componentDidMount(){
        this.setState({judge:''})
    }
    componentWillMount(){
        let classRoomId;

        let time = this.props.singleDeviceInfo.createDate;
        // let changgeTime = moment(time);
        // console.log("changgeTime",changgeTime,moment());
        let singleDeviceInfo = this.props.singleDeviceInfo;
        let studentName= this.props.singleDeviceInfo.studentName;
        let leftVision = this.props.singleDeviceInfo.leftVision;
        let rightVision = this.props.singleDeviceInfo.rightVision;


        let t = moment(time);
        t.add(t.utcOffset()/60,'h');
        time = t.format('YYYY-MM-DD');  
        console.log("changgeTime",time);
        // !Tools._isEmpty(startTime) ? moment(startTime)

        this.setState({
            beginTime: !Tools._isEmpty(time) ? moment(time) : null,  // 活动开始时间
            leftVision:leftVision,
            rightVision:rightVision,
            studentName:studentName
        });
    }
    componenntWillReceiveProps(nextProps){
        if(nextProps.singleDeviceInfo.deviceNo!= this.props.singleDeviceInfo.deviceNo){
            //this.setState({ deviceNo: nextProps.singleDeviceInfo.deviceNo });
        }
    }
    handleDate(flag, date){
        console.log("12312",date)
        let oldbegin = this.state.changgeTime;
        // let oldend = this.state.endTime;
        let dateObj;
        dateObj = {beginTime: date};
       
        this.props.singleDeviceInfo.createDate=date.format("YYYY-MM-DD");
        let  eleInfo = this.props.singleDeviceInfo
        console.log("aaaaaaa",eleInfo); 
        this.setState(dateObj);
        this.props._EditParse({eleInfo:eleInfo,whetherRevise:true,fei:'1'});
    }
    handleLeft(eleInfo,e){   //var reg6 = /^[0-9]+.?[0-9]+$/   判断是否是数字  0. 这些都不算是数字    let reg2 = /^\d{1}.\d{1}/;
        this.props._EditParse({judge:""});
        e = e || window.event;
        let val = e.target.value;

        debugger;
      

        let reg1 = /^[0-9]+.?[0-9]*$/;   //判断是否是数字 但是这里 像0. 的 符合
        let reg2 = /^[0-9]+.?[0-9]+$/;    //判断是否是数字,但是这里 像0. 的就不符合
        let reg3 = /^\d{1}.$/;           //
        if(reg1.test(val)){
            this.setState({leftVision:val});
            eleInfo.changed = 1;
            eleInfo.leftVision=val;
            this.props._EditParse({leftVision:val,eleInfo:eleInfo,whetherRevise:true});
            return; 
        }else if(reg2.test(val)){
            this.setState({leftVision:val});
            eleInfo.changed = 1;
            eleInfo.leftVision=val;
            this.props._EditParse({leftVision:val,eleInfo:eleInfo,whetherRevise:true});
            return; 
        }else if(reg3.test(val)){
            this.setState({leftVision:val});
            eleInfo.changed = 1;
            eleInfo.leftVision=val;
            this.props._EditParse({leftVision:val,eleInfo:eleInfo,whetherRevise:true});
            return;          
        }
        if(val===null || val===''){
            this.setState({leftVision:val});
            eleInfo.changed = 1;
            eleInfo.leftVision=val;
            this.props._EditParse({leftVision:val,eleInfo:eleInfo,whetherRevise:true});
            return;   
        }

        let reg0 = /^[A-Za-z0-9]*$/;
        if(reg0.test(val)){
            console.log("reg0",reg0.test(val));
            this.setState({leftVision:''});
        }
        
               

    }
    handleRight(eleInfo,e){
        console.log("dataId",e,eleInfo);
        this.props._EditParse({judge:""});
        e = e || window.event;
        let val = e.target.value;
        debugger;
        let reg4 = /^[0-9]+.?[0-9]*$/;   //判断是否是数字 但是这里 像0. 的 符合
        let reg5 = /^[0-9]+.?[0-9]+$/;    //判断是否是数字,但是这里 像0. 的就不符合
        let reg6 = /^\d{1}.$/;           //
        if(reg4.test(val)){
            this.setState({rightVision:val});
            eleInfo.changed = 1;
            eleInfo.rightVision=val;
            this.props._EditParse({rightVision:val,eleInfo:eleInfo,whetherRevise:true});
        }else if(reg5.test(val)){
            this.setState({rightVision:val});
            eleInfo.changed = 1;
            eleInfo.rightVision=val;
            this.props._EditParse({rightVision:val,eleInfo:eleInfo,whetherRevise:true});
        }else if(reg6.test(val)){
            this.setState({rightVision:val});
            eleInfo.changed = 1;
            eleInfo.rightVision=val;
            this.props._EditParse({rightVision:val,eleInfo:eleInfo,whetherRevise:true});       
        }
        if(val===null || val===''){
            this.setState({rightVision:val});
            eleInfo.changed = 1;
            eleInfo.rightVision=val;
            this.props._EditParse({rightVision:val,eleInfo:eleInfo,whetherRevise:true});  
        }
       
        // this.props._EditParse({rightVision:val,eleInfo:eleInfo,whetherRevise:true});
        // this.props._setParentState({data:data,oldList:this.props.list});
    }
    render(){
        let singleDeviceInfo = this.props.singleDeviceInfo;
        
        let selectPotionLength = this.state.selectPotionLength?'放置位置不超过50字符':'';    //放置位置---提示
        let formObj = "0 40px";                                                              //formObj---样式
        let judge = this.props.judge?this.props.judge:'';                                    //提示语
        
        let studentName= this.state.studentName;
        let leftVision = this.state.leftVision;
        let rightVision = this.state.rightVision;

        // console.log("this.props.singleDeviceInfo",this.props.singleDeviceInfo,this.state);
        // console.log("studentName",studentName,leftVision,rightVision);
        console.log("thi11111",this.state);
        return (
          <form className='formObj' style={{margin:formObj}}>
                <p className="vision-editp1"><label><span>学生姓名:</span><b><input type="text" placeholder="001" readOnly="true" value={studentName}   style={{width: 200,height: 25,color:'#CCCFDA'}} /></b></label></p>
                <div className="vision-editp1"><label>                    
                    <span>测量日期：</span>
                     <DatePicker  peekNextMonth showMonthDropdown  showYearDropdown dropdownMode="select"  dateFormat='YYYY-MM-DD' selected={this.state.beginTime} className='het-input-text-s2' onChange={this.handleDate.bind(this, 'begin')} locale='zh-cn'/>
                </label>
                </div>
                <p className="vision-editp1"><label><span>左眼视力:</span><input type="text"     value={leftVision}  onChange={this.handleLeft.bind(this,singleDeviceInfo)}   style={{width: 200,height: 25}}/></label></p>
                <p><label><span>右眼视力:</span><input type="text"      value={rightVision} onChange={this.handleRight.bind(this,singleDeviceInfo)}   style={{width: 200,height: 25}}/></label></p>
                <p style={{height:20,textAlign:'center',color:'red'}}>{judge}</p>
            </form>
        );
    }
}


//导入---组件
class AddGradeMod extends Component{
    state = {
       
    };
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.unlisten = [];
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }

    addGradeName(e){        //年级名称
        e = e || window.event;
        let val = e.target.value;
        this.props._setAddParse({gradeName:val});
    }
    addGradeSort(e){           //年级排序
        e = e || window.event;
        let val = e.target.value;
        this.props._setAddParse({gradeOrder:val});
    }
    handleSelectIcon(e){
        e = e || window.event;
        let val = e.target.value;
        if(val != ''){
            // this.setState({iconSelect: val});
            this.props._setAddParse({iconSelect:val,redsFile:this.refs['het-form-icon']});
        }else{
            // this.setState({iconSelect: val});
            this.props._setAddParse({iconSelect:val,redsFile:this.refs['het-form-icon']});
        }
    }
    render(){
       
        let getData = this.props;
        let number = getData.gradeId;
        let judge = this.props.judge?this.props.judge:'';
        let href = ('/v1/web/campus/studentHealthReport/downloadVisionModel');
        return (
            <div className='formObj'>
                <form ref='het-form-icon' style={{textAlign:'center'}}    >
                        <label className="vision-ipt">
                            <span><i style={{color:'red',padding:0}}>*</i>上传文件:</span>                                      
                            <input  type='file' value={this.state.iconSelect} onChange={this.handleSelectIcon.bind(this)} name='uploadExcel' /> 
                            <a className="upload-Mod" href={href} target='_blank'>下载excel模板</a></label>
                </form>
                <p   className="vision-tip1" style={{textAlign:'center'}}>提示：请下载excel模板，按照要求添加学生视力并导入 </p>
                <p style={{height:20,textAlign:'center',color:'red'}}>{judge}</p>
            </div>
        );
    }
}
//导入失败提示框
class AddMod extends Component{
    state = {
       
    };
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.unlisten = [];
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }

    render(){
    
        let importReturn = this.props.importReturn || '';

        console.log("导入失败提示框---",importReturn);

        let judge = this.props.judge?this.props.judge:'';
        let msgList = this.props.msgList;
        let href = ('/v1/web/campus/studentHealthReport/exportErrorData?errorId='+msgList);
        return (
            <form className='formObj'>
                <p style={{textAlign:'center'}}>{importReturn}</p>
                {/*<p style={{textAlign:'center'}}>请下载失败清单，重新编辑上传 </p>*/}
                <p style={{textAlign:'center'}} className="vision-tip1" ><a className="upload-Mod" href={href} target='_blank'>下载失败清单</a> </p>
                {/*<p className="Modify-format">(格式如:F0FE6B1137E9)</p>*/}
                <p style={{height:20,textAlign:'center',color:'red'}}>{judge}</p>
            </form>
        );
    }
}


class VisionList extends Component{
    static contextTypes = { 
      router: PropTypes.object.isRequired
    };
    static defaultProps = {
        locale : 'zh-cn',
        pageRows: 20,
        pageIndex: 1
    };
    constructor(props) {
        super(props);

        // 历史记录同步到组件状态
        this.state = {
            isLoaded: false, 
            isDisabledSearch: false,  // 控制搜索按钮是否可连续点击
            isShowEditDevice:false,
            studentReportList: {},  // 小类列表
            studentReportList:'',      
            deviceType:!!this.props.location.query.deviceType ? this.props.location.query.deviceType.trim() : '',
            gradeId:!!this.props.location.query.gradeId ? this.props.location.query.gradeId.trim() : '',
            classId:!!this.props.location.query.classId ? this.props.location.query.classId.trim() : '',
            textNo:!!this.props.location.query.textNo ? this.props.location.query.textNo.trim() : '',
            classList:!!this.props.location.query.classList ? this.props.location.query.classList.trim() : '',
            beginTime:moment(),
            endTime:moment(),
            sex:'',
            studentName:!!this.props.location.query.studentName ? this.props.location.query.studentName.trim() : '',
            checked:true
        };

        this.queryList = this.queryList.bind(this);
        
        this.unlisten = [];
       

        this.unlisten.push(Stores.getStudentVisionDataList.listen(this.onGetStudentVisionDataList.bind(this)));         //分页获取学生视力信息列表
        this.unlisten.push(Stores.getGradeList.listen(this.onGetGradeList.bind(this)));   //年级管理---获取年级列表(不分页)
        this.unlisten.push(Stores.getClassListByGradeId.listen(this.onGetClassListByGradeId.bind(this)));   //根据年级获取班级列表
        this.unlisten.push(Stores.updateVisionById.listen(this.onUpdateVisionById.bind(this)));   //修改学生视力信息
        this.unlisten.push(Stores.importStuVision.listen(this.onImportStuVision.bind(this)));    //教师信息的导入
    
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    componentDidMount (){
        Actions.getGradeList();
        // Actions.getStudentVisionDataList();



        Tools.scrollTop(0);
        this.props._setState({isShowWaiter: false,isShowAlert:false,isShowConfirm:false});

        // 保存初始状态值
        this.oldSearchStatus = {
            gradeId: this.state.gradeId,
            classId: this.state.classId,
            beginTime:this.state.beginTime,
            endTime:this.state.endTime,
            studentName:this.state.studentName,
            sex:this.state.sex
        };
        this.queryList(this.props.location.query.page);
    }
    componentWillUnmount() {
        this.unlisten.forEach((ele,i)=>{
            if(Tools.isFunction(ele)){
                ele();
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        let props = nextProps;
        let isDiffSearch = props.location.search === this.props.location.search;
        let nextState = {
            gradeId: !!props.location.query.gradeId ? props.location.query.gradeId.trim() : '',
            classId: !!props.location.query.classId ? props.location.query.classId.trim() : '',
            // beginTime: !!props.location.query.beginTime ? props.location.query.beginTime.trim() : '',
            studentName: !!props.location.query.studentName ? props.location.query.studentName.trim() : '',
            beginTime:moment(),
            endTime:moment(),
            sex:!!props.location.query.sex ? props.location.query.sex.trim() : '',
        };
        // 历史记录有修改时将其同步到组件状态并重新查询数据
        // this.setState(nextState,()=>{
        //     if(!isDiffSearch){               
                this.queryList(props.location.query.page);
        //     } 
        // });
    }
    queryList(pageIndex,callback){
        let curPageIndex = 1; 
        if(!Tools._isEmpty(pageIndex)){
            if(parseInt(pageIndex) != pageIndex || parseInt(pageIndex) < 1){
                curPageIndex = 1;
            }else{
                curPageIndex = pageIndex;
            }
        }

        let params = this.state.beginTime;
        let change = params.format('YYYY-MM-DD');
        let opts = {
                pageIndex: curPageIndex == 1 ? 1 : curPageIndex,
                pageRows:20,
                startDate:this.state.beginTime.format('YYYY-MM-DD'),
                endDate:this.state.endTime.format('YYYY-MM-DD'),
                gradeId:this.state.gradeId,
                classId:this.state.classId,
                sex:this.state.sex,
                studentName:this.state.studentName,
                
        };
        opts = Tools.filterParam(opts);
        this.setState({isDisabledSearch: true},()=>{          
            Actions.getStudentVisionDataList(opts,callback);
        }); 
        Tools.scrollTop(0);
    }
    saveStateToHistory(){  // 点击查询时保存筛选字段到历史记录   
        let curQuery = {
            gradeId: this.state.gradeId,
            classId: this.state.classId,
            beginTime:this.state.beginTime.format('YYYY-MM-DD'),
            studentId:this.state.studentId,
            studentName:this.state.studentName,
            textNo:this.state.textNo
        };
        curQuery = Tools.filterParam(curQuery);  
        this.context.router.push({ pathname: '/main/vision/list',query:curQuery});
    }
    onGetStudentVisionDataList(model,callback){  // 分页获取学生视力信息列表
        let code = model.code;
        this.setState({isDisabledSearch: false});
        switch(code){
            case 0:  
                let data = model.data;
                this.props._setState({isShowWaiter: false});
                this.setState({studentReportList: data,singleDeviceInfo:{},isLoaded: true,isDisabledSearch:false},()=>{
                    if(Tools.isFunction(callback)){
                        callback();
                    }  
                });
            break;
            case 100010110: 
                this.props._setState({isShowAlert: true,messageAlert: '您还未登录，请重新登录！',leavedCallback:()=>{
                    this.context.router.push({ pathname: '/'});
                }});
            break;
            default:
                let msg = !Tools._isEmpty(model.data) ? model.data : model.msg;
                this.props._setState({isShowAlert: true,messageAlert: msg});
        }
    }
    handleSexLookUp(e){  //性别下拉框
        e = e || window.event;   
        let val = e.target.value;
        this.setState({sex:val});
        if(val==1){
            this.setState({sex:1});
        }else if(val==2){
            this.setState({sex:2});
        }
    }

    handleReset(){          //重置
        this.setState(this.oldSearchStatus);
        this.setState({classList:'',checked:true});
        Actions.getStudentVisionDataList({
            // status:0,   
            pageIndex:1,
            pageRows:20,
            // startDate:this.state.beginTime.format('YYYY-MM-DD'),//虽然上面设置了 但是以为异步的原因 所以这里的this.state.beginTime还是旧的  随意改成下面那种
            // endDate:this.state.endTime.format('YYYY-MM-DD'),
            startDate:moment().format('YYYY-MM-DD'),
            endDate:moment().format('YYYY-MM-DD')
        });
    }
    _setParentState(state,fn){
        this.setState(state,fn);
    }
    _EditParse(state,fn){
        console.log("111111111111111111111",state);
        this.setState(state,fn);
    }
    _setAddParse(state,fn){  //视力导入的方法
        this.setState(state,fn);
    }
    _setTipsParse(state,fn){
         this.setState(state,fn);
    }
    onGetGradeList(model,callback){   //年级管理---获取年级列表(不分页)
            let code = model.code;
            switch(code){
                case 0:  
                    let data = model.data;
                    this.setState({gradeList:data});
                break;
                case 100010110: 
                    this.props._setState({isShowAlert: true,messageAlert: '您还未登录，请重新登录！',leavedCallback:()=>{
                        this.context.router.push({ pathname: '/'});
                    }});
                break;
                default:
                    let msg = !Tools._isEmpty(model.data) ? model.data : model.msg;
                    this.props._setState({isShowAlert: true,messageAlert: msg});
            }
    }  
    onGetClassListByGradeId(model,callback){ //年级获取班级列表
            let code = model.code;
            switch(code){
                case 0:  
                    let data = model.data;
                    this.setState({classList:data});
                break;
                case 100010110: 
                    this.props._setState({isShowAlert: true,messageAlert: '您还未登录，请重新登录！',leavedCallback:()=>{
                        this.context.router.push({ pathname: '/'});
                    }});
                break;
                default:
                    let msg = !Tools._isEmpty(model.data) ? model.data : model.msg;
                    this.props._setState({isShowAlert: true,messageAlert: msg});
            }
    }
    handleGradeName(e){    //年级名称下拉事件
        e = e || window.event;
        let val = e.target.value;   
        let selectedIndex = e.target.selectedIndex;
        let selectedText = e.target.options[selectedIndex].innerHTML; 
        this.setState({gradeId:val,gradeName:val});
        if(val==''){
            this.setState({classList:''});
            return; 
        }
        Actions.getClassListByGradeId({gradeId:val});
    }
    handleClassName(e){    //班级名称下拉事件
        e = e || window.event;
        let val = e.target.value;   
        // Actions.getClassListByGradeId({gradeId});
        this.setState({classId:val});
    }
    handleDateChange(flag, date) {  // 修改日期
        let oldbegin = this.state.beginTime;
        let oldend = this.state.endTime;
        let dateObj;
        if(flag=='begin') {
            if(date !== null && oldend && date.format('x') > oldend.format('x')){
                this.props._setState({isShowAlert: true, messageAlert: '开始日期必须小于或等于结束日期!'});
                return; 
            }        
            dateObj = {beginTime: date};
        }
        if(flag=='end'){
            if(date !== null && oldbegin && date.format('x') < oldbegin.format('x')){
                this.props._setState({isShowAlert: true,messageAlert: '结束日期必须大于或等于开始日期!'});
                return;
            } 
            dateObj = {endTime: date}; 
        }
        this.setState(dateObj);
    }
    handleNameNumber(e){    //姓名
        e = e || window.event;
        let val = e.target.value;   
        // this.setState({brandName:val,textNo:val});  //查询-学号/姓名->textNo
        this.setState({studentName:val});
    }
    handleButtonTea(e){  //导入
        this.setState({isShowAddDevice:true});
    }
    handleButtonTea2(e){  //批量录入视力
        this.context.router.push({pathname:'/main/vision/batchIn'});
    }

    editDeviceCallback(type){     //编辑视力---确定/取消
        console.log("editDeviceCallback",this.state)
        this.setState({judge:''});
        debugger;
        if(type == 'confirm'){
            if(!this.state.eleInfo){    //如果点击之后没有修改
                this.props._setState({isShowWaiter: false});
                this.setState({isShowEditDevice: false,whetherRevise:false});
                return;
            }
            if(this.state.whetherRevise===false){
                this.props._setState({isShowWaiter: false});
                this.setState({isShowEditDevice: false,whetherRevise:false,judge:''});
                return;
            }
         
            //点击之后有修改
            let leftValue=this.state.eleInfo.leftVision;
            let rightValue=this.state.eleInfo.rightVision;

            console.log("leftValue",leftValue,'rightValue-',rightValue);
            if((leftValue===''&&rightValue!='') || (leftValue===null&&rightValue!='')){
            
                this.setState({judge:'每位学生的左眼视力、右眼视力都填写或者都不填写'});
                return;  
            }
            if(rightValue===''&&leftValue!='' || (rightValue===null&&leftValue!='')){
               
                this.setState({judge:'每位学生的左眼视力、右眼视力都填写或者都不填写'});
                return;  
            }  
            // 视力格式不正确,视力区间应为0.1~2.0,否则保存无效
            let reg9 = /^[0-9]+.?[0-9]+$/;    //判断是否是数字,但是这里 像0. 的就不符合
            let reg10 = /^[0-9]+.?[0-9]*$/;    //所以上面是判断0. 这个不可以  然后这个是再判断1,2,3  可以
            if(leftValue>=0.1 && leftValue<=2){
                if(reg9.test(leftValue)){
                    console.log("左眼符合条件");
                }else{
                    if (reg10.test(leftValue)) {
                        console.log("左眼符合条件");
                    }else{
                         this.setState({judge:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                        return;     
                    } 
                }    
            }else{
                if(leftValue!=''){
                    this.setState({judge:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                    return;
                }
                
            }
            // 视力格式不正确,视力区间应为0.1~2.0,否则保存无效
            if(rightValue>=0.1 && rightValue<=2){
                if(reg9.test(rightValue)){
                    console.log("右眼符合条件");
                }else{
                    if (reg10.test(rightValue)) {
                        console.log("左眼符合条件");
                    }else{
                         this.setState({judge:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                        return;     
                    } 
                }
            }else{
                if(rightValue!=''){
                    this.setState({judge:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                    return;
                }
                
            }



            // this.props._setState({isShowWaiter: true,waiterText: '正在修改...'},()=>{
                    let eleInfo = this.state.eleInfo;
                    let data={
                        studentId:eleInfo.studentId,    //学生编号
                        leftVision:eleInfo.leftVision,     //左眼视力
                        rightVision:eleInfo.rightVision,      //右眼视力  
                        measureTime: eleInfo.createDate   //日期
                    }
                    Actions.updateVisionById({
                            dataId:eleInfo.dataId,
                            data:JSON.stringify(data)
                    }); 
                 
                console.log("点击确定",data,this.state.eleInfo);
            // });



        }else{
             
            this.setState({isShowEditDevice: false,whetherRevise:false,judge:''});
        }

    }
    editDeviceLeaveBeforeCallback(type){      //编辑视力---验证
        this.editDeviceCallback('confirm');   //多种方法选择--马叔叔那种---手动调用确定回调---后面必须 return false
        return false;                         // return true(弹窗隐藏---走确定回调方法)  return false 弹窗不隐藏且不走确定回调      必须---否则确定回调无用
    }
    onUpdateVisionById(model,callback){
        let code = model.code;
        this.props._setState({isShowWaiter: false});
            switch(code){
                case 0:  
                       
                        this.setState({isShowEditDevice: false,whetherRevise:false,judge:''});

                        Actions.getStudentVisionDataList({
                            // status:0,   
                            pageIndex:1,
                            pageRows:20,
                            startDate:this.state.beginTime.format('YYYY-MM-DD'),
                            endDate:this.state.endTime.format('YYYY-MM-DD'),
                        });
                        
                break;
                case 100010110: 
                    this.props._setState({isShowAlert: true,messageAlert: '您还未登录，请重新登录！',leavedCallback:()=>{
                        this.context.router.push({ pathname: '/'});
                    }});
                break;
                default:
                    let msg = !Tools._isEmpty(model.data) ? model.data : model.msg;
                    this.props._setState({isShowAlert: true,messageAlert: msg});
            }
    }
    addGradeCallback(type){  //导入数据确定---取消回调 
        // this.setState({judge:'文件格式不正确'});
        let iconSelect = this.state.iconSelect;
        let redsFile   = this.state.redsFile;
            if(type == 'confirm'){
                if(iconSelect===undefined){
                    this.props._setState({isShowAlert: true,messageAlert: '还未选择上传文件'});
                    return;
                }
        
                if(Tools.getExtensionName(iconSelect) === 'xlsx' || Tools.getExtensionName(iconSelect) === 'xls'){
                    this.props._setState({isShowWaiter: true, waiterText: '正在处理...'},()=>{
                        Actions.importStuVision({upfile: iconSelect},this.state.redsFile);
                    });
                }else{
                    this.props._setState({isShowAlert: true,messageAlert: '请选择正确的文件类型,仅支持.xlsx或.xls格式的文件！'});
                }


                
            }else{
                this.setState({       //点击取消---将这次选择的清空
                    gradeId:'',
                    gradeName:'',
                    gradeOrder:''
                })
                this.setState({isShowAddDevice: false,judge:''});  //点击取消按钮--隐藏弹框
            }
    }
    proveLeaveBeforeCallback(type){ //导入数据---验证   
        this.addGradeCallback('confirm');   //多种方法选择--马叔叔那种---手动调用确定回调---后面必须 return false
        return false;                         // return true(弹窗隐藏---走确定回调方法)  return false 弹窗不隐藏且不走确定回调   
    }

    onImportStuVision(model,type){  //视力回调
        console.log("导入是否成功",model);
        
         this.setState({isShowAddDevice:false,judge:''});
         this.props._setState({isShowWaiter:false});    //正在处理(公共组件)弹框消失
        switch(model.code){
            case 0:
                this.props._setState({isShowAlert: true,isShowWaiter: false,messageAlert: '导入成功！'},()=>{
                    // this.context.router.push({ pathname: '/main/schoolCard/slot/list'});
                });
                break;
            case 100010110:
                this.props._setState({isShowAlert: true,isShowWaiter: false,messageAlert: '您还未登录，请重新登录！',leavedCallback:()=>{
                    this.context.router.push({ pathname: '/'});
                }});
                break;
            case -1:
               let msg = !Tools._isEmpty(model.data) ? model.data : model.msg;
               let ErrorMsg = '导入失败，请下载失败清单，重新编辑上传';
                this.setState({
                    isShowTips:true,
                    importReturn:ErrorMsg,
                    msgList:msg
                });
                break;
            default:
                let msg2 = !Tools._isEmpty(model.data) ? model.data : model.msg;
                console.log("module",model,msg);
                this.props._setState({isShowAlert: true, isShowWaiter: false, messageAlert: msg2});
        }
    }
    tipsCallback(type){   //导入数据失败提示
        this.setState({
            isShowTips:false
        })
    }
    tipsLeaveBeforeCallback(type){
        return true;
    }


    render (){
        
        // let th = ['序号','学号','年级名称','班级名称','学生姓名','身高(cm)','体重(kg)','BMI','体温(℃)','步数（步）','实时心率（次/分）','睡眠','左眼视力','右眼视力'];
        let th = ['序号','测量日期','学号','姓名','年级','班级','性别','年龄','左眼（正常值1.0-2.0）','右眼（正常值1.0-2.0）','操作'];

        let isLoaded = this.state.isLoaded;
        let studentReportListState = this.state.studentReportList || [];
        let studentReportList = studentReportListState.list || [];
    

       
       
        let pager = studentReportListState.pager;
        let len = studentReportList.length;
        let list = null;
        let pagerContainer = null;

        let isDisabledSearch = this.state.isDisabledSearch;
        let btnSearch = (<input type='button' id="btn-bg" value='查询' onClick={this.saveStateToHistory.bind(this)} />);
        if(isDisabledSearch){
            btnSearch = (<input type='button'  value='正在查询...' disabled={true} style={{background: '#ccc'}} />);
        }   

        let gainDeviceNo = this.state.gainDeviceNo || '';


        let selectList = ['小1班','小2班','小3班'];
        let selectDevList = selectList.map((ele,i)=>{
            return (<option value={i+1} key={i}>{ele}</option>);
        });

        //年级列表
        let gradeList = this.state.gradeList;
        let gradeListShow;
        if(gradeList){
            gradeListShow = gradeList.map((ele,i)=>{
            return (<option value={ele.gradeId} key={i}>{ele.gradeName}</option>);
            });
        }
        //班级列表
        let classList = this.state.classList;
        let classListShow;
        if(classList){
            classListShow = classList.map((ele,i)=>{
                return (<option value={ele.classId} key={i}>{ele.className}</option>)
            })
        }
        //性别列表
        let sexArr = ['男','女'];
        let sexList = sexArr.map((ele,i)=>{
            return (<option value={i+1} key={i}>{ele}</option>);
        })
        let selSex = this.state.selSex||'';     


        if(isLoaded){
            if(len > 0){
                 list = (<List list={studentReportList} pageIndex={pager.pageIndex} currPageRows={pager.currPageRows} _setState={this.props._setState}  _setParentState={this._setParentState.bind(this)}    queryList={this.queryList} id={this.props.params.id}    isHasDeleteRight={true} />);
               // list = (<List list={studentReportListState}  _setState={this.props._setState}  _setParentState={this._setParentState.bind(this)}    queryList={this.queryList} id={this.props.params.id}    isHasDeleteRight={true} />);
                 pagerContainer = (<PagerContainer  pager={pager} pageRows={this.props.pageRows} location={this.props.location} />);
            }else{ 
                list = (<tbody><tr><td colSpan={11} style={{padding: 0,border: 0}}><EmptyCnt content='没有符合条件的数据信息' /></td></tr></tbody>);
            }
        }else{
            list = (<tbody><tr><td colSpan={11} style={{padding: 0,border: 0}}><WaiterLoad content='正在加载......' /></td></tr></tbody>);
        }

        //编辑视力                  
        let editDevMod = (<EditDevModel deviceNo={this.state.deviceNo}  _EditParse={this._EditParse.bind(this)} singleDeviceInfo={this.state.singleDeviceInfo}  classRoomList={this.state.classRoomList}   EditDevicedNo={this.state.EditDevicedNo}  gainData={this.state.gainData}   gainDeviceNo={gainDeviceNo}  judge={this.state.judge?this.state.judge:''}  />);
        let editDevice = (
            <Confirm  confirmCallback={this.editDeviceCallback.bind(this,'confirm')} 
                      cancelCallback={this.editDeviceCallback.bind(this)}  
                      leaveBeforeCallback={this.editDeviceLeaveBeforeCallback.bind(this,'confirm')}    
                      title='编辑'  contentHeight={400} >
                {editDevMod} 
            </Confirm>
        );
        let showEditDevice = this.state.isShowEditDevice?editDevice:null;


        //导入数据
        let addGradeMod = (<AddGradeMod _setAddParse={this._setAddParse.bind(this)}  judge={this.state.judge?this.state.judge:''}  gradeId={this.state.gradeId}  />);
        let addGrade = (   
            <Confirm  confirmCallback={this.addGradeCallback.bind(this,'confirm')} cancelCallback={this.addGradeCallback.bind(this)}  leaveBeforeCallback={this.proveLeaveBeforeCallback.bind(this,'confirm')}    title='导入数据'  contentHeight={320} >
                {addGradeMod}
            </Confirm>
        );
        let showAddDevice = this.state.isShowAddDevice?addGrade:null;



        //提示
        let addMod = (<AddMod _setTipsParse={this._setTipsParse.bind(this)}  msgList={this.state.msgList}  importReturn={this.state.importReturn}   judge={this.state.judge?this.state.judge:''}   />);
        let tips = (   
            <ConfirmTwo  confirmCallback={this.tipsCallback.bind(this,'confirm')} cancelCallback={this.tipsCallback.bind(this)}  leaveBeforeCallback={this.tipsLeaveBeforeCallback.bind(this,'confirm')}    title='提示'  contentHeight={300} >
                {addMod}
            </ConfirmTwo>
        );
        let tipsshow = this.state.isShowTips?tips:null;




        let studentName = this.state.studentName || '';
        let gradeId = this.state.gradeId || '';
        let classId = this.state.classId || '';

        let sex = this.state.sex;
        let check = this.state.check || '';
        let checked = this.state.checked || true;


        let beginTime = this.state.beginTime.format('YYYY-MM-DD');
        let endTime   = this.state.endTime.format('YYYY-MM-DD');

        let dataJSON = {
            startDate:beginTime,
            endDate:endTime,
            gradeId:gradeId,
            classId:classId,
            sex:sex,
            studentName:studentName,
            type:5,

        };  
        dataJSON = Tools.filterParam(dataJSON);
        let href='';
        for(let key in dataJSON){
            href += (key+'='+dataJSON[key]+'&');
        }
        href = ('/v1/web/campus/studentHealthReport/exportStudentDataListByType?' + href).slice(0,-1);
        console.log("Main-state",this.state);

        return (
            <div>
                <div className="BMI-title">
                    <div className="BMI-title-d1">视力</div>
                    <div className="BMI-title-d2" >
                         <a   href={href}  target='_blank'>导出</a>
                         <div onClick={this.handleButtonTea.bind(this)}>导入</div>
                         <div onClick={this.handleButtonTea2.bind(this)}>批量录入视力</div>
                    </div>
                </div>
                <hr />  
                <div className='het-filter formObj hel-formObj hel-temperature'>
                    <span className='het-datepicker'>测量日期：
                        <DatePicker  peekNextMonth showMonthDropdown  showYearDropdown dropdownMode="select"  dateFormat='YYYY-MM-DD' selected={this.state.beginTime} className='het-input-text-s2' onChange={this.handleDateChange.bind(this, 'begin')} locale={this.props.locale}   />
                        <em>至</em>
                        <DatePicker  peekNextMonth showMonthDropdown  showYearDropdown dropdownMode="select"  dateFormat='YYYY-MM-DD' selected={this.state.endTime} className='het-input-text-s2' onChange={this.handleDateChange.bind(this, 'end')} locale={this.props.locale} />
                    </span>
                    <label>年级名称：
                        <select className='het-select-short' value={gradeId} onChange={this.handleGradeName.bind(this)}>
                            <option value=''>请选择</option>
                            {gradeListShow}
                        </select>
                    </label>
                    <label>班级名称：
                        <select className='het-select-short' value={classId} onChange={this.handleClassName.bind(this)}>
                            <option value=''>请选择</option>
                            {classListShow}
                        </select>
                    </label>
                    <label>性别：
                        <select className='het-select-short' value={sex} onChange={this.handleSexLookUp.bind(this)}>
                            <option value=''>全部</option>
                            {sexList}
                        </select>
                    </label>
                    <label><input type='text' className='het-input-text' placeholder='姓名' value={studentName} onChange={this.handleNameNumber.bind(this)} /></label>
                    <div className='het-button het-btnNew'>{btnSearch}<input type='button' value='重置' id="btn-bg" onClick={this.handleReset.bind(this)} /></div>
                </div>
                <div className='het-list'>
                    <table width='100%'>
                        <Thead list={th} />
                        {list}
                    </table>
                    {pagerContainer}
                    {showEditDevice}
                    {showAddDevice}
                    {tipsshow}
                </div>
            </div>
        );
    }
}

module.exports = VisionList;
	