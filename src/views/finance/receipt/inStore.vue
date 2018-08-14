<template>
  <div id="instore" v-loading="lodingtable" element-loading-text="拼命加载中">
    <el-row :gutter="20">
      <el-col :span="12">
        <selector :typename="['org','hpl']" ref="ohseach" :colspan="[12,12,0,0,10]" :gutter="20"></selector>
      </el-col>

      <el-col :span="4">
        <el-input :placeholder="'待入库数：'+page.total" disabled></el-input>
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
        <el-button type="primary" @click="opencodingstore">编号入库</el-button>
      </el-col>
    </el-row>
    <h3 style="margin-top:20px;">入库明细：</h3>
    <el-table :data="list" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
      <el-table-column prop="receive_time" align="center" label="入库日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="storage_type_name" align="center" label="入库类型" show-overflow-tooltip>
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
          <span class="spanb" @click="receiptRemove(scope.row)">撤销</span>
        </template>
      </el-table-column>
    </el-table>
    <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
    <!-- 编码入库 -->
    <el-dialog title="编码入库" :visible.sync="codingDialogFormVisible" width="400px" fullscreen :close-on-click-modal="false" center>
      <div style="height:100%">
        <el-scrollbar style="height:100%;" ref="scrollbar">
          <el-form :model="form" :rules="rules" ref="form">
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="24">
                <el-form-item :span="8" prop="code_date" label="入库日期">
                  <el-date-picker v-model="form.code_date" type="date" placeholder="入库日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="入库类别" prop="code_type">
                  <el-select v-model="form.code_type" placeholder="请选择入库类别">
                    <el-option v-for="item in basicData.codeType" :key="item.pk_id" :label="item.name" :value="item.pk_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="票据类型" prop="receipt_type">
                  <el-select v-model="form.receipt_type" placeholder="请选择票据类型">
                    <el-option v-for="item in basicData.receiptType" :key="item.pk_id" :label="item.name" :value="item.pk_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="票据起始号" prop="star_id">
                  <el-input v-model.number="form.star_id"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="票据结束号" prop="end_id">
                  <el-input v-model.number="form.end_id"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="单本票据页数" prop="receipt_book_num">
                  <el-input v-model="form.receipt_book_num" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="receipt_book_no" label="票本起始编号(可以为空)">
                  <el-input v-model.number="form.receipt_book_no"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-top:3%;">
                <selector :typename="['org','hpl']" ref="ohseachs" :colspan="[24,24,0,0,10]" :gutter="20" :labelPosition="'top'" :propRules="formselectrules" :RulesName="{org:{name:'入库单位',width:'40px'},hpl:{name:'入库部门',width:'40px'}}"></selector>
              </el-col>
            </el-row>
          </el-form>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="codingstore">确 定</el-button>
        <el-button @click="codingDialogFormVisible = false">返 回</el-button>  
      </span>
    </el-dialog>

    <!-- 入库登记 -->
    <el-dialog title="入库登记" :visible.sync="newAddDialogVisible" width="960px" fullscreen :close-on-click-modal="false" center>
      <div style="height:100%">
        <el-scrollbar style="height:100%;" ref="scrollbar">
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm" v-loading="loadingturns">
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="11" style="margin-top:0;">
                <selector :typename="['org','hpl']" ref="ohsearch" :colspan="[24,24,0,0,10]" :gutter="20" :labelPosition="'top'"  :RulesName="{org:{name:'入库单位',width:'40px'},hpl:{name:'入库部门',width:'40px'}}"></selector>
              </el-col>
              <br/>
            </el-row>
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="11">
                <el-form-item label="入库类别" prop="codetype">
                  <el-select v-model="registerForm.codetype" placeholder="请选择入库类别">
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
                    <el-button type="primary" @click="serachbyStorage">查询</el-button>
                  </div>
                </el-form-item>
              </el-col>
               <el-col :span="11"  class="registerdate">                 
                <el-form-item label="接收日期" prop="turnover_date"> 
                  <span style="margin:0 0 0 60px;color:red;font-size:15px">{{'票本数量'+registerForm.book_id.length+'本'}}</span>
                        <el-date-picker
                            v-model="registerForm.turnover_date"
                            type="date"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-transfer
                        :titles="['未入库', '待入库']"
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
import { provinceAndCityData } from 'element-china-area-data'
import * as basicData from '@/assets/BasicData'
import Pagemixin from '@/mixins/index'
// import * as api from '@/api/public'
import * as func from '@/utils/Lfunc'
import * as apii from '@/api/receipt/inStore'
import * as vali from '@/utils/validate'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      func,
      basicData,
      options: provinceAndCityData,
      lodingtable: false, //列表加载ing
      loadingturns:false, //出库查询加载
      codingDialogFormVisible: false, //编码入库
      newAddDialogVisible: false, //新增入库登记
      registerLists:[],//批量入库登记列表
      list: [],
      search: {
        receipt_no: ''
      },
      form: {
        code_date: '',
        code_type: '',
        receipt_type: '',
        star_id: '',
        end_id: '',
        receipt_book_num: 25,
        receipt_book_no: '',
        fk_org_id: '',
        fk_hpl_id: ''
      },
      registerForm: {//新增入库登记
        codetype: '',
        star_no:'',
        end_no:'',
        turnover_date:'',
        book_id:[]
      },
      rules: {
        code_date: [
          {
            required: true,
            message: '请选择日期'
          }
        ],
        code_type: [{ required: true, message: '请选择入库类别' }],
        receipt_type: [{ required: true, message: '请选择票据类型' }],
        star_id: [{ validator: vali.isInStoreCode, required: true }],
        end_id: [{ validator: vali.isInStoreCode, required: true }],
        receipt_book_no: [{ validator: vali.isInStoreCode }],
        store_type: [{ required: true, message: '请选择入库类别' }]
      },
     
      formselectrules: {
        //selector组件的验证方式
        orgid: [{ required: true, message: '请选择公司', trigger: 'change' }],
        hplid: [{ required: true, message: '请选择项目', trigger: 'change' }]
      },
     
      registerRules:{
        turnover_date: [ {required: true, message: '请选择日期'}],
        codetype: [{ required: true, message: '请选择入库类别' }]
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
      // console.log('$refs')
      // console.log(this.$refs.ohseach)
      let data = {
        fk_org_id: position[0],
        fk_hpl_id: position[1],
        limit: this.page.size,
        page: this.page.index,
        receipt_no: this.search.receipt_no
      }

      this.lodingtable = true
      apii
        .getInStorelist(data)
        .then(_ => {
          this.page.total = _.data.total
          this.list = _.data.data
          // console.log(this.list);
          this.lodingtable = false
        })
        .catch(_ => {
          this.lodingtable = false
        })
    },
     //新增按钮
     opencodingstore(){
            this.codingDialogFormVisible=true
            this.form.code_date=''
            this.form.code_type=''
            this.form.end_id=''
            this.form.receipt_type=''
            this.form.star_id=''
            this.form.receipt_book_no=''
            this.rollBack('scrollbar')
            setTimeout(()=>{
                this.$refs.ohseachs.setSelect(false)
            },100)
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
            },100)
        },
    // 入库登记查询
    serachbyStorage() {
      if(!this.$refs.ohsearch.getSelect()[0]&&!this.registerForm.star_no&&!this.registerForm.end_no){
        this.$message({
          type:'warning',
          message:'请选择公司、起始单号或结束单号查询'
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
      apii.getSerachbyStorage(data)
        .then(_ => {
          this.registerLists = _.data
          this.loadingturns=false
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
      if(!this.registerForm.codetype){
          this.$message({
                    type: 'warning',
                    message: '请选择入库类别'
                })
      }else if(!this.registerForm.turnover_date){
        this.$message({
                    type: 'warning',
                    message: '请选择接收时间'
                })
      }else if(!this.registerLists.length){
        this.$message({
                    type: 'warning',
                    message: '请选择入库票本'
                })
      }
          let data = {
              book_id:this.registerForm.book_id,
              codetype: this.registerForm.codetype===1?3:4,
              turnover_date:this.registerForm.turnover_date
          }
          apii.getNewAddReceipt(data)
            .then(res => {
              this.$message({
                    type: 'success',
                    message: res.message
                })
              this.newAddDialogVisible = false
              this.getList()
            }).catch(() => {})      
    },
    // 编码入库
    codingstore() {
      this.$refs.ohseachs.verifica()
      this.$refs.form.validate(valid => {
        if (valid && this.$refs.ohseachs.verifica()) {
          let position = this.$refs.ohseachs.getSelect()
          let data = this.form
          data.fk_org_id = position[0]
          data.fk_hpl_id = position[1]
          apii
            .codeInStore(data)
            .then(res => {
              this.codingDialogFormVisible = false
              this.$refs.form.resetFields()
              data.fk_org_id = ''
              data.fk_hpl_id = ''
              this.$message({
                type: 'success',
                message: '新增成功'
              })
            })
            .catch(() => {})
        } else {
          this.$message({
            message: '请输入数据',
            type: 'warning'
          })
        }
      })
    },
    //单据入库撤销
    receiptRemove(scope) {
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
            .getReceiptRemove(data)
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

<style lang='scss' scoped>

</style>
<style lang='scss'>
#instore {
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
        .registerdate{
          margin-left:70px;
        }
}
</style>
