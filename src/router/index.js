import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/index/index'},
    { path: '/404', component: _import('errorPage/404')},
    { path: '/401', component: _import('errorPage/401')},
    { path: '/login',name: 'login', component: _import('login/index')}
  ]
})
