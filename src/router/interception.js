import router from './'
import store from '../store'
//路由拦截
let registerRouteFresh = true
const whiteList = ['/login','/404','/401']// 不重定向白名单
router.beforeEach((to, from, next) => {
    if(Number(store.getters.isLogin)){
      if (to.path === '/login') {
        next({ path: '/index' })
      } else {
        next()
      }
    }else{
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        registerRouteFresh = false
        next()
      } else {
        registerRouteFresh = false
        next('/login') 
      }
    }
  })

  router.onReady(function() {              // 刷新之后挂载路由会被清除  需要重新挂载
    if (registerRouteFresh && Number(store.getters.isLogin)==1) {
      const roles = store.getters.addRouters
      store.dispatch('GenerateRoutes', roles).then((response) => {
        // console.log(response)
        router.addRoutes(response)
      })
    }
})
