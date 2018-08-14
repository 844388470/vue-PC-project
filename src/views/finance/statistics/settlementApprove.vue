<!-- by your name -->
<template>
    <div id="settlementApprove"  v-loading="tableloding" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="8">
                <selector :typename="['org','hpl']"  ref="ohseach" :colspan="[12,12,0,0,10]" :gutter="10"></selector>
            </el-col>
            <el-col :span="3" style="margin-bottom:10px;">
                <el-date-picker
                    v-model="search.start"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="开始月份"
                    :clearable="false"
                    :unlink-panels="true">
                </el-date-picker>
            </el-col>
            <el-col :span="3" style="margin-bottom:10px;">
                <el-date-picker
                    v-model="search.end"
                    type="month"
                    placeholder="结束月份"
                    value-format="yyyy-MM"
                    :clearable="false"
                    :unlink-panels="true">
                </el-date-picker>
            </el-col>
            <el-col :span="4" style="margin-bottom:10px;">
                <el-select v-model="search.is_lock" placeholder="状态">
                    <el-option
                        v-for="item in BsDate.isLock"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6" style="padding: 4px;">
                <el-button size="small" @click="changesize(page.size)" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="">导出</el-button>
                <el-button size="small" type="primary" @click="ratified" :loading="ratifiedloading">核定</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent">
            <el-table-column
                prop="month" align="center" label="月份" show-overflow-tooltip sortable>
            </el-table-column>
            <el-table-column
                prop="hospital_name" align="center" label="项目" show-overflow-tooltip sortable>
            </el-table-column>
            <el-table-column  
                prop="collection_amount" align="center" label="收款总额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="end_order_num" align="center" label="已结单数" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="end_charge" align="center" label="结算总额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="staff_day_pay" align="center" label="日结护工费" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="staff_month_pay" align="center" label="月结护工费" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="commission" align="center" label="业务提成" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="company_pay" align="center" label="公司管理费" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="company_pay_proportion" align="center" label="管理费比例" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="pre_charge" align="center" label="当月预收" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="pre_balance" align="center" label="预收结余" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="lock_text" align="center" label="状态" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope" v-if="scope.row.pk_id">
                    <span class="spanb" @click="setLock(scope.row.pk_id,scope.row.is_lock===0?1:0)">{{scope.row.is_lock===0?'锁定':'解锁'}}</span><span class="spanb" @click="openRece(scope.row)">收款明细</span><span class="spanb" @click="openSett(scope.row)">结算明细</span><span class="spanb" @click="openColl(scope.row)">预收明细</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            :visible.sync="settdialogVisible"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-row :gutter="10" style="margin:0;">
                        <el-col :span="6">
                            <selector :typename="['hpl','group']"  ref="hgseach" :colspan="[0,12,0,12,10]" :gutter="10"></selector>
                        </el-col>
                        <el-col :span="6">
                            <el-date-picker
                                v-model="settlist.time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="4" style="margin-bottom:10px;">
                            <el-select v-model="settlist.pattern" placeholder="护理模式" clearable>
                                <el-option
                                    v-for="item in BsDate.nursingMode"
                                    :key="item.pk_id"
                                    :label="item.name"
                                    :value="item.pk_id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" style="margin-bottom:10px;">
                            <el-select v-model="settlist.work_type" placeholder="护工结算" clearable>
                                <el-option
                                    v-for="item in [{pk_id:1,name:'月结'},{pk_id:2,name:'日结'}]"
                                    :key="item.pk_id"
                                    :label="item.name"
                                    :value="item.pk_id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" style="margin-bottom:10px;">
                            <el-input v-model="settlist.order_no" placeholder="订单号"></el-input>
                        </el-col>
                        <el-col :span="6"  style="margin-bottom:10px;">
                            <el-button size="small" @click="settchangesize(settpage.size)" type="primary">搜索</el-button>
                            <el-button size="small" type="primary" @click="">明细导出</el-button>
                        </el-col>
                        <el-col :span="24"  style="margin-bottom:10px;">
                            <h2><span>结算明细</span><span class="spana ml10 spanb">{{settlist.month}}</span><span class="ml10 spanr">结算总额:{{settlist.collection_amount}}</span><span class="ml10 spanr">日结护工费:{{settlist.staff_day_pay}}</span><span class="ml10 spanr">月结护工费:{{settlist.staff_month_pay}}</span><span class="ml10 spanr">业务提成:{{settlist.commission}}</span><span class="ml10 spanr">公司管理费:{{settlist.company_pay}}</span></h2>
                        </el-col>
                        <el-col :span="24"  style="margin-bottom:0px;">
                            <el-table
                                ref="sett"
                                :data="settlist.data"
                                :stripe="true"
                                v-loading="settlistloading"
                                tooltip-effect="dark"
                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                <el-table-column
                                    prop="endtime" align="center" label="结算日期" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span class="spanb" @click="openorder(scope.row.pk_id)">{{scope.row.order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="hospital_name" align="center" label="项目名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="good_name" align="center" label="品名描述" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="pattern" align="center" label="护理模式" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="work_type" align="center" label="护工结算" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="end_order_num" align="center" label="护工/组别" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.server_infos" :key="this">
                                            <span  class="lh">{{item.stf_name}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="end_order_num" align="center" label="服务开始" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.server_infos" :key="this">
                                            <span  class="lh">{{item.start}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="end_order_num" align="center" label="服务结束" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.server_infos" :key="this">
                                            <span  class="lh">{{item.end}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="end_total" align="center" label="结算总额" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="staff_paid_total" align="center" label="日结护工费" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="staff_unpaid_total" align="center" label="月结护工费" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="commission" align="center" label="业务提成" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="company_pay" align="center" label="公司管理费" show-overflow-tooltip>
                                </el-table-column>
                            </el-table>
                            <Paging :pageIndex="settpage.index" :pageSize="settpage.size" :pageTotal="settpage.total" @changeSize="settchangesize" @changeIndex="settchangeindex"></Paging>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="recedialogVisible"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-row :gutter="10" style="margin:0;">
                        <el-col :span="4" style="margin-bottom:10px;">
                            <el-input v-model="recelist.order_no" placeholder="订单号"></el-input>
                        </el-col>
                        <el-col :span="6"  style="margin-bottom:10px;">
                            <el-button size="small" @click="recechangesize(recepage.size)" type="primary">搜索</el-button>
                            <el-button size="small" type="primary" @click="">明细导出</el-button>
                        </el-col>
                        <el-col :span="24"  style="margin-bottom:10px;">
                            <h2><span>收款明细</span><span class="spana ml10 spanb">{{recelist.month}}</span><span class="ml10 spanr">收款总额:{{recelist.charge_total}}</span><span class="ml10 spanr">订单数量:{{recelist.count}}</span></h2>
                        </el-col>
                        <el-col :span="24"  style="margin-bottom:0px;">
                            <el-table
                                ref="rece"
                                :data="recelist.data"
                                :stripe="true"
                                v-loading="recelistloading"
                                tooltip-effect="dark"
                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                <el-table-column
                                    prop="bill_time" align="center" label="开单日期" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span class="spanb" @click="openorder(scope.row.pk_id)">{{scope.row.order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="hospital_name" align="center" label="项目名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="stf_name" align="center" label="护工/组别" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="good_name" align="center" label="品名描述" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="pattern" align="center" label="护理模式" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="work_type" align="center" label="护工结算" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="end_order_num" align="center" label="收付金额" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.charge_infos" :key="this">
                                            <span  class="lh">{{item.price}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="end_order_num" align="center" label="收费方式" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.charge_infos" :key="this">
                                            <span  class="lh">{{item.pay_type}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="charge_total" align="center" label="收款合计" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="endtime" align="center" label="结算日期" show-overflow-tooltip>
                                </el-table-column>
                            </el-table>
                            <Paging :pageIndex="recepage.index" :pageSize="recepage.size" :pageTotal="recepage.total" @changeSize="recechangesize" @changeIndex="recechangeindex"></Paging>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="colldialogVisible"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-row :gutter="10" style="margin:0;">
                        <el-col :span="4" style="margin-bottom:10px;">
                            <el-input v-model="colllist.order_no" placeholder="订单号"></el-input>
                        </el-col>
                        <el-col :span="6"  style="margin-bottom:10px;">
                            <el-button size="small" @click="collchangesize(collpage.size)" type="primary">搜索</el-button>
                            <el-button size="small" type="primary" @click="">明细导出</el-button>
                        </el-col>
                        <el-col :span="24"  style="margin-bottom:10px;">
                            <h2><span>预收明细</span><span class="spana ml10 spanb">{{colllist.month}}</span><span class="ml10 spanr">预收总额:{{colllist.pre_total}}</span><span class="ml10 spanr">订单数量:{{colllist.count}}</span></h2>
                        </el-col>
                        <el-col :span="24"  style="margin-bottom:0px;">
                            <el-table
                                ref="coll"
                                :data="colllist.data"
                                :stripe="true"
                                v-loading="colllistloading"
                                tooltip-effect="dark"
                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                <el-table-column
                                    prop="bill_time" align="center" label="开单日期" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span class="spanb" @click="openorder(scope.row.pk_id)">{{scope.row.order_no}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="hospital_name" align="center" label="项目名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="stf_name" align="center" label="护工/组别" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="good_name" align="center" label="品名描述" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="pattern" align="center" label="护理模式" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="work_type" align="center" label="护工结算" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="pre_total" align="center" label="预收小计" show-overflow-tooltip>
                                </el-table-column>
                            </el-table>
                            <Paging :pageIndex="collpage.index" :pageSize="collpage.size" :pageTotal="collpage.total" @changeSize="collchangesize" @changeIndex="collchangeindex"></Paging>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </el-dialog>
        <orderdetails ref="orderde" @getList=""></orderdetails>
    </div>
</template>

<script>
import selector from '@/components/selector'
import orderdetails from '@/components/orderdetails'
import Pagemixin from '@/mixins/index'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/statistics/settlementApprove'
import * as BsDate from '@/assets/BasicData'
import {mapGetters} from 'vuex'
export default {
    name:'settlementApprove',
    mixins:[Pagemixin],
    components:{selector,orderdetails},
    data () {
        return {
            func,
            BsDate,
            search:{
                start:func.getYearMonth(new Date()),
                end:func.getYearMonth(new Date()),
                is_lock:-1
            },
            settdialogVisible:false,
            recedialogVisible:false,
            colldialogVisible:false,
            tableloding:false,
            settlistloading:false,
            recelistloading:false,
            colllistloading:false,
            ratifiedloading:false,
            list:[],
            settlist:{
                data:[],
                time:[],
                pk_id:'',
                fk_hpl_id:'',
                group_id:'',
                start:'',
                end:'',
                order_no:'',
                pattern:'',
                work_type:'',
                month:'',
                collection_amount:'',
                staff_day_pay:'',
                staff_month_pay:'',
                commission:'',
                company_pay:''
            },
            settpage:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            recelist:{
                data:[],
                pk_id:'',
                order_no:'',
                month:'',
                charge_total:'',
                count:''
            },
            recepage:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            colllist:{
                data:[],
                pk_id:'',
                order_no:'',
                month:'',
                pre_total:'',
                count:''
            },
            collpage:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            }
        }
    },
    methods:{
        getList(){
            let position=this.$refs.ohseach.getSelect()
            let data={
                'fk_org_id':position[0],
                'fk_hpl_id':position[1],
                'start':this.search.start,
                'end':this.search.end,
                'is_lock':this.search.is_lock,
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.tableloding=true
            this.list=[]
            api.getCheckList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.tableloding=false
            }).catch(_=>{
                this.tableloding=false
            })
        },
        openSett(data){
            this.settlist.time=[]
            for(let i in this.settlist){
                if(typeof this.settlist[i]==='object'){
                    this.settlist[i]=[]
                }else{
                    this.settlist[i]=''
                }
            }
            this.settpage={index:1,size:20,total:0}
            this.settlist.pk_id=data.pk_id
            this.settlist.month=data.month
            this.settlist.collection_amount=data.collection_amount
            this.settlist.staff_day_pay=data.staff_day_pay
            this.settlist.staff_month_pay=data.staff_month_pay
            this.settlist.commission=data.commission
            this.settlist.company_pay=data.company_pay
            this.settdialogVisible=true
            setTimeout(()=>{
                this.$refs.hgseach.setSelect(false)
                this.getSettList()
            },100)
        },
        getSettList(){                               //获取结算明细列表
            this.settlistloading=true
            api.getCheckSettList({
                page:this.settpage.index,
                limit:this.settpage.size,
                pk_id:this.settlist.pk_id,
                start:this.settlist.time?(this.settlist.time[0]||''):'',
                end:this.settlist.time?(this.settlist.time[1]||''):'',
                order_no:this.settlist.order_no,
                fk_hpl_id:this.$refs.hgseach.getSelect()[0]||'',
                group_id:this.$refs.hgseach.getSelect()[1]||'',
                pattern:this.settlist.pattern || 0,
                work_type:this.settlist.work_type || 0
            }).then(res=>{
                this.settlistloading=false
                this.settlist.data=res.data.data
                this.settpage.total=res.data.total
            }).catch(()=>{this.settlistloading=false})
        },
        settchangesize(val){                                 //结算明细分页数量
            this.settpage.size=val
            this.settpage.index=1
            this.getSettList()
        },
        settchangeindex(val){                                //结算明细当前页
            this.settpage.index=val
            this.getSettList()
        },
        openRece(data){
            for(let i in this.recelist){
                if(typeof this.recelist[i]==='object'){
                    this.recelist[i]=[]
                }else{
                    this.recelist[i]=''
                }
            }
            this.recepage={index:1,size:20,total:0}
            this.recelist.pk_id=data.pk_id
            this.recelist.month=data.month
            // this.recelist.count=data.end_order_num
            this.recelist.charge_total=data.collection_amount
            this.recedialogVisible=true
            this.getReceList()
        },
        getReceList(){                               //获取结算明细列表
            this.recelistloading=true
            api.getCheckReceList({
                page:this.recepage.index,
                limit:this.recepage.size,
                pk_id:this.recelist.pk_id,
                month:this.recelist.month,
                charge_total:this.recelist.charge_total,
                order_no:this.recelist.order_no
            }).then(res=>{
                this.recelistloading=false
                this.recelist.data=res.data.data
                this.recelist.count=res.data.title.count
                this.recepage.total=res.data.total
            }).catch(()=>{this.recelistloading=false})
        },
        recechangesize(val){                                 //收款明细分页数量
            this.recepage.size=val
            this.recepage.index=1
            this.getReceList()
        },
        recechangeindex(val){                                //收款明细当前页
            this.recepage.index=val
            this.getReceList()
        },
        openColl(data){
            for(let i in this.colllist){
                if(typeof this.colllist[i]==='object'){
                    this.colllist[i]=[]
                }else{
                    this.colllist[i]=''
                }
            }
            this.collpage={index:1,size:20,total:0}
            this.colllist.pk_id=data.pk_id
            this.colllist.month=data.month
            this.colllist.pre_total=data.pre_charge
            this.colldialogVisible=true
            this.getCollList()
        },
        getCollList(){                               //获取结算明细列表
            this.colllistloading=true
            api.getCheckCollList({
                page:this.collpage.index,
                limit:this.collpage.size,
                pk_id:this.colllist.pk_id,
                month:this.colllist.month,
                pre_total:this.colllist.pre_total,
                order_no:this.colllist.order_no
            }).then(res=>{
                this.colllistloading=false
                this.colllist.data=res.data.data || []
                this.colllist.count=res.data.title.count
                this.collpage.total=res.data.total
            }).catch(()=>{this.colllistloading=false})
        },
        collchangesize(val){                                 //收款明细分页数量
            this.collpage.size=val
            this.collpage.index=1
            this.getCollList()
        },
        collchangeindex(val){                                //收款明细当前页
            this.collpage.index=val
            this.getCollList()
        },
        openorder(pk_id){
            this.$refs.orderde.openeditor(pk_id)
        },
        ratified(){                                         //核定
            if(!this.$refs.ohseach.getSelect()[1]){
                this.$message({
                    message: '请选择项目',
                    type: 'warning'
                })
                return
            }else if(!this.search.start){
                this.$message({
                    message: '请选择要核定的月份',
                    type: 'warning'
                })
                return
            }
            this.ratifiedloading=true
            api.setCheckSprecheck({
                fk_hpl_id:this.$refs.ohseach.getSelect()[1],
                start:this.search.start
            }).then(res=>{
                this.$message({
                    message: res.message,
                    type: 'success'
                })
                this.ratifiedloading=false
            }).catch(()=>{this.ratifiedloading=false})
        },
        setLock(id,isLock){                                         //解锁或锁定
            api.setCheckLock({
                is_lock:isLock,
                pk_id:id,
                type:0
            }).then(res=>{
                this.$message({
                    message: res.message,
                    type: 'success'
                })
                this.getList()
            }).catch(()=>{})
        },
        getExcel(type,group){                                   //导出
            if(type==='main'){
                window.open(process.env.host+'/finance_check_excel?export=hpl&&fk_org_id='+this.$refs.ohseach.getSelect()[0]+'&&fk_hpl_id='+this.$refs.ohseach.getSelect()[1]+'&&start='+this.search.start+'&&end='+this.search.end+'&&is_lock='+this.search.is_lock)
            }else if(type==='dub'){
                if(group){
                    window.open(process.env.host+'/finance_check_excel?export=dub&&group=true&&pid='+this.dorglist.pk_id+'&&fk_group_id='+(this.$refs.hgseach.getSelect()[1] || '')+'&&pattern='+(this.dorglist.pattern?this.dorglist.pattern:0))
                }else{
                    window.open(process.env.host+'/finance_check_excel?export=dub&&pid='+this.dorglist.pk_id+'&&fk_group_id='+(this.$refs.hgseach.getSelect()[1] || '')+'&&pattern='+(this.dorglist.pattern?this.dorglist.pattern:0))
                }
            }else if(type==='work_type'){
                window.open(process.env.host+'/finance_check_excel?export=work_type&&pid='+(this.daymlist.info.pid || '')+'&&work_type='+(this.daymlist.info.pattern || 0))
            }
        }
    },
    watch:{
        
    },
    mounted(){
        this.getList()
    },
    computed: {
        ...mapGetters(['loading'])
    }
}
</script>
<style lang='scss' scoped>
    #settlementApprove{
        .lh{
            line-height:50px;
        }
        .spanr{
            color: #f56c6c;
            margin-right: 0;
            cursor: auto;
        }
        .spana{
            font-weight: bold;
            cursor: pointer;
        }
        .flexn{
            h3{
                display: flex;
                span{
                    flex:1;
                    line-height:40px;
                }
            }
        }
    }
</style>
<style lang='scss'>
    #settlementApprove{
        .el-date-editor{width:100%;}
        .el-dialog{
            margin-top:0;
            top:5%;
            height:90%;
        }
        .price.el-dialog{
            margin-top:0;
            top:10%;
            height:80%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 5px;
            padding-bottom: 10px;
            top: 40px;
            left:0;right:0;
            bottom: 10px;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
        .el-dialog__footer{
            position: absolute;
            bottom: 0;
            left:0;right:0;
        }
    }
</style>