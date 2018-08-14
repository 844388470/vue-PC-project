<!-- by your name -->
<template>
  <div class="main">
    <div class="sidebar" :style="{width:sidebarWidth,'overflow':'auto'}">
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo" text-color="#fff" active-text-color="rgb(64, 158, 255)" background-color="#304156" :collapse="isCollapse">
          <template  v-for="(item,index) in routerList">
            <router-link v-if="item.children&&item.children.length===1 && item.radius &&!item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.name">
              <el-menu-item :index="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown'>
                <i :class="'icon iconfont '+item.icon"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </router-link>

            <el-submenu v-if="item.children&& !(item.children.length===1 &&!item.children[0].children)&& item.radius" :index="item.path" :key="item.name">
              <template slot="title">
                <i :class="'icon iconfont '+item.icon"></i>
                <span slot="title">{{item.name}}</span>
              </template>

              <template v-for="child in item.children">

                <el-submenu v-if="child.children.length>0&&child.radius" :index="item.path+'/'+child.path" :key="child.name">
                  <template slot="title">
                    <i :class="'icon iconfont '+child.icon"></i>
                    <span slot="title">{{child.name}}</span>
                  </template>

                  <template v-for="son in child.children">
                    <router-link :to="item.path+'/'+child.path+'/'+son.path" :key="son.name" v-if="son.radius">
                      <el-menu-item :index="item.path+'/'+child.path+'/'+son.path">
                        <i :class="son.icon"></i>
                        <span slot="title">{{son.name}}</span>
                      </el-menu-item>
                    </router-link>
                  </template>
                </el-submenu>

                <router-link v-if="!child.children.length>0&&child.radius" :to="item.path+'/'+child.path" :key="child.name">
                  <el-menu-item :index="item.path+'/'+child.path">
                    <i :class="child.icon"></i>
                    <span slot="title">{{child.name}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </el-submenu>
          </template>
      </el-menu> 
    </div>

    <div class="content " :style="{'margin-left':sidebarWidth}">
      <div class="topBar">
        <el-button @click="isCollapse=!isCollapse" type="text" class="iconfont icon-other collapse fl"></el-button>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="fl topBar-title">
          <el-breadcrumb-item :to="{ path: '/index/index' }" >护理管理平台</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in $route.matched" v-if="item.name" :key="item.path" class="no-redirect">{{item.name}}</el-breadcrumb-item>    
        </el-breadcrumb>
        <el-dropdown class="fr" @command="handleCommand">
          <el-button icon="el-icon-setting" class="fr btn-loading" size="medium"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a"><b>修改密码</b></el-dropdown-item>
            <el-dropdown-item command="b"><b>退出登录</b></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--el-button @click="signOut" style="padding: 6px 20px;margin:11px 10px 11px 0;" class="fr">退出登录</el-button-->
        <el-button :loading="loading" v-if="loading" size="medium" class="fr btn-loading"></el-button>
      </div>
      
     
      <div class="viewTag" >  
          <el-tag v-for="(tag,index) in viewTagList" :key="tag.name" closable :class="{active:tag.path==$route.path}" 
          @close="handleClose(index,tag.path)"
          @click.native="jump(tag.path)"
          >{{tag.name}} </el-tag>    
      </div>
      
      <el-dialog
          class="editpass"
          :visible.sync="editpassstate"
          width="400px"
          fullscreen
          center>
              <div style="height:100%">
                  <el-scrollbar style="height:100%;" ref="scrollbar">
                      <div element-loading-text="拼命加载中">
                          <el-form :model="passform" label-width="100px" label-position="left" :rules="passformrules" ref="passform">
                              <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                                  <el-col :span="24">
                                      <el-form-item label="旧密码" prop="old_password">
                                          <el-input  v-model="passform.old_password" placeholder="旧密码"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="24">
                                      <el-form-item label="新密码" prop="password">
                                          <el-input type="password" v-model="passform.password" placeholder="新密码"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="24">
                                      <el-form-item label="重复新密码" prop="confirm">
                                          <el-input type="password" v-model="passform.confirm" placeholder="重复新密码"></el-input>
                                      </el-form-item>
                                  </el-col>
                              </el-row>
                          </el-form>
                      </div>
                  </el-scrollbar>
              </div>
          <span slot="footer" class="dialog-footer">
              <el-button size="medium" @click="editpassword" type="primary" :loading="loading">确认</el-button>
              <el-button size="medium" @click="editpassstate = false">取 消</el-button>
          </span>
      </el-dialog>

      
     <div class="routerView">
       <transition name="el-fade-in-linear">
        <router-view  v-show="show"></router-view>
      </transition>
     </div>
    
      
      
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters,mapActions } from 'vuex'
import * as api from '@/api/login'
export default {
  name:'index',
  data() {
    return {
      show:true,
      isCollapse: false,
      sidebarWidth: '200px',
      editpassstate:false,
      passform:{
        old_password:'',
        password:'',
        confirm:''
      },
      passformrules:{
        old_password:[{required:true,message:'请输入旧密码'}],
        password:[{required:true,message:'请输入新密码'}],
        confirm:[{required:true,message:'请再次输入新密码'}]
      }
    }
  },
  mounted() {
    console.log(this.$route)
  },
  methods: {
    ...mapActions(['setViewTagList']),
    //导航栏跳转
     pushRouter(val) {
      if(this.viewTagList.filter(t=> t.path==val.path ).length==0){
        this.viewTagList.push({'name':val.name,'path':val.path})
        this.setViewTagList(this.viewTagList)
      }
    },
    jump(path){
      if(path!==this.$route.path){
        this.$router.push(path)
      }
    },
    //tag 关闭
    handleClose(index,path){
      this.viewTagList.splice(index,1)
      this.setViewTagList(this.viewTagList)
      if(this.viewTagList.length!==0){
        if(this.$route.path==path){
          this.$router.push(this.viewTagList[this.viewTagList.length-1].path)
        }
      }else{
        this.$router.push('/index/index')
      }
    },
    signOut(){
      this.$confirm('是否确认退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(_ => {
          api.logout().then(res=>{
              sessionStorage.clear()
              window.location.reload()
          }).catch(()=>{})
      }).catch(_ => {})
    },
    editpassword(){
      this.$refs['passform'].validate((valid) => {
          if (valid) {
              if(this.passform.password!==this.passform.confirm){
                this.$message({
                    message: '重复新密码不正确',
                    type: 'warning'
                })
                return 
              }
              api.editpassword(this.passform).then(res=>{
                  this.editpassstate=false
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                })
              }).catch(()=>{})
          } else {
              return false
          }
      })
    },
    handleCommand(command){
      if(command=='a'){
        this.passform={
          old_password:'',
          password:'',
          confirm:''
        }
        this.editpassstate=true
      }else if(command=='b'){
        this.signOut()
      }
    }
  },
  watch: {
    isCollapse(v) {
      this.sidebarWidth = v ? '64px' : '200px' + ' !important'
    },
    $route(val) {
      this.pushRouter(val)
    }
  },
  computed: {
    ...mapState(['loading', 'routerList','viewTagList']),
    ...mapGetters(['loading', 'routerList','viewTagList'])
  }
}
</script>
<style lang='scss' scoped>

