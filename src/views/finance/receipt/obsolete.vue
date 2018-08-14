<template>
  <div id="obsolete" v-loading="lodingtable" element-loading-text="拼命加载中">
    <el-row :gutter="20">
      <el-col :span="12">
        <selector :typename="['org','hpl']" ref="ohseach" :colspan="[12,12,0,0,10]" :gutter="20"></selector>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="search.receipt_no" placeholder="请输入票本号或单号查询"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button @click="getList">搜索</el-button>
        <el-button type="primary"  @click="openturns">新增</el-button>
      </el-col>
    </el-row>
    <h3 style="margin-top:20px;">作废登记：</h3>
    <el-table :data="list" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
      <el-table-column prop="cancel_time" align="center" label="作废日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="book_no" align="center" label="票本编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="receipt_no" align="center" label="作废单号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="organize_name" align="center" label="公司" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospital_name" align="center" label="部门" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="cancel_staff" align="center" label="操作员" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="cancel_reason_name" align="center" label="作废原因" show-overflow-tooltip>
      </el-table-column>

    </el-table>
    <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>

    <!-- 作废登记 -->
    <el-dialog title="作废登记" :visible.sync="newAddDialogVisible" width="960px" fullscreen :close-on-click-modal="false" center>
      <div style="height:100%">
        <el-scrollbar style="height:100%;" ref="scrollbar"> 
          <el-form :model="registerForm" :rules="registerRules"  ref="registerForm" v-loading="loadingregister">
            <el-row :gutter="20" style="margin:0;">
              <el-col :span="11" style="margin-top:0;">
                <selector :typename="['org','hpl']" ref="ohsearch" :colspan="[24,24,0,0,10]" :gutter="20" :labelPosition="'top'"  :RulesName="{org:{name:'公司',width:'40px'},hpl:{name:'部门',width:'40px'}}"></selector>
              </el-col>
             <el-col :span="11" style="margin-left:70px;">
                <el-form-item  prop="cancel_date" label="作废日期">
                  <el-date-picker v-model="registerForm.cancel_date" type="date" placeholder="请选择作废日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <el-col :span="11" style="margin:10px 0 0 70px;">
                <el-form-item prop="cancel_reason" label="作废类别" >
                  <el-select v-model="registerForm.cancel_reason" placeholder="请选择作废类别">
                    <el-option v-for="item in basicData.cancellationType" :key="item.pk_id" :label="item.name" :value="item.pk_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin:20px 0 0;">
              <el-col :span="11">
                <el-radio disabled v-model="registerForm.radioregister" label="选中且禁用">票据</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin: 0;">
              <el-col :span="11">
                <el-form-item label="票本号段" > <br/>
                  <div class="receiptbox">
                    <el-input v-model.number="registerForm.star_no"></el-input>
                    <span class="connetor">至</span>
                    <el-input v-model.number="registerForm.end_no"></el-input>
                    <el-button type="primary" @click="searchByCancal">查询</el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <span style="color:red; font-size:15px;margin-left:600px;">{{'票本数量'+registerForm.book_id.length+'本'}}</span>
                    <el-transfer
                        :titles="['未登记', '待登记']"
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
        <el-button type="primary" @click="cancelingReceipt" :loading="loading">确 定</el-button>
        <el-button @click="newAddDialogVisible = false">返 回</el-button>
        
      </span>

    </el-dialog>
  </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
// import * as api from '@/api/public'
import * as func from '@/utils/Lfunc'
import * as basicData from '@/assets/BasicData'
import * as apii from '@/api/receipt/obsolete'
import {mapGetters} from 'vuex'
export default {
    name:'obsolete',
    mixins:[Pagemixin],
  data() {
    return {
      func,
      basicData,
      lodingtable: false, //列表加载ing
      loadingregister:false,//作废登记加载
      newAddDialogVisible:false,//新增作废登记
      registerLists:[],    //作废登记查询列表
      list: [], //数据列表
      search: {
        receipt_no: ''
      },
      registerForm:{ //作废表单
        cancel_date:'',
        cancel_reason:'',
        radioregister:'选中且禁用',//票据单选按钮
        star_no:'',
        end_no:'',
        book_id:[]
      },
      registerRules:{
        cancel_date: [ {required: true, message: '请选择作废日期'}],
        cancel_reason: [{ required: true, message: '请选择作废类别' }]
      },
      lists:[
          {pk_id:1,name:'未使用'},
          {pk_id:2,name:'已使用'},
          {pk_id:3,name:'作废'}
        ]
    }
  },
  
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let position = this.$refs.ohseach.getSelect()
      let data = {
        limit: this.page.size,
        fk_org_id: position[0],
        fk_hpl_id: position[1],
        page: this.page.index,
        receipt_no: this.search.receipt_no
      }
      this.lodingtable = true
      apii.getReceiptVoidList(data)
        .then(_ => {
          this.page.total = _.data.total
          this.list = _.data.data
          this.lodingtable = false
        })
        .catch(_ => {
          this.lodingtable = false
        })
    },
    //新增按钮
     openturns(){
            this.newAddDialogVisible=true
            this.registerForm.cancel_date=''           
            this.registerForm.cancel_reason=''
            this.registerLists=[]
            this.rollBack('scrollbar')
            setTimeout(()=>{
                this.$refs.ohsearch.setSelect(false)
            },100)
        },
        // 作废登记查询
    searchByCancal() {
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
      this.loadingregister=true
      apii.getSearchByCancal(data)
        .then(_ => {
          this.registerLists = _.data
          this.loadingregister=false
          this.registerLists.forEach((item,index)=>{
            item.desc=`${item.receipt_no}--${item.receipt_type_name}--${func.filterName(item.receipt_status,this.lists)}`
          })
        })
        .catch(_ => {
          this.loadingregister=false
        })
    },
    //批量票据作废确认
       cancelingReceipt(){
           this.$refs.registerForm.validate(valid=>{
               if(valid){
                   let data={
                       'cancel_date':this.registerForm.cancel_date,
                       'pk_id':this.registerForm.book_id,
                       'cancel_reason':this.registerForm.cancel_reason
                   }
                  if(!this.registerForm.book_id) {
                      this.$message({
                    type: 'warning',
                    message: '请选择要作废的票本'
                })
                      return
                  }else{
                apii.setCancelingReceipt(data).then(_=>{
                 this.$message({
                    type: 'success',
                    message: '新增成功'
                })
              this.newAddDialogVisible = false
            }).catch(()=>{
                this.newAddDialogVisible = false
            })
                  }
               }
           })
    }
  },
  computed:{
        ...mapGetters(['loading'])
    }

}
</script>

<style lang='scss'>
 #obsolete {
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
