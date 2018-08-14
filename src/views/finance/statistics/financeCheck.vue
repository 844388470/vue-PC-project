<!-- by your name -->
<template>
    <div id="financeCheck"  v-loading="lodingtable" element-loading-text="拼命加载中">
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
                <el-button size="small" type="primary" @click="getExcel('main')">导出</el-button>
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
                prop="hospital_name" align="center" label="项目" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanr lh">{{scope.row.hospital_name}}</span>
                </template>
            </el-table-column>
            <el-table-column  
                prop="month" align="center" label="月份" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanr lh">{{scope.row.month}}</span>
                </template>
            </el-table-column>
            <el-table-column  
                prop="type" align="center" label="数据类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.data_type}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.data_type}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="pre_charge" align="center" label="当月预收" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.pre_charge}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.pre_charge}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="pre_balance" align="center" label="预收总结余" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.pre_balance}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.pre_balance}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="prev_advance_to_self_total" align="center" label="上期预收转本期收入" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">&nbsp;</span>
                    </div>
                    <div>
                        <span class="spanr lh spana" @click="openprice('shang',scope.row.pk_id,scope.row.month,scope.row.prev_advance_to_self_total,scope.row.data_type,scope.row.dub_name,scope.row.hospital_name)">{{scope.row.prev_advance_to_self_total}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="collection_amount" align="center" label="收款金额" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh spana" @click="openprice('shou',scope.row.pk_id,scope.row.month,item.collection_amount,item.data_type,scope.row.dub_name,scope.row.hospital_name)">{{item.collection_amount}}</span>
                    </div>
                    <div>
                        <span class="spanr lh spana" @click="openprice('shou',scope.row.pk_id,scope.row.month,scope.row.collection_amount,scope.row.data_type,scope.row.dub_name,scope.row.hospital_name)">{{scope.row.collection_amount}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="end_charge" align="center" label="结算总额" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.end_charge}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.end_charge}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="end_order_num" align="center" label="结算单数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.end_order_num}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.end_order_num}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="company_pay" align="center" label="公司管理费" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.company_pay}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.company_pay}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="staff_pay" align="center" label="护理员所得" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.staff_pay}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.staff_pay}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  
                prop="company_pay_proportion" align="center" label="管理费比例" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children_data" :key="this">
                        <span  class="lh">{{item.company_pay_proportion}}</span>
                    </div>
                    <div>
                        <span class="spanr lh">{{scope.row.company_pay_proportion}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="lock_text" align="center" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanr lh">{{scope.row.lock_text}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openDubOrGroup('dub',scope.row.pk_id,scope.row.is_lock,false,scope.row.fk_hpl_id)">按科室查看</span><span class="spanb" @click="openDubOrGroup('group',scope.row.pk_id,scope.row.is_lock,true,scope.row.fk_hpl_id)">按护理组查看</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            :visible.sync="dialogVisible"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-row :gutter="10" style="margin:0;" v-loading="loadingdetail">
                        <el-col :span="8">
                            <selector :typename="['hpl','dub']"  ref="hdseach" :colspan="[0,12,12,0,10]" :gutter="10" v-show="dorgtype=='dub'" :disable="[false,true,false,false]"></selector>
                            <selector :typename="['hpl','group']"  ref="hgseach" :colspan="[0,12,0,12,10]" :gutter="10" v-show="dorgtype=='group'" :disable="[false,true,false,false]"></selector>
                        </el-col>
                        <el-col :span="4" style="margin-bottom:10px;">
                            <el-select v-model="dorglist.pattern" placeholder="护理模式" clearable>
                                <el-option
                                    v-for="item in BsDate.nursingMode"
                                    :key="item.pk_id"
                                    :label="item.name"
                                    :value="item.pk_id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6" style="padding: 4px;">
                            <el-button size="small" @click="dorgchangesize(dorgpage.size)" type="primary">搜索</el-button>
                            <el-button size="small" type="primary" @click="getExcel('dub',dorgtype!=='dub')">明细导出</el-button>
                        </el-col>
                        <el-table
                            ref="dorg"
                            :data="dorglist.data"
                            :stripe="true"
                            v-loading="dorgloadingdetail"
                            tooltip-effect="dark"
                            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                            <el-table-column
                                prop="order_no" align="center" :label="dorgtype=='dub'?'科室':'护理组'+'/模式'" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{(dorgtype=='dub'?scope.row.dub_name:scope.row.group_name)+scope.row.pattern_text}}
                                </template>
                            </el-table-column>
                            <el-table-column  
                                prop="month" align="center" label="月份" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="pre_charge" align="center" label="当月预收" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="pre_balance" align="center" label="预收总结余" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="collection_amount" align="center" label="收款金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="spanb lh spana" @click="openprice('shou',scope.row.pk_id,scope.row.month,scope.row.collection_amount,'',dorgtype=='dub'?scope.row.dub_name:scope.row.group_name,(dorgtype=='dub'?scope.row.dub_name:scope.row.group_name)+scope.row.pattern_text)">{{scope.row.collection_amount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  
                                prop="end_charge" align="center" label="服务总额" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="end_order_num" align="center" label="结算单数" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="company_pay" align="center" label="公司管理费" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="staff_pay" align="center" label="护理员所得" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="company_pay_proportion" align="center" label="管理费比例" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <span class="spanb" @click="openDayOrMonth(scope.row.pk_id,1,dorglist.group)">月结</span><span class="spanb" @click="openDayOrMonth(scope.row.pk_id,2,dorglist.group)">日结</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Paging :widths="5" :pageIndex="dorgpage.index" :pageSize="dorgpage.size" :pageTotal="dorgpage.total" @changeSize="dorgchangesize" @changeIndex="dorgchangeindex"></Paging>
                    </el-row>
                </el-scrollbar>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="pricedialogVisible"
            fullscreen
            class="price"
            width="700px">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-row :gutter="10" style="margin:0;">
                        <h4><span class="spanr">{{pricelist.hpl_name}}</span><span  class="spanr ml20">收费合计:{{pricelist.total}}</span><span class="spanr fr ml10">{{pricelist.data_type}}</span><span class="spanr fr">{{pricelist.month}}</span></h4>
                        <el-table
                            ref="price"
                            :data="pricelist.data"
                            :stripe="true"
                            v-loading="priceloadingdetail"
                            tooltip-effect="dark"
                            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                            <el-table-column
                                prop="order_no" align="center" label="订单编号" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="spanb" @click="openorder(scope.row.pk_id)">{{scope.row.order_no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  
                                prop="patient_name" align="center" label="客户姓名" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="bed" align="center" label="床位" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="total" align="center" label="金额" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                        <Paging :widths="5" :pageIndex="pricepage.index" :pageSize="pricepage.size" :pageTotal="pricepage.total" @changeSize="pricechangesize" @changeIndex="pricechangeindex"></Paging>
                    </el-row>
                </el-scrollbar>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="daymdialogVisible"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-row :gutter="10" style="margin:0;" v-loading="daymloadingdetail">
                        <el-col :span="24" class="pl0 pr0">
                            <div class="flexn">
                                <h3><span>项目:{{daymlist.info.hospital_name}}</span><span>{{dorgtype=='dub'?'科室:'+daymlist.info.dub_name:'护理组:'+(daymlist.info.group_name || '一对一组') }}</span><span>护理模式:{{daymlist.info.pattern_text}}</span></h3>
                                <h3><span>当月预收:{{daymlist.info.pre_charge}}</span><span>预收单数:{{daymlist.info.pre_order_num}}</span><span>结算总额:{{daymlist.info.end_charge}}</span></h3>
                                <h3 v-if="dorgtype=='group'"><span>业务员抽成:{{daymlist.info.commission}}</span><span>居间服务费:{{daymlist.info.company_pay}}</span><span>员工工资:{{daymlist.info.staff_pay}}</span></h3>
                                <h3><span>结算单数:{{daymlist.info.end_order_num}}</span><span>状态:{{daymlist.info.lock_text}}</span><span>结算方式:{{daymlist.info.work_type_text}}</span></h3>
                                <div class="mt10 mb10"><el-button size="small" type="primary" @click="getExcel('work_type')">导出明细订单</el-button></div>
                            </div>
                        </el-col>
                        <h3>未结订单</h3>
                        <el-table
                            ref="daym"
                            :data="daymlist.no_list"
                            :stripe="true"
                            tooltip-effect="dark"
                            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                            <el-table-column
                                prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="spanb" @click="openorder(scope.row.pk_id)">{{scope.row.order_no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  
                                prop="patient_name" align="center" label="客户姓名" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="patient_phone" align="center" label="客户电话" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="bed" align="center" label="床号" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="total" align="center" label="金额" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column  
                                prop="endtime" align="center" label="结算日期" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                        <h3>结算订单</h3>
                        <el-table
                            ref="daym"
                            :data="daymlist.list"
                            :stripe="true"
                            tooltip-effect="dark"
                            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                            <el-table-column
                                prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span class="spanb" @click="openorder(scope.row.pk_id)">{{scope.row.order_no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  
                                prop="patient_name" align="center" label="客户姓名" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="patient_phone" align="center" label="客户电话" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="bed" align="center" label="床号" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="management_fee" align="center" label="管理费" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column  
                                prop="total" align="center" label="金额" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
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
import * as api from '@/api/statistics/financeCheck'
import * as BsDate from '@/assets/BasicData'
import {mapGetters} from 'vuex'
export default {
    name:'financeCheck',
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
            lodingtable:false,
            dialogVisible:false,
            pricedialogVisible:false,
            daymdialogVisible:false,
            loadingdetail:false,
            priceloadingdetail:false,
            dorgloadingdetail:false,
            daymloadingdetail:false,
            ratifiedloading:false,
            list:[],
            pricelist:{
                data:[],
                pk_id:'',
                month:'',
                total:'',
                dub_name:'',
                data_type:'',
                hpl_name:''
            },
            dorglist:{
                data:[],
                pk_id:'',
                fk_hpl_id:'',
                pattern:'',
                is_lock:'',
                group:''
            },
            daymlist:{
                no_list:[],
                list:[],
                info:{}
            },
            pricetype:'',
            dorgtype:'',
            pricepage:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            dorgpage:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            form:{
                
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
                'page':this.page.index
            }
            this.lodingtable=true
            this.list=[]
            api.getCheckList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        openprice(type,id,month,total,data_type,dub_name,hpl_name){
            for(let i in this.pricelist){
                if(typeof this.pricelist[i]==='object'){
                    this.pricelist[i]=[]
                }else{
                    this.pricelist[i]=''
                }
            }
            this.pricepage={index:1,size:20,total:0}
            this.pricelist.pk_id=id
            this.pricelist.month=month
            this.pricelist.total=total
            this.pricelist.data_type=data_type
            this.pricelist.dub_name=dub_name
            this.pricelist.hpl_name=hpl_name
            this.pricetype=type
            this.pricedialogVisible=true
            this.getPriceList()
        },
        openDubOrGroup(type,id,lock,group,hpl_id){
            this.loadingdetail=true
            for(let i in this.dorglist){
                if(typeof this.dorglist[i]==='object'){
                    this.dorglist[i]=[]
                }else{
                    this.dorglist[i]=''
                }
            }
            this.dorgpage={index:1,size:20,total:0}
            this.dorgtype=type
            this.dorglist.pk_id=id
            this.dorglist.fk_hpl_id=hpl_id
            this.dorglist.is_lock=lock
            this.dorglist.group=group
            this.dialogVisible=true
            setTimeout(()=>{
                this.$refs[group?'hgseach':'hdseach'].setSelect(false)
                this.$refs[group?'hgseach':'hdseach'].setdisabled([false,true,false,false])
                this.$refs[group?'hgseach':'hdseach'].setSelect({hpl:hpl_id}).then(()=>{
                    this.loadingdetail=false
                    this.getDubOrGroupList()
                })
            },100)
        },
        openDayOrMonth(id,type,group){
            this.daymlist={
                no_list:[],
                list:[],
                info:{}
            }
            this.daymdialogVisible=true
            this.daymloadingdetail=true
            api.getCheckDayOrMonthList({
                pk_id:id,
                work_type:type,
                group:group
            }).then(res=>{
                this.daymloadingdetail=false
                this.daymlist.no_list=res.data.pre_orders
                this.daymlist.info=res.data.info
                this.daymlist.list=res.data.end_orders
            }).catch(()=>{this.daymloadingdetail=false})
        },
        getDubOrGroupList(){                               //获取科室查看或护理组查看列表
            this.dorgloadingdetail=true
            api.getCheckDubOrGroupList({
                page:this.dorgpage.index,
                limit:this.dorgpage.size,
                pk_id:this.dorglist.pk_id,
                pattern:this.dorglist.pattern?this.dorglist.pattern:0,
                is_lock:this.dorglist.is_lock,
                group:this.dorglist.group,
                group_id:this.dorgtype==='group'?this.$refs.hgseach.getSelect()[1] || '':'',
                fk_dub_id:this.dorgtype==='dub'?this.$refs.hdseach.getSelect()[1] || '':''
            }).then(res=>{
                this.dorgloadingdetail=false
                this.dorglist.data=res.data.data
                this.dorgpage.total=res.data.total
            }).catch(()=>{this.dorgloadingdetail=false})
        },
        getPriceList(){                               //获取收款金额或上期预收转本期收入列表
            if(this.pricetype==='shou'){
                this.priceloadingdetail=true
                api.getCheckShouList({
                    page:this.pricepage.index,
                    limit:this.pricepage.size,
                    pk_id:this.pricelist.pk_id,
                    month:this.pricelist.month,
                    total:this.pricelist.total,
                    dub_name:this.pricelist.dub_name,
                    data_type:this.pricelist.data_type
                }).then(res=>{
                    this.priceloadingdetail=false
                    this.pricelist.data=res.data.data
                    this.pricepage.total=res.data.total
                }).catch(()=>{this.priceloadingdetail=false})
            }else if(this.pricetype==='shang'){
                this.priceloadingdetail=true
                api.getCheckShangList({
                    page:this.pricepage.index,
                    limit:this.pricepage.size,
                    pk_id:this.pricelist.pk_id,
                    month:this.pricelist.month,
                    total:this.pricelist.total,
                    hpl_name:this.pricelist.hpl_name
                }).then(res=>{
                    this.priceloadingdetail=false
                    this.pricelist.data=res.data.data
                    this.pricepage.total=res.data.total
                }).catch(()=>{this.priceloadingdetail=false})
            }
        },
        pricechangesize(val){                                 //改变金额列表分页数量
            this.pricepage.size=val
            this.pricepage.index=1
            this.getPriceList()
        },
        pricechangeindex(val){                                //改变金额列表当前页
            this.pricepage.index=val
            this.getPriceList()
        },
        dorgchangesize(val){                                 //改变科室查看或护理组查看分页数量
            this.dorgpage.size=val
            this.dorgpage.index=1
            this.getDubOrGroupList()
        },
        dorgchangeindex(val){                                //改变科室查看或护理组查看当前页
            this.dorgpage.index=val
            this.getDubOrGroupList()
        },
        openorder(pk_id){
            this.$refs.orderde.openeditor(pk_id)
        },
        ratified(){
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
            api.setCheckPrecheck({
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
        getExcel(type,group){
            if(type==='main'){
                // if(!this.$refs.ohseach.getSelect()[0]){
                //     this.$message({
                //         message: '请选择公司',
                //         type: 'warning'
                //     })
                //     return
                // }else if(!this.search.start){
                //     this.$message({
                //         message: '请选择要核定的月份',
                //         type: 'warning'
                //     })
                //     return
                // }
                // console.log('export=hpl&&fk_org_id='+this.$refs.ohseach.getSelect()[0]+'&&fk_hpl_id='+this.$refs.ohseach.getSelect()[1]+'&&start='+this.search.start+'&&end='+this.search.end+'&&is_lock='+this.search.is_lock)
                window.open(process.env.host+'/finance_check_excel?export=hpl&&fk_org_id='+this.$refs.ohseach.getSelect()[0]+'&&fk_hpl_id='+this.$refs.ohseach.getSelect()[1]+'&&start='+this.search.start+'&&end='+this.search.end+'&&is_lock='+this.search.is_lock)
            }else if(type==='dub'){
                if(group){
                    window.open(process.env.host+'/finance_check_excel?export=dub&&group=true&&pid='+this.dorglist.pk_id+'&&fk_group_id='+(this.$refs.hgseach.getSelect()[1] || '')+'&&fk_hpl_id='+(this.$refs.hgseach.getSelect()[0] || '')+'&&pattern='+(this.dorglist.pattern?this.dorglist.pattern:0))
                }else{
                    window.open(process.env.host+'/finance_check_excel?export=dub&&pid='+this.dorglist.pk_id+'&&fk_dub_id='+(this.$refs.hdseach.getSelect()[1] || '')+'&&fk_hpl_id='+(this.$refs.hdseach.getSelect()[0] || '')+'&&pattern='+(this.dorglist.pattern?this.dorglist.pattern:0))
                }
            }else if(type==='work_type'){
                window.open(process.env.host+'/finance_check_excel?export=work_type&&pid='+(this.daymlist.info.pid || '')+'&&work_type='+(this.daymlist.info.pattern || 0)+'&&group='+(this.dorgtype!=='dub'))
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
    #financeCheck{
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
    #financeCheck{
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