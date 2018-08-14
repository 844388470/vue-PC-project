import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/index/index'},
    { path: '/404', component: _import('errorPage/404')},
    { path: '/401', component: _import('errorPage/401')},
    { path: '/login',name: 'login', component: _import('login/index')},
    // { path: '/index',name: 'index', component: _import('index')},
    // {
    //   path: '/index',
    //   name: 'meun1',
    //   component: _import('index'),
    //   menu: true,
    //   icon: 'el-icon-location',
    //   meta: { index: '1' },
    //   children: [
    //     {path: '/index/meun1_1',name: 'meun1_1',component: _import('menu1/menu1_1'),meta: { index: '1-1'}},
    //     {path: '/index/meun1_2',name: 'meun1_2',component: _import('menu1/menu1_2'),meta: { index: '1-2'}},
    //     {path: '/index/meun1_3',name: 'meun1_3',component: _import('menu1/menu1_2'),meta: { index: '1-3'}}
    //   ]
    // },

    // {
    //   path: '/index',
    //   name: 'meun4',
    //   menu: true,
    //   component: _import('index'),
    //   title: 'meun4',
    //   icon: 'el-icon-location',
    //   children: [
    //     {path: '/index/meun4_1',name: 'meun4_1',component: _import('menu4/menu4'),meta: { index: '4' }}
    //   ]
    // },

    // {path:'*',redirect:'/404'}

  ]
})
