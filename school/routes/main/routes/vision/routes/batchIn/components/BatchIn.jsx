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
import ConfirmTwo from '../../../../../../../components/public/react-confirm-dt-Two';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';



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
        this.context.router.push({ pathname: '/main/brand/list', query: curQuery});
    }
    render(){
        let pager = this.props.pager;
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

        this.unlisten = [];
       
    }
    shouldComponentUpdate(nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    handleLeft(eleInfo,num,e){  //这里为什么要多传进来一个num呢 因为为了渲染.因为handleLeft和handleRight事件都传出去个vision:val 
        //所以当我在handleLeft传出去vision:1  在handleRight也传出去vision:1 那么虽然_setParentState 有this.setstate 但是不会渲染。因为可能他们觉得是同一个值 所以就不渲染了
        //解决方法很多 那就是再传出去他们有不相同的值  比如我这里handleLeft 传Leftnum:num  handleRight传RightNum:num  虽然他们的vision:val 相同 但是他们Leftnum和Rightnum不同 
        //所以他们就重新渲染了
        //又获取我不传vision  只传oldList 也可以渲染的.第一次测试的时候，但是后面测试就全部不会渲染了 
        //所以这里最好的方法还是每次渲染都传不同的值吧

        e = e || window.event;
        let val = e.target.value;
        // eleInfo.leftVision=val;
        eleInfo.changed = 1;       
        debugger;
        let reg1 = /^[0-9]+.?[0-9]*$/;   //判断是否是数字 但是这里 像0. 的 符合
        let reg2 = /^[0-9]+.?[0-9]+$/;    //判断是否是数字,但是这里 像0. 的就不符合
        let reg3 = /^\d{1}.$/;           //
        if(reg1.test(val)){
            this.setState({leftVision:val});
            eleInfo.leftVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,Leftnum:num});
        }else if(reg2.test(val)){
            this.setState({leftVision:val});
            eleInfo.leftVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,Leftnum:num});
        }else if(reg3.test(val)){
            this.setState({leftVision:val});
            eleInfo.leftVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,Leftnum:num});      
        }

        if(val===null || val===''){
            this.setState({leftVision:val});
            eleInfo.leftVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,Leftnum:num});
        }

        console.log("val",val,'--','---',eleInfo);  
    }
    handleRight(eleInfo,num,e){   
        e = e || window.event;
        let val = e.target.value;
        // eleInfo.rightVision=val;
        eleInfo.changed = 1;
        
        debugger;
        let reg1 = /^[0-9]+.?[0-9]*$/;   //判断是否是数字 但是这里 像0. 的 符合
        let reg2 = /^[0-9]+.?[0-9]+$/;    //判断是否是数字,但是这里 像0. 的就不符合
        let reg3 = /^\d{1}.$/;           //
        if(reg1.test(val)){
            this.setState({rightVision:val});
            eleInfo.rightVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,RightNum:num});
        }else if(reg2.test(val)){
            this.setState({rightVision:val});
            eleInfo.rightVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,RightNum:num});
        }else if(reg3.test(val)){
            this.setState({rightVision:val});
            eleInfo.rightVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,RightNum:num});   
        }

        if(val===null || val===''){
            this.setState({rightVision:val});
            eleInfo.rightVision=val;
            this.props._setParentState({oldList:this.props.list,vision:val,edit:1,RightNum:num});
        }



       
        console.log("右眼val",val,'--','右眼',eleInfo); 
    }
    handleLeftBlur(eleInfo,e){      
        // e = e || window.event;
        // let val = e.target.value;

        // if(val==='' || val==='--' || val==='-'){
        //     return;
        // }
        // if(val==='1.' || val==='2.'){  //因为下面语句判断 会将1./2. 转换成1/2 所以就符合要求了  所以这里对这两个数做特别的处理
        //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
        // }

        // val = val*1;
        // if(isNaN(val)){
        //     e.target.focus();
        //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
        // }else if(val<0.1 || val>2){
        //     e.target.focus();
        //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
        // }
       // this.props._setParentState({oldList:this.props.list,vision:val});
    }
    handleRightBlur(eleInfo,e){      
        // e = e || window.event;
        // let val = e.target.value;

        // if(val==='' || val==='--' || val==='-'){
        //     return;
        // }
        // if(val==='1.' || val==='2.'){  //因为下面语句判断 会将1./2. 转换成1/2 所以就符合要求了  所以这里对这两个数做特别的处理
        //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
        // }
        // val = val*1;
        // if(isNaN(val)){
        //     e.target.focus();
        //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
        // }else if(val<0.1 || val>2){
        //     e.target.focus();
        //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
        // }
       // this.props._setParentState({oldList:this.props.list,vision:val});
    }
    render(){
        let list = this.props.list;
        let edit = this.props.edit;

        console.log("list-main",list,edit);
        // let list = this.state.list || [];

        let tr = list.map((ele,i,self)=>{            
            let {dataId,studentId,createDate,studentName,gradeName,className,sex,age,leftVision,leftAbnormal,rightVision,rightAbnormal} = ele;
            let singleDeviceInfo = JSON.parse(JSON.stringify(ele));

            let num;
            if(this.props.pageIndex==1){
                num=i+1;
            }else{
                num = (this.props.pageIndex-1)*20+i+1;
            }
         
            let deleteHtml = null;
          
            let styles = {
                width: 60,
                height: 60,
                margin: '0 auto'
            };
            // if(leftVision==null) {leftVision=''}
            // if(rightVision==null) {rightVision=''}
            // console.log("leftVision",leftVision,'右眼',rightVision,'类型',parseInt(leftVision))
            // console.log("leftVision",leftVision,edit);
            debugger;
            if(leftVision==null){leftVision='';}
            if(rightVision==null){rightVision='';}
 

            if( leftVision==='0' || leftVision==='0.' ||  leftVision==='1.' || leftVision==='2.'  || leftVision==='3.'  || leftVision==='4.'  || leftVision==='5.' || leftVision==='6.' || leftVision==='7.' || leftVision==='8.'  || leftVision==='9.'){
                leftVision=leftVision;
            }else{
                if((leftVision==='1' && edit===1) || (leftVision ==='2' && edit===1) || (leftVision==='3' && edit===1) || (leftVision==='4' && edit===1) || (leftVision==='5' && edit===1) || (leftVision==='6' && edit===1) || (leftVision==='7' && edit===1) || (leftVision==='8' && edit===1) || (leftVision==='9' && edit===1)){
                    // leftVision = leftVision.toFixed(1);
                    // console.log("修改左眼视力--所以不做处理");
                 }else if(leftVision===null || leftVision===''){
                     // console.log("leftVision--空");
                 }else{
                    if(leftVision==='1' || leftVision==='2' || leftVision===1 || leftVision===2){
                         leftVision = parseFloat(leftVision);
                         leftVision = leftVision.toFixed(1);
                    }

                 }
            }
                
            if( rightVision==='0' || rightVision==='0.' || rightVision==='1.' || rightVision==='2.'  || rightVision==='3.'  || rightVision==='4.'  || rightVision==='5.' || rightVision==='6.' || rightVision==='7.' || rightVision==='8.'  || rightVision==='9.'){
                rightVision=rightVision;
            }else{
                if((rightVision==='1' && edit===1) || (rightVision ==='2' && edit===1) || (rightVision==='3' && edit===1) || (rightVision==='4' && edit===1) || (rightVision==='5' && edit===1) || (rightVision==='6' && edit===1) || (rightVision==='7' && edit===1) || (rightVision==='8' && edit===1) || (rightVision==='9' && edit===1)){
                    // leftVision = leftVision.toFixed(1);
                    // console.log("修改右眼视力--所以不做处理");
                 }else if(rightVision===null || rightVision===''){
                     // console.log("leftVision--空");
                 }else{
                    if(rightVision==='1' || rightVision==='2' || rightVision===1 || rightVision===2){
                    rightVision = parseFloat(rightVision);
                    rightVision = rightVision.toFixed(1);
                   }
                 }
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
                <td>
                    {/*<input type="text"    className="batchIn-td"  maxLength="12" value={leftVision} onChange={this.handleLeft.bind(this,ele)}   style={{width: 100,height: 25}}/>*/}
                    <input type="text"    className="batchIn-td"  maxLength="12" value={leftVision} onBlur={this.handleLeftBlur.bind(this,ele)} onChange={this.handleLeft.bind(this,ele,num)}   style={{width: 100,height: 25,color:leftAbnormal==0?'red':''}}/>
                </td>
                <td>
                     {/*<input type="text"    className="batchIn-td"  maxLength="12" value={rightVision} onChange={this.handleRight.bind(this,ele)}   style={{width: 100,height: 25}}/>*/}
                     <input type="text"    className="batchIn-td"  maxLength="12" value={rightVision} onBlur={this.handleRightBlur.bind(this,ele)} onChange={this.handleRight.bind(this,ele,num)}   style={{width: 100,height: 25,color:rightAbnormal==0?'red':''}}/>
                </td>
           
            </tr>);
        });
        return (<tbody>{tr}</tbody>);
    }
}


