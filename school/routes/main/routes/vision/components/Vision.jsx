/*
*  内容展示模块
*/
import React, {PropTypes,Component} from 'react';
import { Actions, Stores} from '../../../../../components/fetchData';
import _isEqual from 'lodash.isequal';
import {Link} from 'react-router';

require('es6-promise').polyfill();
require('isomorphic-fetch');

let myHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain'
});

fetch('/mock/campus/gradeManage/getGradeList').then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then(function(stories) {
        console.log(stories);
    });



class Breadcrumb extends Component{
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    render (){
        let breadcrumb = this.props.breadcrumb;

        breadcrumb = breadcrumb.map((ele,i,self)=>{
            let len = self.length;
            if(i == len-1){
                return (<span key={i} className='currentItem'>{ele}</span>);
            }
            return (<span key={i}><b>{ele}</b>
                <em className='iconfont icon-jiantou1'></em></span>
            );
        });        
        return (<div className='breadcrumb'>
            <Link to={{pathname: '/main'}}><i className='iconfont icon-shouye'></i>首页</Link>
            <em className='iconfont icon-jiantou1'></em>
            {breadcrumb}
        </div>);
    }
}

class BreadcrumbHome extends Component{
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    render (){
        return (<div className='breadcrumb'>
            <Link to={{pathname: '/main'}}><i className='iconfont icon-shouye'></i>首页</Link>
        </div>);
    }
}



class Vision extends Component{
    state = {
    };
    static contextTypes = { 
      router: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this.jump = this.jump.bind(this);
    }
    shouldComponentUpdate (nextProps, nextState) {
      return !_isEqual(nextState, this.state) || !_isEqual(nextProps, this.props);
    }
    componentDidMount () {
        this.jump(this.props);
        Actions.getGradeList();
    }
    componentWillReceiveProps(nextProps) {
        this.jump(nextProps);
    }
    jump(props){
        let pathname = props.location.pathname;
        if(pathname == '/main/vision' || pathname == '/main/vision/'){
            this.context.router.push({ pathname: '/main/vision/list'});
        }
    }
    render (){   
        let {children,_setState,authResourceList} = this.props;
        let pathname = this.props.location.pathname;
        let props = {
            _setState: _setState,
            authResourceList: authResourceList
        };

        if(children){
            children = React.cloneElement(children,props);
        }

        let breadcrumb = null;
        switch(pathname){
            case '/main/homePage/schoolList':
                breadcrumb = ['首页','校园管理'];
            break;
            case '/main/homePage/equipment':
                breadcrumb = ['首页','设备管理'];
            break;
            case '/main/homePage/system':
                breadcrumb = ['首页','系统管理'];
            break;
            case '/main/homePage/test':
                breadcrumb = ['首页','系统管理'];
            break;
            case '/main/vision/list':
                breadcrumb = ['学生健康报表','视力'];
            break;
            case '/main/vision/batchIn':
                breadcrumb = ['学生健康报表','视力','批量录入视力'];
            break;
        }

        let breadcrumbComponent = breadcrumb ? <Breadcrumb breadcrumb={breadcrumb} /> : <BreadcrumbHome />;
        return (
            <div className='main'>
                <div>{breadcrumbComponent}</div>
                <div className='main'>
                    {/*{children}*/}
                </div>
            </div>
        );
    }
}

module.exports = Vision;
	