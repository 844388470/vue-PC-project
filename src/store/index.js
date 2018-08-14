import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import permission from './modules/permission'
import * as api from '@/api/public'

Vue.use(Vuex)

let state = {
  loading: false,
  routerList: sessionStorage['routerList'] ? JSON.parse(sessionStorage['routerList']) : [],
  viewTagList:sessionStorage['viewTagList'] ? JSON.parse(sessionStorage['viewTagList']) : [],     //tab标签
  org_list: sessionStorage['org_list'] ? JSON.parse(sessionStorage['org_list']) : [],         //公司
  hpl_list:sessionStorage['hpl_list'] ? JSON.parse(sessionStorage['hpl_list']) : [],          //type为123项目(部门)
  all_hpl_list:sessionStorage['all_hpl_list'] ? JSON.parse(sessionStorage['all_hpl_list']) : [],        //所有项目(部门)
  // dub_list:sessionStorage['dub_list'] ? JSON.parse(sessionStorage['dub_list']) : [],         //科室
  // group_list:sessionStorage['group_list'] ? JSON.parse(sessionStorage['group_list']) : [],        //护理组
  rolemenupc_list:[],                                                                        //pc权限菜单列表
  rolemenuapp_list:[],                                                                        //app权限菜单列表
  isLogin:sessionStorage['isLogin'] ? sessionStorage['isLogin'] : 0
}

let actions = {
  setLoading({ commit }, info) {
    commit('SET_LOADING', info)
  },
  setRouterList({ commit }, info) {
    commit('SET_ROUTER_LIST', info)
  },
  setViewTagList({ commit }, info) {
    commit('SET_VIEW_TAG_LIST', info)
  },
  setrolemenupc({ commit }, info) {
    return new Promise((resolve, reject) => {
      api.getAllMenuList(0).then(_=>{
          commit('SET_ROLEMENUPC_LIST', _.data)
          resolve()
      }).catch(_=>{
          reject()
      })
    })
  },
  setrolemenuapp({ commit }, info) {
    return new Promise((resolve, reject) => {
      api.getAllMenuList(1).then(_=>{
          commit('SET_ROLEMENUAPP_LIST',  _.data)
          resolve()
      }).catch(_=>{
          reject()
      })
    })
  },
  setIsLogin({ commit }, info) {
    return new Promise(resolve => {
      commit('SET_IS_LOGIN', info)
      resolve()
    })
  },
  setOHDGList({ commit }, info) {
    return new Promise((resolve, reject) => {
      let i=2
      api.getOrgList().then(_=>{
          commit('SET_ORG_LIST',  _.data)
          i--
          if(i===0){
            resolve()
          }
      }).catch(_=>{
          reject()
      })
      api.getHplList().then(_=>{
          commit('SET_HPL_LIST',  _.data)
          i--
          if(i===0){
            resolve()
          }
      }).catch(_=>{
          reject()
      })
      // api.getGroupList().then(_=>{
      //     commit('SET_GROUP_LIST',  _.data)
      //     i--
      //     if(i===0){
      //       resolve()
      //     }
      // }).catch(_=>{
      //     reject()
      // })
      // api.getDubList().then(_=>{
      //     commit('SET_DUB_LIST',  _.data)
      //     i--
      //     if(i===0){
      //       resolve()
      //     }
      // }).catch(_=>{
      //     reject()
      // })
    })
  },
  setOrgList({ commit}, info){
    return new Promise((resolve, reject) => {
      api.getOrgList().then(_=>{
          commit('SET_ORG_LIST',  _.data)
          resolve()
      }).catch(_=>{
          reject()
      })
    })
  },
  setHplList({ commit}, info){
    return new Promise((resolve, reject) => {
      api.getHplList().then(_=>{
          commit('SET_HPL_LIST',  _.data)
          resolve()
      }).catch(_=>{
          reject()
      })
    })
  }
}

let mutations = {
  SET_LOADING(state, info) {
    state.loading = info
  },
  SET_ORG_LIST(state, info) {
    sessionStorage['org_list'] = JSON.stringify(info)
    state.org_list = info
  },
  SET_HPL_LIST(state, info) {
    sessionStorage['all_hpl_list'] = JSON.stringify(info)
    state.all_hpl_list = info
    sessionStorage['hpl_list'] = JSON.stringify(info.filter(res=>[1,2,3].indexOf(res.type)!==-1))
    state.hpl_list = info.filter(res=>[1,2,3].indexOf(res.type)!==-1)
  },
  // SET_DUB_LIST(state, info) {
  //   sessionStorage['dub_list'] = JSON.stringify(info)
  //   state.dub_list = info
  // },
  // SET_GROUP_LIST(state, info) {
  //   sessionStorage['group_list'] = JSON.stringify(info)
  //   state.group_list = info
  // },
  SET_ROLEMENUPC_LIST(state, info) {
    state.rolemenupc_list = info
  },
  SET_ROLEMENUAPP_LIST(state, info) {
    state.rolemenuapp_list = info
  },
  SET_ROUTER_LIST(state, info) {
    sessionStorage['routerList'] = JSON.stringify(info)
    state.routerList = info
  },
  SET_VIEW_TAG_LIST(state, info) {
    sessionStorage['viewTagList'] = JSON.stringify(info)
    state.viewTagList = info
  },
  SET_IS_LOGIN(state, info) {
    sessionStorage['isLogin'] = info
    state.isLogin = info
  }
}
let getters = {
  loading: state => state.loading,
  routerList: state => state.routerList,
  viewTagList: state => state.viewTagList,
  isLogin:  state => state.isLogin,
  org_list:  state => state.org_list,
  hpl_list:  state => state.hpl_list,
  all_hpl_list:  state => state.all_hpl_list,
  // dub_list:  state => state.dub_list,
  // group_list:  state => state.group_list,
  rolemenupc_list:  state => state.rolemenupc_list,
  rolemenuapp_list:  state => state.rolemenuapp_list,
  addRouters: state => state.permission.addRouters
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    permission
  },
  getters})
