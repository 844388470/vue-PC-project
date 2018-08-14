// import { constantRouterMap } from '@/router'

const _import = require('../../router/_import_' + process.env.NODE_ENV)

function addRouter(menulist) {
    let menu=JSON.parse(menulist)
    let navlist=[]
    for(let i in menu){
      if(menu[i].children&&menu[i].children.length!==0){
        navlist.push({
          name: menu[i].name,
          path: menu[i].path,
          component: _import('index'),
          icon: menu[i].icon,
          meta:{menu:true},
          radius: menu[i].is_hidden===0,
          // icon: 'el-icon-location',
          children: []
        })
        for(let j in menu[i].children){
          if(menu[i].children[j].children&&menu[i].children[j].children.length!==0){
            navlist[navlist.length-1].children.push({
              path: menu[i].children[j].path,
              name:menu[i].children[j].name,
              meta:{menu:true},
              radius:menu[i].children[j].is_hidden===0,
              component: _import('layer'),children:[]
            })
            for(let k in menu[i].children[j].children){
              navlist[navlist.length-1].children[navlist[navlist.length-1].children.length-1].children.push({
                path: menu[i].children[j].children[k].path,
                name:menu[i].children[j].children[k].name,
                radius:menu[i].children[j].children[k].is_hidden===0,
                component: _import(menu[i].children[j].children[k].rel),
                meta:{permissions:menu[i].children[j].children[k].permissions?menu[i].children[j].children[k].permissions:[]}
              })
            }
          }else{
            navlist[navlist.length-1].children.push({
              path: menu[i].children[j].path,
              name:menu[i].children[j].name,
              radius:menu[i].children[j].is_hidden===0,
              component: _import(menu[i].children[j].rel),
              children:[],
              meta:{permissions:menu[i].children[j].permissions?menu[i].children[j].permissions:[]}
            })
          }
        }
      }else{
        navlist.push({
          path: menu[i].path,
          component: _import('index'),
          radius: menu[i].is_hidden === 0,
          redirect: menu[i].path+'/index',
          icon: menu[i].icon,
          children: [{path: 'index',name:menu[i].name,radius: menu[i].is_hidden === 0,component: _import(menu[i].rel),meta:{permissions:menu[i].permissions?menu[i].permissions:[]}}]
        })
      }
    }
    navlist.unshift({
      path: '/index',
      component: _import('index'),
      radius:true,
      redirect: '/index/index',
      icon: 'shouye',
      children: [{path: 'index',name:'首页',radius:true,component: _import('home/homepage')}]
    })
    navlist.push({
      path:'*',component: _import('errorPage/404')
    })
    return navlist
}

const permission = {
  state: {
    addRouters: sessionStorage.getItem('addRouters') ? JSON.parse(sessionStorage.getItem('addRouters')) : []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      sessionStorage.setItem('addRouters', JSON.stringify(routers))
      state.addRouters = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        var accessedRouters = addRouter(JSON.stringify(data.data))
        commit('SET_ROUTERS', data)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
