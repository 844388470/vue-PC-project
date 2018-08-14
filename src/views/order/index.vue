<!-- by your name -->
<template>
    <div id="orderIndex"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="12">
                <selector :typename="['hpl','dub','group']"  ref="hdgseach" :colspan="[0,8,8,8,10]" :gutter="10" :plac="{hpl:'请选择营业网点'}"></selector>
            </el-col>
            <el-col  :xs="12" :sm="10" :lg="6" style="margin-bottom:10px;">
                <el-date-picker
                    v-model="search.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :unlink-panels="true"
                    >
                </el-date-picker>
            </el-col>
             </el-row>
            <el-row  :gutter="10">
            <el-col :span="3" style="margin-bottom:10px;">
                <el-input v-model="search.order_no" placeholder="订单号"></el-input>
            </el-col>
            <el-col :span="3" style="margin-bottom:10px;">
                <el-input v-model="search.patient_name" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model="search.pattern" placeholder="护理模式" clearable>
                    <el-option
                        v-for="item in BsDate.nursingMode"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="search.is_end" placeholder="是否结算" clearable>
                    <el-option
                        v-for="item in BsDate.orderStatus"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col  :xs="12" :sm="9" :lg="6" style="padding: 4px;">
                <el-button size="small" @click="changesize(page.size)" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="openeditor(false)" v-if="authority.indexOf('orders/create')!==-1">新增</el-button>
                <el-button size="small" type="primary" @click="luru" v-if="authority.indexOf('orders/get_null_input')!==-1">录入</el-button>
                <el-button size="small" type="primary" @click="logWatch" v-show="showLog">日志查看</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent" @row-click="rowClick">
            <el-table-column
                type="selection"  align="center" width="55">
            </el-table-column>
            <el-table-column
                prop="order_no" align="center" label="订单号" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column  prop="group_name" align="center" label="护理组" show-overflow-tooltip>
                <!--template slot-scope="scope">
                    {{func.filterName(scope.row.group_id,$store.getters.group_list)}}
                </template-->
            </el-table-column>
            <el-table-column align="center" label="护理模式" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{func.filterName(scope.row.pattern,BsDate.nursingMode)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="patient_name" align="center" label="患者姓名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                prop="dub_name" align="center" label="科室" show-overflow-tooltip sortable="custom">
                <!--template slot-scope="scope">
                    {{func.filterName(scope.row.fk_dub_id,$store.getters.dub_list)}}
                </template-->
            </el-table-column>
            <el-table-column
                prop="bed" align="center" label="床号" show-overflow-tooltip >
            </el-table-column>
            <el-table-column
                prop="goods_name" align="center" label="产品" show-overflow-tooltip >
            </el-table-column>
            <el-table-column
                prop="total" align="center" label="订单总额" show-overflow-tooltip >
            </el-table-column>
            <el-table-column
                prop="bill_time" align="center" label="开单时间" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column
                prop="endtime" align="center" label="结算日期" show-overflow-tooltip sortable="custom">
                <template slot-scope="scope">
                    {{scope.row.endtime?scope.row.endtime.slice(0,10):''}}
                </template>
            </el-table-column>
            <el-table-column
                prop="input_time" align="center" label="录入时间" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column
                prop="operator_id_name" align="center" label="操作员" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row.pk_id)">编辑</span><!--span class="spanb" @click="">打印</span-->
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <orderdetails ref="orderde" @getList="getList"></orderdetails>
        <log ref="lmPkid"></log>
    </div>
</template>

<script>
import selector from '@/components/selector'
import orderdetails from '@/components/orderdetails'
import log from '@/components/log'
import Pagemixin from '@/mixins/index'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/order'
import * as BsDate from '@/assets/BasicData'
import {mapGetters} from 'vuex'
export default {
    name:'orderIndex',
    mixins:[Pagemixin],
    components:{selector,orderdetails,log},
    data () {
        return {
            func,
            BsDate,
            search:{
                order_no:'',
                patient_name:'',
                is_end:'',
                pattern:'',
                time:[]
            },
            lodingtable:false,
            list:[],
            authority:[],
            focusId:'',
            showLog:false, //查看日志按钮
        }
    },
    methods:{
        getList(){
            let position=this.$refs.hdgseach.getSelect()
            let data={
                'patient_name':this.search.patient_name,
                'order_no':this.search.order_no,
                'is_end':this.search.is_end,
                'pattern':this.search.pattern,
                'limit':this.page.size,
                'start':this.search.time?this.search.time[0]:'',
                'end':this.search.time?this.search.time[1]:'',
                'fk_hpl_id':position[0],
                'fk_dub_id':position[1],
                'group_id':position[2],
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getOrderList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        deleteitem(state,index){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(state){
                    
                }else{
                    this.form.table.splice(index,1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })          
            })
        },
        openeditor(pk_id){
            this.$refs.orderde.openeditor(pk_id)
        },
        luru(){
            api.getLuruId().then(res=>{
                this.openeditor(res.data.pk_id)
            }).catch(()=>{})
        },
        //点击表格行
        rowClick(row,event,column){
            console.log(row)
            this.focusId = row.pk_id
        },
        //查看日志
        logWatch(){
            if(this.focusId){
            this.$refs.lmPkid.open(this.focusId)
            }else{
                 this.$message('请先选择订单');
            }
        }
    },
    watch:{
        
    },
    mounted(){
        let power = JSON.parse(sessionStorage.getItem('addRouters')).data.filter(i=>i.name=='业务管理')[0].children.filter(a=>a.name=="业务登记")[0].permissions
        if(power.indexOf('orders/log')!=-1){
            this.showLog = true
        }
        this.authority=this.$route.meta.permissions
        this.getList()
    },
    computed: {
        ...mapGetters(['loading'])
    }
}
</script>
<style lang='scss' scoped>
    #orderIndex{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>