//选取测量日期弹窗
class AddMod extends Component{
    state = {
       beginTime:moment(),
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
        this.props._setTipsParse({beginTime:date});
    }
    render(){
        let judge = this.props.judge?this.props.judge:'';
        return (
            <form className='formObj'>
                <p style={{height:20,textAlign:'center',color:'red'}}>{judge}</p>
                <div className="batchIn-data">
                    <span className='het-datepicker'>测量日期：
                        <DatePicker peekNextMonth showMonthDropdown  showYearDropdown dropdownMode="select"  dateFormat='YYYY-MM-DD' selected={this.state.beginTime} className='het-input-text-s2' onChange={this.handleDateChange.bind(this, 'begin')} locale='zh-cn' />
                    </span>
                </div>
            </form>
        );
    }
}

//保存之后的提示TipMod
class TipMod extends Component{
    state = {
       beginTime:moment(),
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
        let judge = this.props.judge?this.props.judge:'';
        return (
            <div>
                <p className="batch-saveOK">保存成功</p>
            </div>
        );
    }
}
class BatchIn extends Component{
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
            sex:'',
            studentName:'',
            abnormal:1,
            checked:true,
            isShowTips:true,    //一开始就显示这个
            beginTime:moment(),
            edit:2  //这个用来判断视力列表渲染时，是渲染修改(edit:1)的还是渲染接口(edit:2)的。
        };

        this.queryList = this.queryList.bind(this);
        this.unlisten = [];
        this.unlisten.push(Stores.getStudentList.listen(this.onGetStudentList.bind(this)));         //批量录入视力的获取学生分页接口
        this.unlisten.push(Stores.getGradeList.listen(this.onGetGradeList.bind(this)));             //年级管理---获取年级列表(不分页)
        this.unlisten.push(Stores.getClassListByGradeId.listen(this.onGetClassListByGradeId.bind(this)));   //根据年级获取班级列表
        this.unlisten.push(Stores.insertBatchStudentVision.listen(this.onInsertBatchStudentVision.bind(this)));   //修改学生视力信息
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    componentDidMount (){
        Actions.getGradeList();
        // Actions.getStudentList();
        Tools.scrollTop(0);
        this.props._setState({isShowWaiter: false,isShowAlert:false,isShowConfirm:false});

        // 保存初始状态值
        this.oldSearchStatus = {
            gradeId: this.state.gradeId,
            classId: this.state.classId,
            beginTime:this.state.beginTime,
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
        let opts = {
                pageIndex:1,
                pageRows:20,
                date:this.state.beginTime.format('YYYY-MM-DD'),
                // endDate:this.state.endTime.format('YYYY-MM-DD'),
                gradeId:this.state.gradeId,
                classId:this.state.classId,
                sex:this.state.sex,
                studentName:this.state.studentName,    
        };
        opts = Tools.filterParam(opts);
        this.setState({isDisabledSearch: true},()=>{          
            Actions.getStudentList(opts,callback);
        }); 
        Tools.scrollTop(0);
    }
    _setTipsParse(state,fn){      //选取测量日期弹窗---子组件---传出来的值
        this.setState(state,fn);
    }
    _setAddParse(state,fn){      //添加设备---子组件---传出来的值
        this.setState(state,fn);
    }
    submit(){
        var newList = [];
        console.log("点击保存",this.state.oldList);
        debugger;
        if(this.state.oldList){
                 this.state.oldList.map((item, i)=>{
                    if(item.changed===1){
                        console.log("123",i,'---',item);
                

                        if(item.leftVision==''){item.leftVision=null;}
                        if(item.rightVision==''){item.rightVision=null;}

                        if((item.leftVision==null && item.rightVision!=null) || (item.leftVision!=null && item.rightVision==null) || (item.leftVision=='' && item.rightVision!=null) || (item.leftVision!=null && item.rightVision=='') ){
                            this.props._setState({isShowAlert: true,messageAlert:'每位学生的左眼视力、右眼视力应该都填写或者都不填写'});
                            return;
                        }

                            let reg9 = /^[0-9]+.?[0-9]+$/;    //判断是否是数字,但是这里 像0. 的就不符合 像1 2 3就是false
                            let reg10 = /^[0-9]+.?[0-9]*$/;    //所以上面是判断0. 这个不可以  然后这个是再判断1,2,3  可以
                            if(item.leftVision>=0.1 && item.leftVision<=2){
                                if(reg9.test(item.leftVision)){
                                    console.log("左眼符合条件");
                                }else{
                                    if (reg10.test(item.leftVision)) {
                                        console.log("左眼符合条件");
                                     }else{
                                        this.props._setState({isShowAlert: true,messageAlert:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                                        return;     
                                     }


                                }    
                            }else{
                                if(item.leftVision!=null){
                                    this.props._setState({isShowAlert: true,messageAlert:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                                    return;
                                }
                            }

                            if(item.rightVision>=0.1 && item.rightVision<=2){
                                if(reg9.test(item.rightVision)){
                                    console.log("左眼符合条件");
                                }else{
                                    if (reg10.test(item.rightVision)) {
                                        console.log("左眼符合条件");
                                    }else{
                                        this.props._setState({isShowAlert: true,messageAlert:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                                        return;     
                                    }

                                  
                                }    
                            }else{
                                if(item.rightVision!=null){
                                    this.props._setState({isShowAlert: true,messageAlert:'视力区间不正确,视力区间应为0.1~2.0,否则保存无效'});
                                    return;
                                }
                            }

                            newList.push({
                                studentId:item.studentId,
                                leftVision:item.leftVision,
                                rightVision:item.rightVision,
                                measureTime:item.createDate
                            })


                    }
                });


                                // newList.push({
                                //     studentId:item.studentId,
                                //     leftVision:item.leftVision,
                                //     rightVision:item.rightVision,
                                //     measureTime:item.createDate
                                // })
                console.log("newList",newList,'123',newList.length);
                if(newList.length===0){   //如果上面遍历的有错误,没有newList没有push值  那么newList还是空的  所以不提交
                    return;
                }else{
                    Actions.insertBatchStudentVision({data:JSON.stringify(newList)});

                }
                



        }else{
            this.context.router.push({pathname:'/main/vision/list'});
        } 
       
        // let submitList=[];
        // submitList.push(newList);
        console.log("newList-", newList);
    }
    onInsertBatchStudentVision(model,callback){
        console.log("批量添加学生视力信息",model);
        let code = model.code;
        switch(code){
            case 0:  
                console.log("批量添加学生视力信息成功");
                let time = this.state.beginTime;
                let startDate = time.format('YYYY-MM-DD');
                this.setState({isShowTips2:true});
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
    saveStateToHistory(){  // 点击查询时保存筛选字段到历史记录   
        let curQuery = {
            gradeId: this.state.gradeId,
            classId: this.state.classId,
            date:this.state.beginTime.format('YYYY-MM-DD'),
            studentName:this.state.studentName,
            textNo:this.state.textNo
        };
        curQuery = Tools.filterParam(curQuery);  
        this.context.router.push({ pathname: '/main/vision/batchIn',query:curQuery});
    }
    onGetStudentList(model,callback){  // 批量录入视力的获取学生分页接口
        let code = model.code;
        this.setState({isDisabledSearch: false});
        switch(code){
            case 0:  
                    let data = model.data;
                    this.props._setState({isShowWaiter: false});
                    this.setState({studentReportList: data,isLoaded: true,isDisabledSearch:false},()=>{
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
    _setParentState(state,fn){
        debugger;
        console.log("_setParentState",state,fn);

        
        // if(state.vision==''){
           this.setState(state,fn);
        //     return;
        //  }
        // if(state.vision==2){
        //     this.setState(state,fn);
        //     return;
        // }
        // if(state.vision=='-'){
        //     this.setState(state,fn);
        //     return;
        // }
        // if(state.vision==0){
        //     this.setState(state,fn);
        //     return;
        // }
        // if(state.vision==0.1){
        //     this.setState(state,fn);
        //     return;
        // }
   
        //  console.log("如果为空,还会走下去吗");
                // if(state.vision<2){
                //     if(state.vision>0.1){
                //         this.setState(state,fn);
                //     }else{
                //         this.props._setState({isShowAlert: true,messageAlert: state.vision+'视力格式不正确，视力区间为0.1~2.0'});
                //         return;
                //     }
                // }else{
                //     this.props._setState({isShowAlert: true,messageAlert: '视力格式不正确，视力区间为0.1~2.0'});
                //     return;
                // }
        
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
        this.setState({classId:val});
    }
    handleSexLookUp(e){  //性别下拉框
        e = e || window.event;   
        let val = e.target.value;
        if(val==1){
            this.setState({sex:1});
        }else if(val==2){
            this.setState({sex:2});
        }else{
            this.setState({sex:''});
        }
    }
    handleReset(){          //重置
        this.setState(this.oldSearchStatus);
        this.setState({classList:''});
        Actions.getStudentList({
            // status:0,   
            pageIndex:1,
            pageRows:20,
            date:this.state.beginTime.format('YYYY-MM-DD'),
           
        });
    }
    handleNameNumber(e){
        e = e || window.event;
        let val = e.target.value;   
        // this.setState({brandName:val,textNo:val});  //查询-学号/姓名->textNo
        this.setState({studentName:val});
    }
    tipsCallback(type){
        let time = this.state.beginTime;
        let startDate = time.format('YYYY-MM-DD');
        this.setState({isShowTips: false});  //点击取消按钮--隐藏弹框

        if(type == 'confirm'){
                // this.props._setState({isShowWaiter: true,waiterText: '正在添加...'},()=>{
                Actions.getStudentList({
                    pageIndex:1,
                    pageRows:20,
                    date:startDate
                });
                // });
            }else{//点击取消---将这次选择的清空
                this.setState({isShowTips: false});  //点击取消按钮--隐藏弹框
                this.context.router.push({pathname:'/main/vision/list'});
        }
    }
    tipsLeaveBeforeCallback(type){
        return true;
    }
    tipsCallback2(type){    //点击保存后弹窗--确定返回视力list页
         this.setState({isShowTips: false});  //点击取消按钮--隐藏弹框
         this.context.router.goBack();
    }
    tipsLeaveBeforeCallback2(type){
        return true;
    }
    returnBtn(){
        this.context.router.push({pathname:'/main/vision/list'});
    }
    render (){
        let th = ['序号','测量日期','学号','姓名','年级','班级','性别','年龄','左眼（正常值1.0-2.0）','右眼（正常值1.0-2.0）'];
        let isLoaded = this.state.isLoaded;
        let studentReportListState = this.state.studentReportList || [];
        let studentReportList;
        if(this.state.oldList){
            studentReportList = this.state.oldList;
        }else{
            studentReportList = studentReportListState.list || [];
        }
        
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
    
        if(isLoaded){
            if(len > 0){
                 list = (<List list={studentReportList}  _setState={this.props._setState}  edit={this.state.edit} pageIndex={pager.pageIndex} currPageRows={pager.currPageRows}  beginTime={this.state.beginTime}   _setParentState={this._setParentState.bind(this)}    queryList={this.queryList}     isHasDeleteRight={true} />);
                 pagerContainer = (<PagerContainer  pager={pager} pageRows={this.props.pageRows} location={this.props.location} />);
            }else{ 
                list = (<tbody><tr><td colSpan={10} style={{padding: 0,border: 0}}><EmptyCnt content='没有符合条件的数据信息' /></td></tr></tbody>);
            }
        }else{
            list = (<tbody><tr><td colSpan={10} style={{padding: 0,border: 0}}><WaiterLoad content='正在加载......' /></td></tr></tbody>);
        }


       //提示
        let addMod = (<AddMod _setTipsParse={this._setTipsParse.bind(this)}  importReturn={this.state.importReturn}   judge={this.state.judge?this.state.judge:''}   />);
        let tips = (   
            <Confirm  confirmCallback={this.tipsCallback.bind(this,'confirm')} cancelCallback={this.tipsCallback.bind(this)}  leaveBeforeCallback={this.tipsLeaveBeforeCallback.bind(this,'confirm')}    title='选取测量日期'  contentHeight={300} >
                {addMod}
            </Confirm>
        );
        let tipsshow = this.state.isShowTips?tips:null;


       //提示
        let addMod2 = (<TipMod _setTipsParse={this._setTipsParse.bind(this)}  msgList={this.state.msgList} importReturn={this.state.importReturn}   judge={this.state.judge?this.state.judge:''}   />);
        let tips2 = (   
            <ConfirmTwo  confirmCallback={this.tipsCallback2.bind(this,'confirm')} cancelCallback={this.tipsCallback2.bind(this)}  leaveBeforeCallback={this.tipsLeaveBeforeCallback2.bind(this,'confirm')}    title='提示'  contentHeight={150} >
                {addMod2}
            </ConfirmTwo>
        );
        let tipsshow2 = this.state.isShowTips2?tips2:null;



        let studentName = this.state.studentName || '';
        let gradeId = this.state.gradeId || '';
        let classId = this.state.classId || '';

        let sex = this.state.sex;
        let check = this.state.check || '';
        let checked = this.state.checked || true;

        console.log("main--",this.state);

        return (
            <div>
                <Title title='批量录入视力' buttonText='回收站' isShowButton={false}   />
                <hr />  
                <div >
                  <span className="saveBtn" onClick={this.submit.bind(this)}>保存</span>
                  <span className="saveBtn batchInReturnBtn" onClick={this.returnBtn.bind(this)}>返回</span>
                </div>
                <div className='het-filter formObj hel-formObj hel-temperature'>
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
                    {tipsshow}
                    {tipsshow2}
                </div>
            </div>
        );
    }
}


module.exports = BatchIn;
    