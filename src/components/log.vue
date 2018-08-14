<!-- 业务管理-业务登记-日志查看 -->
<template>
    <div>
        <!-- 订单日志弹框 -->
        <el-dialog :visible.sync="show" width="70%" :modal-append-to-body="false">
            <span class="orderTitle">订单号：{{orderNo}}</span>
            <el-table class="mt15" :data="logList" style="width: 100%">
                <el-table-column label="行为">
                    <template slot-scope="scope">
                        <span>{{ scope.row.action| operation }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="打印编号">
                    <template slot-scope="scope">
                        <span>{{ scope.row.print_no }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作人">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.updated_at }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="toDetail(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer flex flex-m ">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.page" :page-sizes="[10, 20, 50]" :page-size="pageData.limit" layout="sizes, prev, pager, next" :total="pageData.total">
                </el-pagination>
                <el-button class="cBtn" type="primary" @click="show = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 订单日志弹框end -->
        <!-- 订单日志详情弹框 -->
        <el-dialog :visible.sync="Dshow" width="70%" :modal-append-to-body="false">
            <el-row class="mb20 fs">
                <el-col :span="6">
                    <span>项目：
                        <span :class="[{red:order_base.fk_hpl_idR},{del:order_base.fk_hpl_idD}]">{{order_base.fk_hpl_id}}</span>
                        <span v-if="order_baseClassName[0].statu" class="red">{{order_base._dirty.fk_hpl_id}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>科室：
                        <span :class="[{red:order_base.fk_dub_nameR},{del:order_base.fk_dub_nameD}]">{{order_base.dub_name}}</span>
                        <span v-if="order_baseClassName[1].statu" class="red">{{order_base._dirty.dub_name}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>结算日期：
                        <span :class="[{red:order_base.endtimeR},{del:order_base.endtimeD}]">{{order_base.endtime |time}}</span>
                        <span v-if="order_baseClassName[2].statu" class="red">{{order_base._dirty.endtime | time}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>单号：
                        <span :class="[{red:order_base.order_noR},{del:order_base.order_noD}]">{{order_base.order_no}}</span>
                        <span v-if="order_baseClassName[3].statu" class="red">{{order_base._dirty.order_no}}</span>
                    </span>
                </el-col>
            </el-row>
            <el-row class="fs">
                <el-col :span="6">
                    <span>客户姓名：
                        <span :class="[{red:order_base.patient_nameR},{del:order_base.patient_nameD}]">{{order_base.patient_name}}</span>
                        <span v-if="order_baseClassName[4].statu" class="red">{{order_base._dirty.patient_name}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>客户电话：
                        <span :class="[{red:order_base.patient_phoneR},{del:order_base.patient_phoneD}]">{{order_base.patient_phone}}</span>
                        <span v-if="order_baseClassName[5].statu" class="red">{{order_base._dirty.patient_phone}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>床位编号：
                        <span :class="[{red:order_base.bedR},{del:order_base.bedD}]">{{order_base.bed}}</span>
                        <span v-if="order_baseClassName[6].statu" class="red">{{order_base._dirty.bed}}</span>
                    </span>
                </el-col>
            </el-row>
            <!-- 表格1 -->
            <el-table class="mt20" :data="order_goods" style="width: 100%" border>
                <el-table-column label="产品">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.descriptionR},{del:scope.row.descriptionD}]">{{ scope.row.description}}</span>
                        <span v-if="order_goodsClassName[0].statu" class="red">{{scope.row._dirty.description}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.priceR},{del:scope.row.priceD}]">{{ scope.row.price }}</span>
                        <span v-if="order_goodsClassName[1].statu" class="red">{{scope.row._dirty.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.real_combo_numR},{del:scope.row.real_combo_numD}]">{{ scope.row.real_combo_num }}</span>
                        <span v-if="order_goodsClassName[2].statu" class="red">{{scope.row._dirty.real_combo_num}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="小计">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.smallR},{del:scope.row.smallD}]">{{ scope.row.real_combo_num*scope.row.price}}</span>
                        <span v-if="order_goodsClassName[7].statu" class="red">{{uprice*goodNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="优惠">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.total_discountR},{del:scope.row.total_discountD}]">{{ scope.row.total_discount }}</span>
                        <span v-if="order_goodsClassName[3].statu" class="red">{{scope.row._dirty.total_discount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实收">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.real_totalR},{del:scope.row.real_totalD}]">{{ scope.row.real_total }}</span>
                        <span v-if="order_goodsClassName[4].statu" class="red">{{scope.row._dirty.real_total}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="业务员">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.saleman_nameR},{del:scope.row.saleman_nameD}]">{{ scope.row.saleman_name }}</span>
                        <span v-if="order_goodsClassName[5].statu" class="red">{{scope.row._dirty.saleman_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="抽成">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.commissionR},{del:scope.row.commissionD}]">{{ scope.row.commission }}</span>
                        <span v-if="order_goodsClassName[6].statu" class="red">{{scope.row._dirty.commission}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格1end -->
            <!-- 表格2 -->
            <el-table class="mt20" :data="order_service" style="width: 100%" border>
                <el-table-column label="开始">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.startR},{del:scope.row.startD}]">{{ scope.row.start | time}}</span>
                        <span v-if="order_serviceClassName[0].statu" class="red">{{scope.row._dirty.start| time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.endR},{del:scope.row.endD}]">{{ scope.row.end | time}}</span>
                        <span v-if="order_serviceClassName[1].statu" class="red">{{scope.row._dirty.end}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="天数">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.timeR},{del:scope.row.timeD}]">{{ scope.row.time }}</span>
                        <span v-if="order_serviceClassName[2].statu" class="red">{{scope.row._dirty.time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工号/护理组">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.fk_stf_id_nameR},{del:scope.row.fk_stf_id_nameD}]">{{ scope.row.fk_stf_id_name }}</span>
                        <span v-if="order_serviceClassName[3].statu" class="red">{{scope.row._dirty.fk_stf_id_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="护理员所得">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.staff_payR},{del:scope.row.staff_payD}]">{{ scope.row.staff_pay }}</span>
                        <span v-if="order_serviceClassName[4].statu" class="red">{{scope.row._dirty.staff_pay}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格2end -->
            <!-- 表格3 -->
            <el-table class="mt20" :data="order_charge" style="width: 100%" border>
                <el-table-column label="收费日期">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.charge_timeR},{del:scope.row.charge_timeD}]">{{ scope.row.charge_time | time }}</span>
                         <span v-if="order_chargeClassName[0].statu" class="red">{{scope.row._dirty.charge_time| time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上缴日期">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.turn_in_timeR},{del:scope.row.turn_in_timeD}]">{{ scope.row.turn_in_time | time}}</span>
                         <span v-if="order_chargeClassName[1].statu" class="red">{{scope.row._dirty.turn_in_time| time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.priceR},{del:scope.row.priceD}]">{{ scope.row.price }}</span>
                         <span v-if="order_chargeClassName[2].statu" class="red">{{scope.row._dirty.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收款方式">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.pay_typeR},{del:scope.row.pay_typeD}]">{{ scope.row.pay_type | payType}}</span>
                         <span v-if="order_chargeClassName[3].statu" class="red">{{scope.row._dirty.pay_type|payType}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收款人">
                    <template slot-scope="scope">
                        <span :class="[{red:scope.row.fk_stf_c_id_nameR},{del:scope.row.fk_stf_c_id_nameD}]">{{ scope.row.fk_stf_c_id_name }}</span>
                         <span v-if="order_chargeClassName[4].statu" class="red">{{scope.row._dirty.fk_stf_c_id_name}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格3end -->
            <el-row class="mt20 fs">
                <el-col :span="6">
                    <span>产品总额：
                        <span :class="[{red:order_base.totalR},{del:order_base.totalD}]">{{order_base.total}}</span>
                        <span v-if="order_baseClassName[7].statu" class="red">{{order_base._dirty.total}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>已收：
                        <span :class="[{red:order_base.fk_has_payR},{del:order_base.fk_has_payD}]">{{order_base.has_pay}}</span>
                        <span v-if="order_baseClassName[8].statu" class="red">{{order_base._dirty.has_pay}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>结算方式：
                        <span :class="[{red:order_base.work_typeR},{del:order_base.work_typeD}]">{{order_base.work_type |workType}}</span>
                        <span v-if="order_baseClassName[9].statu" class="red">{{order_base._dirty.work_type|workType}}</span>
                    </span>
                </el-col>
                <el-col :span="6">
                    <span>居间服务费：
                        <span>{{roomService}}</span>
                    </span>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="Dshow = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 订单日志详情弹框end -->

    
    </div>
</template>

<script>
import { getLog, getLogDetail } from "@/api/order";
export default {
  data() {
    return {
      show: false,
      Dshow: false,
      pageData: {
        page: 1,
        limit: 10,
        total: 0
      },
      logList: [],
      orderId: "",
      orderNo: "",
      baseInfo: {},
      order_base: {},
      order_goods: [],
      order_service: [],
      order_charge: [],
      goodsTotal: "", //产品总额
      roomService: "", //居间服务费
      uprice:'',//单价
      goodNum:'',//商品数量
      _order_baseClassName:[],
      order_baseClassName: [   //类名以及操作状态类的绑定状态
        { 
          name:'fk_hpl_idR',
          name1:'fk_hpl_idD',
          name2:'fk_hpl_id',
          statu:false
        },
        { 
          name:'dub_nameR',
          name1:'dub_nameD',
          name2:'dub_name',
          statu:false
        },
        { 
          name:'endtimeR',
          name1:'endtimeD',
          name2:'endtime',
          statu:false
        },
        { 
          name:'order_noR',
          name1:'order_noD',
          name2:'order_no',
          statu:false
        },
        { 
          name:'patient_nameR',
          name1:'patient_nameD',
          name2:'patient_name',
          statu:false
        },
        { 
          name:'patient_phoneR',
          name1:'patient_phoneD',
          name2:'patient_phone',
          statu:false
        },
        { 
          name:'bedR',
          name1:'bedD',
          name2:'bed',
          statu:false
        },
        { 
          name:'totalR',
          name1:'totalD',
          name2:'total',
          statu:false
        },
        { 
          name:'has_payR',
          name1:'has_payD',
          name2:'has_pay',
          statu:false
        },
        { 
          name:'work_typeR',
          name1:'work_typeD',
          name2:'work_type',
          statu:false
        },
        
      ],
      _order_goodsClassName:[],
      order_goodsClassName: [   //类名以及操作状态类的绑定状态
        { 
          name:'descriptionR',
          name1:'descriptionD',
          name2:'description',
          statu:false
        },
        { 
          name:'priceR',
          name1:'priceD',
          name2:'price',
          statu:false
        },
        { 
          name:'real_combo_numR',
          name1:'real_combo_numD',
          name2:'real_combo_num',
          statu:false
        },
        { 
          name:'total_discountR',
          name1:'total_discountD',
          name2:'total_discount',
          statu:false
        },
        { 
          name:'real_totalR',
          name1:'real_totalD',
          name2:'real_total',
          statu:false
        },
        { 
          name:'saleman_nameR',
          name1:'saleman_nameD',
          name2:'saleman_name',
          statu:false
        },
        { 
          name:'commissionR',
          name1:'commissionD',
          name2:'commission',
          statu:false
        },
        {
            name:'smallR',
            name1:'smallD',
            name2:'small',
            statu:false
        }
      ],
      _order_serviceClassName:[],
      order_serviceClassName:[
        { 
          name:'startR',
          name1:'startD',
          name2:'start',
          statu:false
        },
        { 
          name:'endR',
          name1:'endD',
          name2:'end',
          statu:false
        },
        { 
          name:'timeR',
          name1:'timeD',
          name2:'time',
          statu:false
        },
        { 
          name:'fk_stf_id_nameR',
          name1:'fk_stf_id_nameD',
          name2:'fk_stf_id_name',
          statu:false
        },
        { 
          name:'staff_payR',
          name1:'staff_payD',
          name2:'staff_pay',
          statu:false
        },
      ],
      _order_chargeClassName:[],
       order_chargeClassName:[
        { 
          name:'charge_timeR',
          name1:'charge_timeD',
          name2:'charge_time',
          statu:false
        },
        { 
          name:'turn_in_timeR',
          name1:'turn_in_timeD',
          name2:'turn_in_time',
          statu:false
        },
        { 
         name:'priceR',
          name1:'priceD',
          name2:'price',
          statu:false
        },
        { 
         name:'pay_typeR',
          name1:'pay_typeD',
          name2:'pay_type',
          statu:false
        },
        { 
         name:'fk_stf_c_id_nameR',
          name1:'fk_stf_c_id_nameD',
          name2:'fk_stf_c_id_name',
          statu:false
        },
       ]
    };
  },
  mounted(){
      this._order_baseClassName = JSON.parse(JSON.stringify(this.order_baseClassName))
      this._order_goodsClassName = JSON.parse(JSON.stringify(this.order_goodsClassName))
      this._order_chargeClassName= JSON.parse(JSON.stringify(this.order_chargeClassName))
      this._order_serviceClassName= JSON.parse(JSON.stringify(this.order_serviceClassName))
  },
  filters: {
    operation(val) {
      console.log(val);
      let i =
        val == 0
          ? "未操作"
          : val == 1
            ? "增加"
            : val == 2 ? "修改" : val == 3 ? "删除" : "未操作";
      return i;
    },
    time(val) {
      let i = val ? val.slice(0, 10) : "";
      return i;
    },
    payType(val) {
      let i = !val
        ? ""
        : val == 1
          ? "现金"
          : val == 2
            ? "银行转账"
            : val == 3 ? "微信" : val == 4 ? "支付宝" : val == 5 ? "其他" : "";
      return i;
    },
    workType(val) {
      let i = !val ? "" : val == 1 ? "月结" : val == 2 ? "日结" : "";
      return i;
    }
  },
  methods: {
    open(n) {
      //打开弹窗
      this.orderId = n;
      this.show = true;
      this.getLogList();
    },
    handleSizeChange(val) {
      this.pageData.page = 1;
      this.pageData.total = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.pageData.page = val;
      this.getLogList();
    },
    getLogList() {
      //获取日志列表
      let data = {
        order_id: this.orderId,
        limit: this.pageData.limit,
        page: this.pageData.page
      };
      getLog(data)
        .then(res => {
          this.pageData.total = res.data.total;
          this.logList = res.data.data;
          this.orderNo = this.logList[0].order_no || "";
        })
        .catch(() => {});
    },
    toDetail(index, row) {
      //查看详情
      this.order_baseClassName = JSON.parse(JSON.stringify(this._order_baseClassName))
      this.order_goodsClassName = JSON.parse(JSON.stringify(this._order_goodsClassName))
      this.order_chargeClassName= JSON.parse(JSON.stringify(this._order_chargeClassName))
      this.order_serviceClassName= JSON.parse(JSON.stringify(this._order_serviceClassName))
      getLogDetail({ pk_id: row.pk_id }).then(res => {
        let i = res.data.data.info;
        console.log(i)
        this.order_base = i.order_base;
        this.order_goods = i.order_goods;
        this.order_service = i.order_service;
        this.order_charge = i.order_charge;
        this.Dshow = true;
        this.uprice = i.order_goods.price
        this.goodNum = i.order_goods.real_combo_num
        this.goodsTotal = i.order_base.total;
        let cwPay = 0;
        i.order_service.forEach(item => {
          cwPay += parseInt(item.staff_pay)
        });
        this.roomService = this.goodsTotal - cwPay;
        this.order_charge.forEach(item=>{
            if(Object.keys(item._dirty).length>=1){
                this.order_chargeClassName.forEach(item2=>{
                    let r = item2.name
                    item[r] = false
                    let d = item2.name1
                    item[d] = false

                })
                    let keyList = Object.getOwnPropertyNames(item._dirty)
                switch(item._dirty.action){
                    case 1:    //增加
                    keyList.forEach(item3=>{
                         switch(item3){
                            case 'charge_time':
                            item.charge_time = item._dirty.charge_time
                            item.charge_timeR = true
                            break;
                            case 'turn_in_time':
                            item.turn_in_time = item._dirty.turn_in_time
                            item.turn_in_timeR = true
                            break;
                            case 'price':
                            item.price = item._dirty.price
                            item.priceR = true
                            break;
                            case 'pay_type':
                            item.pay_type = item._dirty.pay_type
                            item.pay_typeR = true
                            break;
                            case 'fk_stf_c_id_name':
                            item.fk_stf_c_id_name = item._dirty.fk_stf_c_id_name
                            item.fk_stf_c_id_nameR = true
                            break;
                        }
                    })
                    break;
                    case 2:  //修改
                       keyList.forEach(item3=>{
                         switch(item3){
                            case 'charge_time':
                            this.order_chargeClassName[0].statu = true
                            item.charge_timeD = true
                            break;
                            case 'turn_in_time':
                            this.order_chargeClassName[1].statu = true
                            item.turn_in_timeD = true
                            break;
                            case 'price':
                            this.order_chargeClassName[2].statu = true
                            item.priceD = true
                            break;
                            case 'pay_type':
                            this.order_chargeClassName[3].statu = true
                            item.pay_typeD = true
                            break;
                            case 'fk_stf_c_id_name':
                            this.order_chargeClassName[4].statu = true
                            item.fk_stf_c_id_nameD = true
                            break;
                        }
                    })
                    break;
                    case 3:  //删除
                    item.charge_timeD = true
                    item.turn_in_timeD = true
                    item.priceD = true
                    item.pay_typeD = true
                    item.fk_stf_c_id_nameD = true
                    // keyList.forEach(item3=>{
                    //      switch(item3){
                    //         case 'charge_time':
                    //         item.charge_time = item._dirty.charge_time
                    //         item.charge_timeD = true
                    //         break;
                    //         case 'turn_in_time':
                    //         item.turn_in_time = item._dirty.turn_in_time
                    //         item.turn_in_timeD = true
                    //         break;
                    //         case 'price':
                    //         item.price = item._dirty.price
                    //         item.priceD = true
                    //         break;
                    //         case 'pay_type':
                    //         item.pay_type = item._dirty.pay_type
                    //         item.pay_typeD = true
                    //         break;
                    //         case 'fk_stf_c_id_name':
                    //         item.fk_stf_c_id_name = item._dirty.fk_stf_c_id_name
                    //         item.fk_stf_c_id_nameD = true
                    //         break;
                    //     }
                    // })
                    break;
                }
                console.log(this.order_charge)
            }
            
        })    //marke
        this.order_service.forEach(item=>{
            if(Object.keys(item._dirty).length>=1){
                this.order_serviceClassName.forEach(item2=>{
                    let r = item2.name
                    item[r] = false
                    let d = item2.name1
                    item[d] = false

                })
                    let keyList = Object.getOwnPropertyNames(item._dirty)
                switch(item._dirty.action){
                    case 1:    //增加
                    keyList.forEach(item3=>{
                         switch(item3){
                            case 'start':
                            item.start = item._dirty.start
                            item.startR = true
                            break;
                            case 'end':
                            item.end = item._dirty.end
                            item.endR = true
                            break;
                            case 'time':
                            item.time = item._dirty.time
                            item.timeR = true
                            break;
                            case 'fk_stf_id_name':
                            item.fk_stf_id_name = item._dirty.fk_stf_id_name
                            item.fk_stf_id_nameR = true
                            break;
                            case 'staff_pay':
                            item.staff_pay = item._dirty.staff_pay
                            item.staff_payR = true
                            break;
                        }
                    })
                    break;
                    case 2:  //修改
                       keyList.forEach(item3=>{
                         switch(item3){
                            case 'start':
                            this.order_serviceClassName[0].statu = true
                            item.startD = true
                            break;
                            case 'end':
                            this.order_serviceClassName[1].statu = true
                            item.endD = true
                            break;
                            case 'time':
                            this.order_serviceClassName[2].statu = true
                            item.timeD = true
                            break;
                            case 'fk_stf_id_name':
                            this.order_serviceClassName[3].statu = true
                            item.fk_stf_id_nameD = true
                            break;
                            case 'staff_pay':
                            this.order_serviceClassName[4].statu = true
                            item.staff_payD = true
                            break; 
                        }
                    })
                    break;
                    case 3:  //删除
                    item.startD = true
                    item.endD = true
                    item.timeD = true
                    item.fk_stf_id_nameD = true
                    item.staff_payD = true
                    // keyList.forEach(item3=>{
                    //      switch(item3){
                    //         case 'start':
                    //         item.start = item._dirty.start
                    //         item.startD = true
                    //         break;
                    //         case 'end':
                    //         item.end = item._dirty.end
                    //         item.endD = true
                    //         break;
                    //         case 'time':
                    //         item.time = item._dirty.time
                    //         item.timeD = true
                    //         break;
                    //         case 'fk_stf_id_name':
                    //         item.fk_stf_id_name = item._dirty.fk_stf_id_name
                    //         item.fk_stf_id_nameD = true
                    //         break;
                    //         case 'staff_pay':
                    //         item.staff_pay = item._dirty.staff_pay
                    //         item.staff_payD = true
                    //         break;
                    //     }
                    // })
                    break;
                }
            }
            
        })  
         this.order_goods.forEach(item=>{
            if(Object.keys(item._dirty).length>=1){
                this.order_goodsClassName.forEach(item2=>{
                    let r = item2.name
                    item[r] = false
                    let d = item2.name1
                    item[d] = false

                })
                    let keyList = Object.getOwnPropertyNames(item._dirty)
                switch(item._dirty.action){
                    case 1:    //增加
                    keyList.forEach(item3=>{
                         switch(item3){
                            case 'description':
                            item.description = item._dirty.description
                            item.descriptionR = true
                            break;
                            case 'price':
                            item.price = item._dirty.price
                            item.priceR = true
                            item.smallR = true
                            break;
                            case 'real_combo_num':
                            item.real_combo_num = item._dirty.real_combo_num
                            item.real_combo_numR = true
                            item.smallR = true
                            break;
                            case 'total_discount':
                            item.total_discount = item._dirty.total_discount
                            item.total_discountR = true
                            break;
                            case 'real_total':
                            item.real_total = item._dirty.real_total
                            item.real_totalR = true
                            break;
                            case 'saleman_name':
                            item.saleman_name = item._dirty.saleman_name
                            item.saleman_nameR = true
                            break;
                            case 'commission':
                            item.commission = item._dirty.commission
                            item.commissionR = true
                            break;
                        }
                    })
                    break;
                    case 2:  //修改
                       keyList.forEach(item3=>{
                         switch(item3){
                            case 'description':
                            this.order_goodsClassName[0].statu = true
                            item.descriptionD = true
                            break;
                            case 'price':
                            this.uprice = item._dirty.price
                            this.order_goodsClassName[1].statu = true
                            item.priceD = true
                            item.smallD = true
                            break;
                            case 'real_combo_num':
                            this.goodNum = item._dirty.real_combo_num
                            this.order_goodsClassName[2].statu = true
                            item.smallD = true
                            item.real_combo_numD = true
                            break;
                            case 'total_discount':
                            this.order_goodsClassName[3].statu = true
                            item.total_discountD = true
                            break;
                            case 'real_total':
                            this.order_goodsClassName[4].statu = true
                            item.real_totalD = true
                            break; 
                            case 'saleman_name':
                            this.order_goodsClassName[5].statu = true
                            item.saleman_nameD = true
                            break; 
                            case 'commission':
                            this.order_goodsClassName[6].statu = true
                            item.commissionD = true
                            break; 
                        }
                    })
                    break;
                    case 3:  //删除
                    item.descriptionD = true
                    item.priceD = true
                    item.real_combo_numD = true
                    item.smallD = true
                    item.real_totalD = true
                    item.saleman_nameD = true
                    item.commissionD = true
                    // keyList.forEach(item3=>{
                    //      switch(item3){
                    //         case 'goods_name':
                    //         item.goods_name = item._dirty.goods_name
                    //         item.goods_nameD = true
                    //         break;
                    //         case 'price':
                    //         item.price = item._dirty.price
                    //         item.priceD = true
                    //         item.smallD = true
                    //         break;
                    //         case 'real_combo_num':
                    //         item.real_combo_num = item._dirty.real_combo_num
                    //         item.real_combo_numD = true
                    //         item.smallD = true
                    //         break;
                    //         case 'total_discount':
                    //         item.total_discount = item._dirty.total_discount
                    //         item.total_discountD = true
                    //         break;
                    //         case 'real_total':
                    //         item.real_total = item._dirty.real_total
                    //         item.real_totalD = true
                    //         break;
                    //         case 'saleman_name':
                    //         item.saleman_name = item._dirty.saleman_name
                    //         item.saleman_nameD = true
                    //         break;
                    //         case 'commission':
                    //         item.commission = item._dirty.commission
                    //         item.commissionD = true
                    //         break;
                    //     }
                    // })
                    break;
                }
            }
            
        })  
        if(Object.keys(this.order_base._dirty).length>=1){
            this.order_baseClassName.forEach(item=>{
                let r = item.name
                this.order_base[r] = false
                let d  = item.name1
                this.order_base[d] = false
            })
          let keyList = Object.getOwnPropertyNames(this.order_base._dirty)
          switch(this.order_base._dirty.action){
              case 1: //增加
              keyList.forEach(item2=>{
                  switch(item2){
                     case 'fk_hpl_id':
                     this.order_base.fk_hpl_id = this.order_base._dirty.fk_hpl_id
                     this.order_base.fk_hpl_idR = true
                     break;
                     case 'dub_name':
                     this.order_base.dub_name = this.order_base._dirty.dub_name
                     this.order_base.dub_nameR = true
                     break;
                     case 'endtime':
                     this.order_base.endtime = this.order_base._dirty.endtime
                     this.order_base.endtimeR = true
                     break;
                     case 'order_no':
                     this.order_base.order_no = this.order_base._dirty.order_no
                     this.order_base.order_noR = true
                     break;
                     case 'patient_name':
                     this.order_base.patient_name = this.order_base._dirty.patient_name
                     this.order_base.patient_nameR = true
                     break;
                     case 'patient_phone':
                     this.order_base.patient_phone = this.order_base._dirty.patient_phone
                     this.order_base.patient_phoneR = true
                     break;
                     case 'bed':
                     this.order_base.bed = this.order_base._dirty.bed
                     this.order_base.bedR = true
                     break;
                     case 'total':
                     this.order_base.total = this.order_base._dirty.total
                     this.order_base.totalR = true
                     break;
                     case 'has_pay':
                     this.order_base.has_pay = this.order_base._dirty.has_pay
                     this.order_base.has_payR = true
                     break;
                     case 'work_type':
                     this.order_base.work_type = this.order_base._dirty.work_type
                     this.order_base.work_typeR = true
                     break;
                  }
              })
              break;
              case 2: //修改
                keyList.forEach(item2=>{
                   switch(item2){
                       case 'fk_hpl_id':
                       this.order_baseClassName[0].statu = true
                       this.order_base.fk_hpl_idD = true
                       break;
                       case 'dub_name':
                       this.order_baseClassName[1].statu = true
                       this.order_base.dub_nameD = true
                       break;
                       case 'endtime':
                       this.order_baseClassName[2].statu = true
                       this.order_base.endtimeD = true
                       break;
                       case 'order_no':
                       this.order_baseClassName[3].statu = true
                       this.order_base.order_noD = true
                       break;
                       case 'patient_name':
                       this.order_baseClassName[4].statu = true
                       this.order_base.patient_nameD = true
                       break;
                       case 'patient_phone':
                       this.order_baseClassName[5].statu = true
                       this.order_base.patient_phoneD = true
                       break;
                       case 'bed':
                       this.order_baseClassName[6].statu = true
                        this.order_base.bedD = true
                       break;
                       case 'total':
                       this.order_baseClassName[7].statu = true
                       this.order_base.totalD = true
                       break;
                       case 'has_pay':
                       this.order_baseClassName[8].statu = true
                       this.order_base.has_payD = true
                       break;
                       case 'work_type':
                       this.order_baseClassName[9].statu = true
                       this.order_base.work_typeD = true
                       break;

                   }
                })
            break;
            case 3:  //删除
            keyList.forEach(item2=>{
                switch(item2){
                    case 'fk_hpl_id':
                    // this.order_base.fk_hpl_id = this.order_base._dirty.fk_hpl_id
                    this.order_base.fk_hpl_idD = true
                    break;
                    case 'dub_name':
                    // this.order_base.dub_name = this.order_base._dirty.dub_name
                    this.order_base.dub_nameD = true
                    break;
                    case 'endtime':
                    // this.order_base.endtime = this.order_base._dirty.endtime
                    this.order_base.endtimeD = true
                    break;
                    case 'order_no':
                    // this.order_base.order_no = this.order_base._dirty.order_no
                    this.order_base.order_noD = true
                    break;
                    case 'patient_name':
                    // this.order_base.patient_name = this.order_base._dirty.patient_name
                    this.order_base.patient_nameD = true
                    break;
                    case 'patient_phone':
                    // this.order_base.patient_phone = this.order_base._dirty.patient_phone
                    this.order_base.patient_phoneD = true
                    break;
                    case 'bed':
                    // this.order_base.bed = this.order_base._dirty.bed
                    this.order_base.bedD = true
                    break;
                    case 'total':
                    // this.order_base.total = this.order_base._dirty.total
                    this.order_base.totalD = true
                    break;
                    case 'has_pay':
                    // this.order_base.has_pay = this.order_base._dirty.has_pay
                    this.order_base.has_payD = true
                    break;
                    case 'work_type':
                    // this.order_base.work_type = this.order_base._dirty.work_type
                    this.order_base.work_typeD = true
                    break;
                }
            })
          }
        }
                    // console.log(this.order_base,111111111111)
    
    })}
  }
};
</script>
<style scoped>
.cBtn {
  position: absolute;
  right: 30px;
}
.orderTitle {
  padding-left: 10px;
  font-size: 17px;
  font-weight: bold;
}
.fs {
  font-size: 15px;
  /* font-weight: bold */
}
.red {
  color: red;
}
.del {
  text-decoration: line-through;
}
</style>