.main {
  position: relative;
  height: 100%;
  width: 100%;
  background: #eee;
}
.main .icon{font-size: 21px;margin-right: 5px;width: 24px;vertical-align: middle }
.main a{text-decoration:none};
.sidebar {
  transition: width 0.28s;
  width: 200px;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background-color: #304156;
  box-sizing: border-box;
}

.sidebar::-webkit-scrollbar {
  width: 0px;
}

.content {
  min-height: 100%;
  -webkit-transition: margin-left 0.28s;
  transition: margin-left 0.28s;
  margin-left: 200px;
  background: #fff;
}

.topBar {
  line-height: 50px;
  height: 50px;
  border-bottom: solid 1px #e6e6e6;
}

.collapse {
  font-size: 25px;
  color: #000;
  padding-left: 10px;
}

.topBar-title {
  color: #97a8be;
  font-size: 14px;
  padding-left: 20px;
  line-height: 50px;
}

.btn-loading {
  margin-top: 5px;
  margin-right: 10px;
  font-size: 25px;
  padding: 5px 10px !important;
}
.routerView {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}
.viewTag{
  background: #fff;
    min-height: 30px;
    padding: 1px 0 5px 10px;
    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.el-tag  {
    cursor: pointer;
    margin-left: 15px;
    display: inline-block;
    position: relative;
    height: 25px;
    line-height: 25px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 5px;
  }
  .el-tag.active{
    background-color: #42b983;
    color: #fff;
    border-color: #42b983;
  }
  
</style>
<style >
.main .no-redirect .el-breadcrumb__inner{
      color: #606266;font-weight: 500;
      cursor: text;
  }
  .editpass .el-dialog.is-fullscreen.el-dialog--center{height:400px;top:25%}
</style>
