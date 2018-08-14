<template>
  <div id="projectCheck" v-loading="lodingtable" element-loading-text="拼命加载中">
    <el-row :gutter="10" class="MainSearch">
        <el-col :span="4" style="margin-bottom:10px;">
            <el-input v-model="search.order_no" placeholder="订单号"></el-input>
        </el-col>
        <el-col :span="8">
            <selector :typename="['hpl','dub']"  ref="hdsearch" :colspan="[0,12,12,0,10]" :gutter="10" :plac="{hpl:'请选择营业网点'}"></selector>
        </el-col>
        <el-col :span="7" style="margin-bottom:10px;">
            <el-date-picker
                v-model="search.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              
                >
            </el-date-picker>
        </el-col>
        <el-col :span="4" >
            <el-select v-model="search.project_lock">
                 <el-option label="请选择状态" value=""> </el-option>
                <el-option label="已确认" :value="1"> </el-option>
                 <el-option label="未确认" :value="2"> </el-option>
            </el-select>
        </el-col>
    </el-row>
     <el-row :gutter="10">
        <el-col :span="6" style="padding: 4px;">
            <el-button size="small" @click="getList" type="primary">搜索</el-button>
        </el-col>
    </el-row>
    <el-table :data="list" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
      <el-table-column  align="center" label="营业网点" show-overflow-tooltip>
        <template slot-scope="scope">
            {{func.filterName(scope.row.fk_hpl_id,$store.getters.hpl_list)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="科室" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="order_no" align="center" label="订单号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="patient_name" align="center" label="患者姓名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="bed" align="center" label="患者床位" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="total" align="center" label="产品总额" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="has_pay" align="center" label="已收款" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="endtime" align="center" label="结算日期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="project_lock" align="center" label="结算确认" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="finance_lock" align="center" label="财务核定" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <span class="spanb" @click="viewDetails(scope.row.pk_id)">查看</span>
        </template>
      </el-table-column>
    </el-table>
     <!-- 结算确认 -->
    <el-dialog title="结算确认" :visible.sync="projectCheckDialogVisible" width="860px" fullscreen :close-on-click-modal="false" center>
      <div style="height:100%" >
        <el-scrollbar style="height:100%;" ref="scrollbar">
            <el-row style="margin:15px 0;">
                <el-col :span="7">  
                <span>项目:{{func.filterName(DetailInfo.fk_hpl_id,$store.getters.hpl_list)}}</span>
                </el-col>
                <el-col :span="5">
                    <span>科室:{{func.filterName(DetailInfo.fk_dub_id,dubList)}}</span>
                </el-col>
                <el-col :span="6">
                    <span style="color:red;">结算日期:{{DetailInfo.endtime}}</span>
                </el-col>
                <el-col :span="6">
                    <span>单号:{{DetailInfo.order_no}}</span>
                </el-col>    
            </el-row>
            <el-row style="margin:15px 0;">
                <el-col :span="7">
                    <span>客户姓名:{{DetailInfo.patient_name}}</span>
                </el-col>
                <el-col :span="8">
                    <span>客户电话:{{DetailInfo.patient_phone}}</span>
                </el-col>
                <el-col :span="8">
                    <span>床位编号:{{DetailInfo.bed}}</span>
                </el-col>   
            </el-row>
            <el-table :data="goodsInfosList" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:15px 0;">
                <el-table-column prop="goods_name" align="center" label="产品" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" align="center" label="单价" show-overflow-tooltip>
                </el-table-column>
                <el-table-column  prop="num" align="center" label="数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="total" align="center" label="小计" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="discount" align="center" label="优惠" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="real_total" align="center" label="实收" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="saleman_name" align="center" label="业务员" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="commission" align="center" label="抽成" show-overflow-tooltip>
                </el-table-column> 
            </el-table>
            <el-table :data="serverInfosList" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:15px 0;">
                <el-table-column prop="start" align="center" label="开始" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="end" align="center" label="结束" show-overflow-tooltip>
                </el-table-column>
                <el-table-column  prop="time" align="center" label="天数" show-overflow-tooltip>
                </el-table-column>
                <el-table-column   prop="staff" align="center" label="工号/护理组" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="staff_pay" align="center" label="护理员所得" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-table :data="chargeInfosList" stripe tooltip-effect="dark" style="width: 100%;border:1px solid #ddd;margin:15px 0;">
                <el-table-column prop="charge_time" align="center" label="收费日期" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="turn_in_time" align="center" label="上缴日期" show-overflow-tooltip>
                </el-table-column>
                <el-table-column  prop="price" align="center" label="金额" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="charge_type" align="center" label="收款方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                    {{func.filterName(scope.row.pay_type,payTypeList) }}
                </template>
                </el-table-column>
                <el-table-column prop="staff" align="center" label="收款人" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-row style="margin:15px 0;">
                <el-col :span="6">
                    <span>产品总额:{{DetailInfo.total}}</span>
                </el-col>
                <el-col :span="6">
                    <span>已收:{{DetailInfo.has_pay}}</span>
                </el-col>
                <el-col :span="6">
                    <span>结算方式:{{DetailInfo.work_type}}</span>
                </el-col>   
                <el-col :span="6">
                    <span>居间服务费:{{DetailInfo.company_pay}}</span>
                </el-col>   
            </el-row>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="openeditor(pk_id)" >编辑订单</el-button>
        <el-button type="danger" @click="settlementEdit('cancel')">取消结算</el-button>
        <el-button type="success" @click="settlementEdit('confirm')">结 算</el-button>       
      </span>
    </el-dialog>
    <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
    <orderdetails ref="orderde" @getList="getList"></orderdetails>
  </div>
</template>

<script>
import orderdetails from '@/components/orderdetails'
import Pagemixin from '@/mixins/index'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/order'
import * as BsDate from '@/assets/BasicData'
import {mapGetters} from 'vuex'
export default {
  name: 'projectCheck',
  mixins:[Pagemixin],
  components:{orderdetails},
  data () {
    return {
        func,
        BsDate,
        search:{
            order_no:'',
            project_lock:'',
            time:[]
        },
        pk_id:'',
        lodingtable:false,
        projectCheckDialogVisible:false,//查看订单详情
        list:[],//数据表格
        DetailInfo:{},//订单详情列表
        goodsInfosList:[],//产品信息详情列表
        serverInfosList:[],//服务信息详情列表
        chargeInfosList:[],//服务信息详情列表
        dubList:[],//科室详情列表
        payTypeList:[//支付方式列表
            {pk_id:1,name:'现金'},
            {pk_id:2,name:'银行转账'},
            {pk_id:3,name:'微信'},
            {pk_id:4,name:'支付宝'},
            {pk_id:5,name:'其他'}
        ]
           
    }
  },
  mounted(){
      this.getList()
  },
  methods:{
       getList(){
            let position=this.$refs.hdsearch.getSelect()
            let data={
                'order_no':this.search.order_no,
                'project_lock':this.search.project_lock,
                'limit':this.page.size,
                // 'endtime_start':'2017-05-03',
                // 'endtime_end':'2018-06-11',
                'endtime_start':this.search.time[0]?this.search.time[0]:'',
                'endtime_end':this.search.time[1]?this.search.time[1]:'',
                'fk_hpl_id':position[0],
                'fk_dub_id':position[1],
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getProjectCheck(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                
                this.lodingtable=false
                // console.log(this.lists)
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        viewDetails(pk_id){
            let data={
                'id':pk_id
            }
            this.pk_id=pk_id
            api.getProjectCheckDetail(data).then(_=>{
                this.orderDetailList=_.data
                this.DetailInfo=_.data.info//订单信息详情
                this.goodsInfosList=_.data.goods_infos //产品信息详情
                this.serverInfosList=_.data.server_infos //服务信息详情
                this.chargeInfosList=_.data.charge_infos //收费信息详情
                this.projectCheckDialogVisible= true  
                this.getDubListInfo()
                // console.log(this.orderDetailList)
                // console.log(this.goodsInfosList)
                console.log(this.DetailInfo)
            }).catch(_=>{
                this.projectCheckDialogVisible= false   
            })      
        },
        getDubListInfo(){
            let data={
                'fk_hpl_id':this.DetailInfo.fk_hpl_id
            }
            api.getDubList(data).then(_=>{
                this.dubList=_.data
                console.log(this.dubList)
            })
        },
        // 结算确认与取消
        settlementEdit(type){
            let data={
                id:this.pk_id,
                project_lock:type==='cancel'?0:type==='confirm'?1:''
            }
            api.ProjectCheckConfirmAndcancel(data).then(_=>{
                this.$message({
                    type:'success',
                    message:'操作成功!'
                })
                this.projectCheckDialogVisible= false 
                this.getList() 
            }).catch(_=>{
                this.projectCheckDialogVisible= false 
            })    
        },

        openeditor(pk_id){
            this.$refs.orderde.openeditor(pk_id)
            this.projectCheckDialogVisible= false 
        }
  },
    computed: {
        ...mapGetters(['loading'])
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
#projectCheck{
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
}


</style>
