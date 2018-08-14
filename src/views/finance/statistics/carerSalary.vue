<!-- by your name -->
<template>
    <div id="carerSalary"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="8">
                <selector :typename="['hpl','group']"  ref="hgseach" :colspan="[0,12,0,12,10]" :gutter="10"></selector>
            </el-col>
            <el-col :span="4" style="margin-bottom:10px;">
                <el-date-picker
                    v-model="search.month"
                    type="month"
                    placeholder="请选择日期"
                    :unlink-panels="true"
                    value-format="yyyy-MM"
                    >
                </el-date-picker>
            </el-col>
            <el-col :span="4" style="margin-bottom:10px;">
                <el-input v-model="search.staff_no" placeholder="工号"></el-input>
            </el-col>
            <el-col :span="4" style="margin-bottom:10px;">
                <el-input v-model="search.name" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="24" style="padding: 4px;">
                <el-button size="small" @click="changesize(page.size)" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="buttons('excel')">导出</el-button>
                <el-button size="small" type="primary" @click="buttons('detailexcel')">导出明细</el-button>
                <el-button size="small" type="primary" @click="buttons('lock',1)">锁定</el-button>
                <el-button size="small" type="primary" @click="buttons('lock',0)">解锁</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent">
            <!--el-table-column
                type="selection"  align="center" width="55">
            </el-table-column-->
            <el-table-column
                prop="name" align="center" label="姓名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  prop="staff_no" align="center" label="工号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="项目名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{func.filterName(scope.row.fk_hpl_id,$store.getters.hpl_list)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="group_name" align="center" label="护理组" show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                prop="month" align="center" label="月份" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="other" align="center" label="其他" show-overflow-tooltip >
            </el-table-column>
            <el-table-column
                prop="commission" align="center" label="业务提成" show-overflow-tooltip >
            </el-table-column>
            <el-table-column
                prop="share_nursing" align="center" label="整体计薪" show-overflow-tooltip >
            </el-table-column>
            <el-table-column
                prop="personal_nursing" align="center" label="一对一计薪" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="total" align="center" label="薪酬合计" show-overflow-tooltip>
            </el-table-column>
            <el-table-column 
                prop="lock_str" align="center" label="状态" show-overflow-tooltip> 
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row.pk_id)">查看</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title="明细"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false" 
            fullscreen
            width="80%">
            <div style="height:100%" v-loading="loadingdetail">
                <el-scrollbar style="height:100%;" ref="scrollbar">
                    <h2 class="mb15"><span>{{form.base_data.name}}</span><span style="margin-left: 30px;font-size: 18px;" class="spanr">总计:{{form.base_data.total}}</span></h2>
                    <h3><span>一对一收入</span><span style="margin-left: 30px;font-size: 18px;float: right;" class="spanr">小计:{{form.personal_nursing_total}}</span></h3>
                    <el-table
                        :data="form.personal_nursing_salary"
                        :stripe="true"
                        tooltip-effect="dark"
                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                        <el-table-column
                            prop="hospital_name" align="center" label="项目" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column  prop="dub_name" align="center" label="科室" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="goods_name" align="center" label="产品" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column 
                            prop="start" align="center" label="服务起始" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="end" align="center" label="服务结束" show-overflow-tooltip >
                        </el-table-column>
                        <el-table-column
                            prop="day_num" align="center" label="天/次数" show-overflow-tooltip >
                        </el-table-column>
                        <el-table-column
                            prop="staff_pay" align="center" label="护理员所得" show-overflow-tooltip >
                        </el-table-column>
                    </el-table>
                    <h3><span>整体护理收入</span><span style="margin-left: 30px;font-size: 18px;float: right;" class="spanr">小计:{{form.share_nursing_total }}</span></h3>
                    <el-table
                        :data="form.share_nursing_salary"
                        :stripe="true"
                        tooltip-effect="dark"
                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                        <el-table-column prop="dub_name" align="center" label="护理组" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column  prop="day_shift" align="center" label="白班" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="night_shift" align="center" label="夜班" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="day_night_shift" align="center" label="连班" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="half_shift" align="center" label="半天班" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="total_days" align="center" label="总考勤" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="nursing_fee" align="center" label="护理费" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="subsidy" align="center" label="补贴" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="salary" align="center" label="总额" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                    <h3><span>业务抽成</span><span style="margin-left: 30px;font-size: 18px;float: right;" class="spanr">小计:{{form.commission_total}}</span></h3>
                    <el-table
                        :data="form.commission_salary"
                        :stripe="true"
                        tooltip-effect="dark"
                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                        <el-table-column prop="hospital_name" align="center" label="项目" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column  prop="dub_name" align="center" label="科室" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="order_no" align="center" label="订单号" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="goods_name" align="center" label="产品" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="num" align="center" label="数量" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="commission" align="center" label="合计抽成" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import selector from '@/components/selector'
import Pagemixin from '@/mixins/index'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/statistics/carerSalary'
import * as BsDate from '@/assets/BasicData'
import {mapGetters} from 'vuex'
export default {
    name:'carerSalary',
    mixins:[Pagemixin],
    components:{selector},
    data () {
        return {
            func,
            BsDate,
            search:{
                staff_no:'',
                name:'',
                month:''
            },
            lodingtable:false,
            dialogVisible:false,
            loadingdetail:false,
            list:[],
            form:{
                base_data:{},
                commission_salary:[],
                commission_total:0,
                personal_nursing_salary:[],
                personal_nursing_total:0,
                share_nursing_salary:[],
                share_nursing_total:0
            }
        }
    },
    methods:{
        getList(){
            let position=this.$refs.hgseach.getSelect()
            let data={
                'name':this.search.name,
                'staff_no':this.search.staff_no,
                'month':this.search.month,
                'limit':this.page.size,
                'fk_hpl_id':position[0],
                'group_id':position[1],
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getCarerList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        openeditor(pk_id){
            this.loadingdetail=true
            this.dialogVisible=true
            api.getSalaryDetail({pk_id}).then(res=>{
                this.form=res.data
                this.loadingdetail=false
            }).catch(()=>{
                this.loadingdetail=false
            })
        },
        buttons(type,state){
            let hplid=this.$refs.hgseach.getSelect()[0]
            if(!hplid){
                this.$message({
                    type: 'warning',
                    message: '请选择项目'
                })  
                return
            }
            if(!this.search.month){
                this.$message({
                    type: 'warning',
                    message: '请选择月份'
                })  
                return
            }
            if(type==='lock'){
                api.setIsLock({
                    fk_hpl_id:hplid,
                    month:this.search.month,
                    is_lock:state
                }).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    }) 
                    this.getList()
                }).catch(res=>{})
            }else if(type==='excel'){
                window.open(process.env.host+'/carer_salary_excel?fk_hpl_id='+hplid+'&&month='+this.search.month)
            }else if(type==='detailexcel'){
                window.open(process.env.host+'/carer_salary_detail_excel?fk_hpl_id='+hplid+'&&month='+this.search.month)
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
    #carerSalary{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #carerSalary{
        .el-dialog{
            top:5%;
            height:90%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 10px;
            padding-bottom: 10px;
            top: 40px;
            left:0;right:0;
            bottom: 0;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
        .el-dialog__footer{
            position: absolute;
            bottom: 0;
            left:0;right:0;
        }
        .el-form-item__label{
            padding:0;
        }
    }
</style>