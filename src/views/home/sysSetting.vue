<!-- 系统管理 -->
<template>
  <div>    
  <el-tabs v-model="activeName"   type="card">
    <el-tab-pane label="站点信息" name="site">
        <div class="pane_item">
        <el-form :model="setData.site"  label-width="100px" :rules="rules" ref="siteForm">
          <el-form-item label="站点名称">
              <el-input  v-model="setData.site.name" ></el-input>
          </el-form-item>
           <el-form-item label="备案信息" >
              <el-input  v-model="setData.site.register_record" ></el-input>
          </el-form-item>
           <el-form-item label="版权信息" >
              <el-input  v-model="setData.site.copyright" ></el-input>
          </el-form-item>
           <el-form-item label="统计代码" >
              <el-input  v-model="setData.site.statistics_code" ></el-input>
          </el-form-item>
           <el-form-item label="允许跨域站点" >
              <el-input  type="textarea" v-model="setData.site.allow_origin" ></el-input>
          </el-form-item>
          <el-form-item class="tr">
               <el-button class="w100" type="primary" :loading="btnLoding.site"  @click="submitForm('siteForm')">提交</el-button>
          </el-form-item>
        </el-form>
        </div>
    </el-tab-pane>

    <el-tab-pane label="oss配置" name="oss">
        <div class="pane_item">
         <el-form :model="setData.oss"  label-width="100px" :rules="rules" ref="ossForm">
          <el-form-item label="APP_ID" >
              <el-input  v-model="setData.oss.id" ></el-input>
          </el-form-item>
           <el-form-item label="secret" >
              <el-input  v-model="setData.oss.key" ></el-input>
          </el-form-item>
           <el-form-item label="域名" >
              <el-input  v-model="setData.oss.host" ></el-input>
          </el-form-item>
          <el-form-item class="tr">
               <el-button class="w100" type="primary"  :loading="btnLoding.oss" @click="submitForm('ossForm')">提交</el-button>
          </el-form-item>
        </el-form>
        </div>
    </el-tab-pane>

    <el-tab-pane label="upload配置" name="upload">
        <div class="pane_item">
         <el-form :model="setData.upload"  label-width="100px" :rules="rules" ref="uploadForm">
          <el-form-item label="上传类型" >
              <el-select v-model="setData.upload.upload_type" placeholder="活动区域">
                <el-option label="系统直传" :value='1'></el-option>
                <el-option label="阿里OSS" :value='2'></el-option>
              </el-select>
          </el-form-item>
           <el-form-item label="允许场景场景" >
              <el-input  v-model="setData.upload.scenes" ></el-input>
          </el-form-item>
          <el-form-item class="tr">
               <el-button class="w100" type="primary" :loading="btnLoding.upload" @click="submitForm('uploadForm')">提交</el-button>
          </el-form-item>
        </el-form>
        </div>
    </el-tab-pane>

    
  </el-tabs>
  </div>
</template>

<script>
import * as api from '../../api/index'
import * as utils from '../../utils' 
export default {
  name:'sysSrtting',
  mounted(){
      console.log(Object.keys(this.setData))
      this.getSysInfo(Object.keys(this.setData))
  },
  data () {
    return {
        activeName: 'site',
        btnLoding:{
            site:false,
            oss:false,
            upload:false

        },
        setData:{
            site :{
                name:'',  //站点名称
                register_record:'',  //备案信息
                copyright:'',  //版权信息
                statistics_code:'',  //统计代码
                allow_origin:''   //允许跨域站点
            },
            oss :{
               id:'', //app-id
               key:'', //secret
               host:'' //域名
            },
            upload:{
                upload_type:'', //上传类型  1.系统直传 2.啊里OSS
                scenes:'' //允许场景场景
            }

        },

        rules:{
            name: [{ required: true, message: '输入站点名字', trigger: 'change' }]
             }

    }
  },
  methods: {
      //提交设置
      submitForm(formName){
      this.$refs[formName].validate((valid)=>{
          if (valid) {
            console.log('submit!')
            let key = formName.replace('Form','')
            let obj={}
            obj[key]=JSON.stringify(this.setData[key])
            this.btnLoding[key]=true
            this.setSysInfo(obj).then(res=>{
                this.getSysInfo([key])
                this.btnLoding[key]=false
            })
          } else {
            console.log('error submit!!')
            return false
          }
      })
      },

      //获取系统设置信息
      getSysInfo(arr){
          api.getSysInfo(arr).then(res=>{
              console.log(res)
              let items = res.data
              for(let i in items){
                 this.setData[i]=utils.coverObj( this.setData[i],JSON.parse(items[i]))   
              }
          })
      },

      //设置更改系统信息
      setSysInfo(data){
        return  api.SetSysInfo(data).then(res=>{
              console.log(res)
              if(res.code==0){
                 this.$message({message: '修改成功',type: 'success'})
              }else{
                 this.$message({message: '修改失败，请稍后再试',type: 'warning'})
              }
              return res      
          })
      }
      
    }
}

</script>
<style lang='scss' scoped>
.pane_item{
    width: 500px;
}
</style>