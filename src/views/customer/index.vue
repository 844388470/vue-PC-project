<!-- 客户管理 -->
<template>
  <div>
      <div class="flex">
            <div class="mr10" >
                <el-input class="w300" v-model="search_data.search" placeholder="姓名/手机/家属"></el-input>
            </div>
            <div style="width:700px">
                <selector :typename="['org','hpl']"  ref="ohgseach" :colspan="[8,8,0,8,10]" :gutter="10"></selector>
            </div>
      </div>

      <div>
           <el-button size="small" @click="m_search"  type="primary">搜索</el-button>
           <el-button size="small" @click="optionFrom(1)"  type="primary">新增</el-button>
           <el-button size="small" @click="addBathel" type="primary">评估</el-button>
           <el-button size="small" @click="bathelHandel" type="primary">历史评估</el-button>
           
      </div>
       <el-table  
         @selection-change="m_handleSelectionChange"
         @current-change="m_handleCurrentChange"
         class="mtable"
          style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
         :stripe="true" tooltip-effect="dark" :highlight-current-row='true' :data="m_list"  >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
           
            <el-table-column align="center"  prop="name" label='姓名' > </el-table-column>
            <el-table-column align="center"   prop="sex" label='性别' > 
                 <template slot-scope="scope">
                    
                {{scope.row.sex |sex }}
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="birth_day" label='出生日期' > </el-table-column>
            <el-table-column  align="center" prop="mobile" label='手机号' > </el-table-column>
            <el-table-column  align="center" prop="address" label='家庭住址' > </el-table-column>
            <el-table-column  align="center"  label='bathel评分' > 
                 <template slot-scope="scope">
                    
                {{scope.row.evaluation}} 
                <span v-show="!isNaN(Number(scope.row.evaluation))">分</span>
                <el-button v-show="!isNaN(Number(scope.row.evaluation))" @click="editBathel(scope.row)" type="text">查看</el-button>
                </template>
            </el-table-column>

             <el-table-column  align="center"  label='信息' > 
                 <template slot-scope="scope">
                <el-button @click="clickInfo(scope.row,0)"    type="text">家属</el-button>
                  <el-button @click="clickInfo(scope.row,1)" v-show="ismy"  type="text">婴儿</el-button>
                </template>
            </el-table-column>

             <el-table-column  align="center"  label='操作' > 
                 <template slot-scope="scope">
                  <el-button @click.native="editFrom(scope.row)" type="text">编辑</el-button>
                  <el-button style="color:#ff0000" @click.native="m_del(scope.row)" type="text">删除</el-button>
                </template>
            </el-table-column>  
        </el-table>
         <Paging class="mt20 mb30" :pageIndex="m_page.page" :pageSize="m_page.limit" :pageTotal="m_page.total" @changeSize="m_changesize" @changeIndex="m_changeindex"></Paging>

         <!-- 编辑新增谈框 -->
          <el-dialog :title="m_isadd?'添加':'编辑'" :visible.sync="m_show" width="600px">
                <el-form :model="fromData" :rules="m_rules" ref="ruleForm">
                <el-form-item label="姓名" label-width="80px" prop="name">
                    <el-input v-model="fromData.name" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label-width="80px" label="性别">
                    <el-radio-group v-model="fromData.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="电话" label-width="80px" prop="mobile">
                    <el-input v-model="fromData.mobile"   auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="出生日期" label-width="80px" >
                    <el-date-picker
                    v-model="fromData.birth_day"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                

                <el-form-item label="身份证" label-width="80px" >
                    <el-input v-model="fromData.id_card"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="80px" >
                    <el-input v-model="fromData.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="微信" label-width="80px" >
                    <el-input v-model="fromData.wechat"  auto-complete="off"></el-input>
                </el-form-item>    
                   <el-form-item label="省市" label-width="80px" >
                    <el-cascader
                      :options="options"                    
                      v-model="selectedOptions"
                      @change="handleChange">
                    </el-cascader>
                  </el-form-item>
                  <el-form-item label="地址" label-width="80px">
                    <el-input v-model="fromData.address"  auto-complete="off"></el-input>
                </el-form-item>

                 <el-form-item label="备注" label-width="80px" >
                    <el-input type="textarea" v-model="fromData.remark"></el-input>
                </el-form-item>                         
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="m_show = false">取 消</el-button>
                  <el-button type="primary" :loading="m_loading"  @click.native="sureOption">确 定</el-button>
                </div>
            </el-dialog>

          <!-- 家属信息 -->
          <el-dialog title="家属信息" :visible.sync="familyTableShow">
            <el-table :data="familyList" v-loading="infoLoading">
                 <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="性别:">
                            <span>{{ props.row.sex | sex }}</span>
                        </el-form-item>
                        <el-form-item label="出生日期:">
                            <span>{{ props.row.birth_day }}</span>
                        </el-form-item>
                       <el-form-item label="身份证:">
                            <span>{{ props.row.id_card }}</span>
                        </el-form-item>
                        <el-form-item label="邮箱:">
                            <span>{{ props.row.email }}</span>
                        </el-form-item>
                        <el-form-item label="微信:">
                            <span>{{ props.row.wechat }}</span>
                        </el-form-item>
                        <el-form-item label="省市:">
                            <span>{{ props.row.province_name }}{{props.row.city_name}}</span>
                        </el-form-item>
                        <el-form-item label="地址:">
                            <span>{{ props.row.address }}</span>
                        </el-form-item>
                        <el-form-item label="备注:">
                            <span>{{ props.row.remark }}</span>
                        </el-form-item>
                      
                        </el-form>
                    </template>
                    </el-table-column>
                <el-table-column property="name" label="姓名" ></el-table-column>
                <el-table-column property="relation" label="关系"></el-table-column>
                <el-table-column property="mobile" label="手机号"></el-table-column>    
            </el-table>
        </el-dialog>


         <!-- 婴儿信息 -->
          <el-dialog title="婴儿信息" :visible.sync="babyTableShow">
            <el-table :data="babyList" v-loading="infoLoading">
                 <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                        
                        <el-form-item label="备注:">
                            <span>{{ props.row.remark }}</span>
                        </el-form-item>
                      
                        </el-form>
                    </template>
                    </el-table-column>
              
                <el-table-column property="name" label="姓名" ></el-table-column>
                <el-table-column property="birth_day" label="出生日期"></el-table-column>
                <el-table-column  label="性别">
                            <template slot-scope="scope">        
                            {{scope.row.sex |sex }}
                            </template>                
                </el-table-column>    
                <el-table-column property="height" label="身高(厘米)"></el-table-column> 
                <el-table-column property="weight" label="体重(克)"></el-table-column> 
               
            </el-table>
        </el-dialog>

 
          <!-- 历史评估 -->
          <el-dialog title="历史评估" :visible.sync="bathelTableShow">
            <h3 class="mb20"> 姓名：{{m_editData.name}}</h3>
             <el-button size="small" @click="addBathel" type="primary">评估</el-button>
            <el-table :data="bathelList" v-loading="batheLoading">   
                <el-table-column property="assess_day" label="评估日期" ></el-table-column>
                <el-table-column property="total_score" label="评估得分"></el-table-column>
                <el-table-column property="operator_name" label="评估者"></el-table-column> 
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                  <el-button @click.native="editBathel(scope.row)" type="text">编辑</el-button>
                  <el-button style="color:#ff0000"   @click.native="delBathel(scope.row)" type="text">删除</el-button>
                
                </template>

                </el-table-column> 
               
            </el-table>

             <el-pagination  class="mt20 tc" :current-page="bathelSearch.page"  layout="prev, pager, next" :page-size="bathelSearch.limit"  @current-change="bathelPageChange" :total="bathelSearch.total"></el-pagination>
        </el-dialog>

           <!-- 历史评估编辑和添加 -->
          <el-dialog :title="isbatheEdit?'编辑':'添加'" :visible.sync="bathelShow">
            <h3 class="mb20"> 姓名：{{m_editData.name}}</h3>
            <div>

                 <div class="block">
                    <span class="demonstration">评估日期：</span>
                    <el-date-picker class="w300"
                    v-model="bathelFormData.assess_day"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                   >
                    </el-date-picker>
                 </div>

                 <div class="tc mt30 pb30">
                     <div class="flex mb5 flex-m">
                        <div class="flex-1">项目</div>
                        <div class="flex-1">完全独立</div>
                            <div class="flex-1">需要部分帮助</div>
                        <div class="flex-1">极大需要帮助</div>
                        <div class="flex-1">完全依赖</div>
                    </div>

                       <div class="flex tc mb5  flex-m" v-for="(item , i ) in batheDataValue " :key="i">
                            <div class="flex-1">{{item.name}}</div>
                             
                            <div  class="flex  flex-4 " >
                                     <el-radio  class="flex-1 center" v-model="bathelFormData[item.key]" v-for="(it,index) in item.value" :key="index" :label="it.v"  :disabled="it.dis"><span></span></el-radio>
                        
                                </div>
                        </div>

                        
                 </div>
                 <p>
                    评估得分：{{bathelFormData.total_score=bathelTotal}} 
                 </p>

            </div>

            <div slot="footer" class="dialog-footer">
                  <el-button @click="bathelShow = false">取 消</el-button>
                  <el-button type="primary" :loading="batheFromLoading"  @click.native="batheSureOption">确 定</el-button>
            </div>          
        </el-dialog>
  </div>
