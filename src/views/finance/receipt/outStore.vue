<template>
    <div id="outstore" v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="20">
            <el-col :span="12">
                <selector :typename="['org','hpl']" ref="ohseach" :colspan="[12,12,0,0,10]" :gutter="20"></selector>
            </el-col>

            <el-col :span="4">
                <el-input :placeholder="'库存：'+page.total" disabled></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input v-model="search.receipt_no" placeholder="请输入票本号或单号查询"></el-input>
            </el-col>
            <el-col :span="6">
                <el-button @click="getList">搜索</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" @click="openturns">新增</el-button>
            </el-col>
        </el-row>
        <h3 style="margin-top:20px;">出库明细：</h3>
        <el-table :data="OutStorelist" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
            <el-table-column prop="turnover_time" align="center" label="出库日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="出库类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{func.filterName(scope.row.out_storage_type,list) }}
                </template>
            </el-table-column>
            <el-table-column prop="book_no" align="center" label="票本编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="起止号段" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.star_no+'-'+scope.row.end_no}}
                </template>
            </el-table-column>
            <el-table-column prop="organize_name" align="center" label="出库单位" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="hospital_name" align="center" label="入库单位" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="receiptOutRemove(scope.row)">撤销</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <!-- 出库登记 -->
    <el-dialog title="出库登记" :visible.sync="newAddDialogVisible" width="960px" fullscreen :close-on-click-modal="false" center>
      <div style="height:100%">
        <el-scrollbar style="height:100%;" ref="scrollbar">
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm"  v-loading="loadingturns">
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="11" >
                  <el-form-item label="出库日期" prop="turnover_date" style="margin-bottom:10px;"> 
                        <el-date-picker
                            v-model="registerForm.turnover_date"
                            type="date"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                <selector :typename="['org','hpl']" ref="ohsearch" :colspan="[24,24,0,0,10]" :gutter="20" :labelPosition="'top'"  :RulesName="{org:{name:'出库单位',width:'40px'},hpl:{name:'出库部门',width:'40px'}}"></selector>
              </el-col>
              <el-col :span="11" style="margin:0 0 0 60px;">
                  <selector :typename="['org','hpl']" ref="ohsearchout" :colspan="[24,24,0,0,10]" :gutter="20" :labelPosition="'top'" :propRules="formselectrules"  :RulesName="{org:{name:'入库单位',width:'40px'},hpl:{name:'入库部门',width:'40px'}}"></selector>
              </el-col>
              
            </el-row>
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="11">
                <el-form-item label="出库类别" prop="codetype">
                  <el-select v-model="registerForm.codetype" placeholder="请选择出库类别">
                    <el-option v-for="item in basicData.inStoreType" :key="item.pk_id" :label="item.name" :value="item.pk_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               
            </el-row>
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="11">
                <el-form-item label="票本号段" > <br/>
                  <div class="receiptbox">
                    <el-input v-model.number="registerForm.star_no"></el-input>
                    <span class="connetor">至</span>
                    <el-input v-model.number="registerForm.end_no"></el-input>
                    <el-button type="primary" @click="serachbylibrary">查询</el-button>
                  </div>
                </el-form-item>
              </el-col>
               
                <el-col :span="24">
                   <span style="color:red; font-size:15px;margin-left:600px;">{{'票本数量'+registerForm.book_id.length+'本'}}</span>
              
                    <el-transfer
                        :titles="['未出库', '待出库']"
                        :props="{ key: 'pk_id', label: 'desc'}"
                        v-model="registerForm.book_id"
                        ref="transfer"
                        :data="registerLists">
                    </el-transfer>
                </el-col>
            </el-row>
          </el-form>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newAddReceipt" :loading="loading">确 定</el-button>
        <el-button @click="newAddDialogVisible = false">返 回</el-button>
        
      </span>

    </el-dialog>
    </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
