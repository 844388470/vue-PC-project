<!-- 运营数据 -->
<template>
  <div>
    <div class="mb10">
       <el-select  class="w400" v-model="formData.fk_org_id" multiple placeholder="请选择公司">
          <el-option
            v-for="item in fk_org_list"
            :key="item.pk_id"
            :label="item.name"
            :value="item.pk_id">
          </el-option>
        </el-select>

          <el-date-picker
            class="w300"
            v-model="formData.date"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份">
          </el-date-picker>
    </div>
    <div>
       <el-button type="primary"  @click="upload_excel">导出</el-button>
    </div>   
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "cookies-js";
export default {
  mounted () {
    this.fk_org_list = JSON.parse((sessionStorage.org_list))
  },
  data() {
    return {
      uploadSrc:'/operate_hospital/excel?',
      loading: false,
      formData:{
        fk_org_id:[],
        date:''
      },
      fk_org_list:[]
      
    };
  },
  methods: {

   upload_excel(){
     if(this.formData.fk_org_id.length&&this.formData.date){
        window.open(`${process.env.host}${this.uploadSrc}fk_org_id=${this.formData.fk_org_id.join(',')}&date=${this.formData.date}`)

     }else{
       this.m_warning('请选择公司和月份')
     }
  //   console.log(process.env.host)
    
   },


    // 数据导出(带优化版)
    upload_excel_ifram() {
     // this.loading = true;
      let that = this;
      var i = document.createElement("iframe");
     // window.setTimeout(showProgressAnimation, 1000);
      i.src = this.uploadSrc;
      i.style.display = "none";
      // i.style.visibility = "hidden";
      document.body.appendChild(i);

      i.onload = i.onreadystatechange = function() {
        that.loading = false;
        if (this.readyState && this.readyState != "complete") {
          that.m_error("下载失败");
          return;
        } else {
          console.log("下载完成");
        }
      }
   
   
    }
  }
};
</script>
<style lang='scss' scoped>
</style>