</template>

<script>
import * as val from '../../utils/validate'
import { provinceAndCityDataPlus } from 'element-china-area-data'
import selector from '@/components/selector'
import * as api from '../../api/customer'
import family from './minix/family'
import assessment from './minix/assessment'
export default {
  components:{selector},
  mixins: [family,assessment],
  data () {
    return {
      
      options: provinceAndCityDataPlus, //省市数据
      selectedOptions:[],
      search_data:{
          search:'', //床位/手机/姓名
          fk_org_id:[], //公司ID
          fk_hpl_id:[], //网点/项目ID
      },
      fromData:{
         name:'', //客户姓名
         mobile:'', //手机号码
         sex:2, //性别 1:男 2:女
         birth_day:'', //生日
         id_card:'', //	身份证
         email:'', //邮箱
         wechat:'', //	微信号
         province:'', //省
         city:'', //	市
         address:'', //地址
         remark:'', //备注
      },


      m_rules:{
          name: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mobile:[
            {required: true, validator:val.isEngNum, trigger: 'blur' },
          ],


      }
    }
  },
  computed: {
      //是母婴 环境
      ismy(){
          //console.log(process.env.type)
          return process.env.type.includes('my')
      }
  },
  mounted(){
      this.getDatalist()
  },
  methods:{
      //获取数据信息
        getDatalist() {
                let position=this.$refs.ohgseach.getSelect()
                this.search_data.fk_org_id[0] = position[0]
                 this.search_data.fk_hpl_id[0] = position[1]
                let data = Object.assign(this.search_data, this.m_page);
                api.customs(data).then(res => {
                    console.log(res)
                    this.m_list = res.data.data
                    this.m_page.total = res.data.total
                })
            },

           //省市选择
          handleChange(value){
            console.log(value)
            this.fromData.province=value[0]
            this.fromData.city=value[1]
          },  
          //添加客户数据
          addData() {
                this.m_loading = true
                api.customs_add(this.fromData).then(res => {
                    this.search_data = this.m_utils.emptyObject(this.search_data)
                    this.m_page.page = 1
                    this.m_loading = false
                    this.m_success('添加成功')
                    this.m_show = false
                    this.getDatalist()
                }).catch(res=>{
                  this.m_loading = false
                })
            },

            //编辑客户数据
            editData() {
                this.m_loading = true
                let data = Object.assign(JSON.parse(JSON.stringify(this.fromData)), {
                    pk_id: this.m_editId
                })
                api.customs_update(data).then(res => {
                    this.m_loading = false
                    this.m_success('修改成功')
                    this.m_show = false
                    this.getDatalist()
                }).catch(res=>{
                  this.m_loading = false
                })
            },
            //删除客户
            delData() {
               this.m_loading = true
                api.customs_delete(this.m_delId).then(res => {
                   this.m_loading = false
                    this.m_success('删除成功')
                    this.getDatalist()
                }).catch(res=>{
                  this.m_loading = false
                })
            }, 
           

  },
  watch:{
      m_show(v){
          if(!v){
              this.selectedOptions = []
          }
      }
  }

}

</script>
<style lang='scss' scoped>
</style>