// import * as api from '@/api/public'
import * as basicData from '@/assets/BasicData'
import * as apii from '@/api/receipt/outStore'
import * as func from '@/utils/Lfunc'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      func, 
      basicData,
      lodingtable: false, //列表加载ing
      OutStorelist: [] ,//数据列表
      newAddDialogVisible: false, //新增出库登记
      loadingturns:false,    //票本查询加载
      registerLists:[],//批量出库登记列表
      search:{
          receipt_no:''
      },
      list:[
          {pk_id:0,name:'调拨出库'},
          {pk_id:1,name:'调拨出库'},
          {pk_id:2,name:'核销出库'}
        ],
        registerForm: {//新增出库登记
        codetype: '',
        star_no:'',
        end_no:'',
        turnover_date:'',
        book_id:[]
      },
       registerRules:{
        turnover_date: [ {required: true, message: '请选择日期'}],
        codetype: [{ required: true, message: '请选择出库类别' }]
      },
    formselectrules: {
        //selector组件的验证方式
        orgid: [{ required: true, message: '请选择公司', trigger: 'change' }],
        hplid: [{ required: true, message: '请选择项目', trigger: 'change' }]
      }
    }
  },
  mixins: [Pagemixin],
  mounted() {
    this.getList()
  },
  
  methods: {
    getList() {
      let position = this.$refs.ohseach.getSelect()
      //   console.log(this.$refs.ohseach)
      let data = {
        fk_org_id: position[0],
        fk_hpl_id: position[1],
        page: this.page.index,
        limit: this.page.size,
        receipt_no: this.search.receipt_no
      }
      this.lodingtable = true
      apii
        .getAllOutStorelist(data)
        .then(_ => {
          this.page.total = _.data.total
          this.OutStorelist = _.data.data
          this.lodingtable = false
        })
        .catch(_ => {
          this.lodingtable = false
        })
    },
     //新增按钮
     openturns(){
            this.newAddDialogVisible=true
            this.registerForm.codetype=''
            this.registerForm.star_no=''
            this.registerForm.end_no=''
            this.registerForm.turnover_date=''
            this.registerLists=[]
            this.rollBack('scrollbar')
            setTimeout(()=>{
                this.$refs.ohsearch.setSelect(false)
                this.$refs.ohsearchout.setSelect(false)
            },100)
        },
    // 出库查询
    serachbylibrary(){
  if(!this.$refs.ohsearch.getSelect()[0]&&!this.registerForm.star_no&&!this.registerForm.end_no){
        this.$message({
          type:'warning',
          message:'请选择出库公司、起始单号或结束单号查询'
        })
        return
      }
      let position = this.$refs.ohsearch.getSelect()
      let data = {
        fk_org_id: position[0],
        fk_hpl_id: position[1]|| '',
        starno: this.registerForm.star_no,
        endno: this.registerForm.end_no
      }
      this.loadingturns=true
      apii
        .getSerachbylibrary(data)
        .then(_ => {
          this.registerLists = _.data
          this.loadingturns=false
          // console.log( this.registerLists)
          this.registerLists.forEach((item,index)=>{
            item.desc=`票本${item.book_no}--（票据：${item.star_no}--${item.end_no}）`
          })
        })
        .catch(_ => {
            this.loadingturns=false
        })
    },
    //批量新增票据确认
       newAddReceipt(){
           this.$refs.ohsearchout.verifica()
           this.$refs.registerForm.validate(valid=>{
               if(valid && this.$refs.ohsearchout.verifica()){
                   let data={
                       'turnover_date':this.registerForm.turnover_date,
                       'pk_id[]':this.registerForm.book_id,
                       'up_fk_org_id':this.$refs.ohsearchout.getSelect()[0],
                       'up_fk_hpl_id':this.$refs.ohsearchout.getSelect()[1],
                       'out_type':this.registerForm.codetype
                   }
                  if(!this.registerForm.book_id) {
                      this.$message({
                    type: 'warning',
                    message: '请选择出库票本'
                })
                      return
                  }else{
                apii.setReceiptOutStore(data).then(_=>{
                 this.$message({
                    type: 'success',
                    message: _.message
                })
              this.newAddDialogVisible = false
            }).catch(()=>{
                this.newAddDialogVisible = false
            })
                  }
               }
           })
    },
    // 出库撤销
    receiptOutRemove(scope){
        this.$confirm('确定执行此操作吗？, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          let data = {
            pk_id: scope.pk_id,
            book_no: scope.book_no,
            receipt_type: 1
          }
          apii
            .getReceiptOutRemove(data)
            .then(_ => {
              this.$message({
                type: 'success',
                message: '撤销成功!'
              })
              this.getList()
            })
            .catch(_ => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          })
        })
    }

  },
  computed:{
        ...mapGetters(['loading'])
    }
}
</script>

<style lang='scss' >
    #outstore {
  .el-dialog {
    margin-top: 0;
    top: 5%;
    height: 90%;
  }

  .el-dialog__body {
    position: absolute;
    padding-top: 0;
    padding-bottom: 10px;
    top: 60px;
    bottom: 76px;
    left: 0;
    right: 0;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-dialog__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .el-scrollbar__wrap {
    padding-bottom: 17px;
  }
  .el-form-item__label {
    margin-top: 10px;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .receiptbox {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    .connetor {
      display: block;
      width: 30px;
      background-color: #eee;
      text-align: center;
    }

    .el-input {
      width: 140px;
    }
    .el-input__inner {
      width: 140px;
      display: block;
      margin: 0px;
    }
    .el-button {
      margin-left: 20px;
    }
  }
   .el-transfer{
            width:100%;
            margin-top:20px;
            .el-input{
                width:auto;
            }
            .el-transfer-panel{
              width:44%;
              height: 380px;
            }
            .el-transfer-panel__list{
              height: 340px;
            }
            .el-transfer__buttons{
                // width: 20%;
                box-sizing: border-box;
                .el-button+.el-button{
                    margin: 0 auto;
                }
            }
        }
      
}
</style>
