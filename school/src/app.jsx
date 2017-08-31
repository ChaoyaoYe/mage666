// 公共模块
import '../components/public/accordion/accordion';
import '../static/css/main';
import '../static/js/plugins/kindeditor-4.1.10/themes/simple/simple.css';
import '../static/css/zTreeStyle/zTreeStyle.css';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory} from 'react-router';

let container = document.getElementById('container');

// 组件模块
import App from '../components/App';
import Login from '../components/Login';  // 登录页
let nomatch = require('../routes/nomatch');
let main = require('../routes/main');

// 根路由树
const rootRoute = {
    path: '/',
    component: App,
    indexRoute: {
        component: Login
    },
    childRoutes: [
        main,
        nomatch
    ] 
};

let router = (<Router routes={rootRoute} history={hashHistory} />);

render(router, container);








