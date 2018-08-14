<!-- by your name -->
<template>
    <div id="checkFee"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="4">
                <selector :typename="['hpl']"  ref="hseach" :colspan="[0,24,0,0,10]" :gutter="10" :plac="{hpl:'请选择项目'}"></selector>
            </el-col>
            <el-col :span="4" style="margin-bottom:10px;">
                <el-input v-model="search.order_no" placeholder="订单号"></el-input>
            </el-col>
            <el-col :span="6" style="margin-bottom:10px;">
                <el-date-picker
                    v-model="search.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :unlink-panels="true">
                </el-date-picker>
            </el-col>
            <el-col :span="6" style="padding: 4px;">
                <el-button size="small" @click="changesize(page.size)" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="openeditor(false)">新增</el-button>
                <el-button size="small" type="primary" @click="">明细导出</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="24">
                <h2 class="spanr">总额:{{total}}</h2>
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
                prop="hospital_name" align="center" label="项目名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  
                prop="total" align="center" label="收费小计" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="turn_in_time" align="center" label="上缴日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row.fk_hpl_id,scope.row.turn_in_time,scope.row.pk_id)">编辑</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            :title="form.pk_id?'编辑':'新增'"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-form :model="form"  v-loading="loadingdetail"  label-width="70px" :rules="rules" ref="form" label-position="top">
                        <el-row :gutter="10" style="margin:0;">
                            <el-col :span="5">
                                <el-form-item label="项目" prop="fk_hpl_id">
                                    <el-select v-model="form.fk_hpl_id" filterable clearable :placeholder="'请选择公司'" :disabled="form.pk_id!==''">
                                        <el-option
                                        v-for="item in $store.getters.hpl_list"
                                        :key="item.pk_id"
                                        :label="item.name"
                                        :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="收费日期" prop="time">
                                    <el-date-picker
                                        v-model="form.time"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                        :clearable="false"
                                        :unlink-panels="true">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="订单号" prop="order_no">
                                    <el-input v-model="search.order_no" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label=".">
                                    <el-button size="small" @click="getNotFee" type="primary">搜索未上缴</el-button>
                                    <el-button size="small" type="primary" @click="allAdd(no_checkid)">批量添加</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" style="margin:0;">
                            <h3>未上缴列表:</h3>
                            <el-table
                                ref="multipleTable"
                                :data="form.no_charge_list"
                                :stripe="true"
                                tooltip-effect="dark"
                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
                                v-loading="no_charge_loading"
                                @selection-change="no_check">
                                <el-table-column
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="order_no" align="center" label="单号" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="charge_time" align="center" label="收费日期" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="bed" align="center" label="客户床号" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="price" align="center" label="金额" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="pay_type_name" align="center" label="收费方式" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="item" align="center" label="备注" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <span class="spanb" @click="allAdd(scope.$index)">添加</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                        <el-row :gutter="10" style="margin:0;">
                            <el-col :span="6">
                                <el-form-item label="上缴日期" prop="turn_in_time">
                                    <el-date-picker
                                        v-model="form.turn_in_time"
                                        type="date"
                                        placeholder="请选择日期"
                                        :unlink-panels="true"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="搜索单号" prop="search">
                                    <el-input v-model="form.search" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label=".">
                                    <el-button size="small" @click="searchcheck" type="primary">搜索项选中</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" style="margin:0;">
                            <h3>已上缴列表:<span style="margin:0 10px;" class="spanr">现金上缴：{{shuju.xj||0}}元</span><span style="margin:0 10px;" class="spanr">微信：{{shuju.wx||0}}元</span><span style="margin:0 10px;" class="spanr">支付宝：{{shuju.zfb||0}}元</span><span style="margin:0 10px;" class="spanr">转账：{{shuju.zz||0}}元</span><span style="margin:0 10px;" class="spanr">上缴总额：{{shuju.ze||0}}元</span><span style="margin:0 10px;" class="spanr">上缴订单数:{{form.charge_list.length}}</span></h3>
                            <el-table
                                ref="charge_list"
                                :data="form.charge_list"
                                :stripe="true"
                                tooltip-effect="dark"
                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
                                @selection-change="no_check">
                                <el-table-column
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="order_no" align="center" label="单号" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column  
                                    prop="charge_time" align="center" label="收费日期" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="bed" align="center" label="客户床号" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="item" align="center" label="产品摘要" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="price" align="center" label="金额" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="pay_type_name" align="center" label="收费方式" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <span class="spanb" @click="allDetail(scope.$index)">取消确认</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="confirmeditor" type="primary" :loading="loading">提交</el-button>
                <el-button size="medium" @click="dialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import selector from '@/components/selector'
import Pagemixin from '@/mixins/index'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/order'
import * as BsDate from '@/assets/BasicData'
import {mapGetters} from 'vuex'
export default {
    name:'checkFee',
    mixins:[Pagemixin],
    components:{selector},
    data () {
        return {
            func,
            BsDate,
            search:{
                order_no:'',
                time:[new Date(),new Date()]
            },
            lodingtable:false,
            dialogVisible:false,
            loadingdetail:false,
            no_charge_loading:false,
            list:[],
            total:0,
            form:{
                pk_id:'',
                charge_list:[],
                no_charge_list:[],
                time:[new Date(),new Date()],
                order_no:'',
                turn_in_time:'',
                old_time:'',
                fk_hpl_id:'',
                search:''
            },
            rules:{
                fk_hpl_id:[
                    {required:true,message:'请选择项目' }
                ],
                turn_in_time:[
                    {required:true,message:'请选择上缴日期' }
                ]
            },
            no_checkid:[],
            checkid:[],
            shuju:{
                xj:0,
                wx:0,
                zfb:0,
                zz:0,
                ze:0
            }
        }
    },
    methods:{
        getList(){
            let start=func.getYearMonthDay(this.search.time[0])
            let end=func.getYearMonthDay(this.search.time[1])
            let position=this.$refs.hseach.getSelect()
            let data={
                'order_no':this.search.order_no,
                'limit':this.page.size,
                start,
                end,
                'fk_hpl_id':position[0],
                'page':this.page.index
            }
            this.lodingtable=true
            api.getCheckFeeList(data).then(_=>{
                this.total=_.data.all_total
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
                    // this.form.table.splice(index,1)
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
        getNotFee(){
            this.form.no_charge_list=[]
            this.no_charge_loading=true
            api.getCheckNotFeeList({
                fk_hpl_id:this.form.fk_hpl_id,
                charge_time_start:this.form.time[0] || '',
                charge_time_end:this.form.time[1] || '',
                order_no:this.form.order_no
            }).then(res=>{
                this.no_charge_loading=false
                this.form.no_charge_list=res.data
            }).catch(()=>{this.no_charge_loading=false})
        },
        allAdd(id){
            if(typeof id==='object'){
                for(let i in this.form.charge_list){
                    for(let j in id){
                        if(this.form.charge_list[i].order_no===id[j].order_no){
                            this.$message({
                                type: 'warning',
                                message: '收费上缴列表已存在'+id[j].order_no
                            })
                            return
                        }
                    }
                }
                for(let i in id){
                    this.form.charge_list.push(id[i])
                    for(let j in this.form.no_charge_list){
                        if(this.form.no_charge_list[j].order_no===id[i].order_no){
                            this.form.no_charge_list.splice(j,1)
                        }
                    }
                }
            }else{
                for(let i in this.form.charge_list){
                    if(this.form.charge_list[i].order_no===this.form.no_charge_list[id].order_no){
                        this.$message({
                            type: 'warning',
                            message: '收费上缴列表已存在该单'
                        })
                        return
                    }
                }
                this.form.charge_list.push(JSON.parse(JSON.stringify(this.form.no_charge_list[id])))
                this.form.no_charge_list.splice(id,1)
                this.jisaun()
            }
        },
        allDetail(id){
            this.form.charge_list.splice(id,1)
            this.jisaun()
        },
        no_check(val){
            this.no_checkid=val
        },
        tijao_check(val){
            this.checkid=val
        },
        openeditor(id,time,pk_id){
            this.dialogVisible=true
            for(let i in this.form){
                if(typeof this.form[i]==='object'){
                    if(['time'].indexOf(i)!==-1){
                        this.form[i]=[new Date(),new Date()]
                    }else{
                        this.form[i]=[]
                    }
                }else{
                    this.form[i]=''
                }
            }
            this.no_checkid=[]
            this.checkid=[]
            this.rollBack('detscroll')
            if(id){
                this.form.pk_id=pk_id
                this.form.fk_hpl_id=id
                this.form.turn_in_time=time
                this.form.old_time=time
                this.loadingdetail=true
                api.getCheckFeeDetail({
                    fk_hpl_id:id,
                    turn_in_time:time
                }).then(res=>{
                    this.loadingdetail=false
                    this.form.charge_list=res.data
                    this.jisaun()
                }).catch(()=>{this.loadingdetail=false})
            }
        },
        confirmeditor(){                                     //确认修改或新增
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let list=[]
                    for(let i in this.form.charge_list){
                        list.push(this.form.charge_list[i].charge_id)
                    }
                    api.addCheckInfo({
                        fk_hpl_id:this.form.fk_hpl_id,
                        turn_in_time:this.form.turn_in_time,
                        old_time:this.form.old_time,
                        charge_list:list
                    }).then(res=>{
                        this.dialogVisible=false
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        this.getList()
                    }).catch(()=>{})
                }
            })
        },
        jisaun(){
            this.shuju={
                xj:0,
                wx:0,
                zfb:0,
                zz:0,
                ze:0
            }
            for(let i in this.form.charge_list){
                if(this.form.charge_list[i].pay_type_name=='现金'){
                    this.shuju.xj=(Number(this.shuju.xj)+Number(this.form.charge_list[i].price)).toFixed(2)
                }else if(this.form.charge_list[i].pay_type_name=='微信'){
                    this.shuju.wx=(Number(this.shuju.wx)+Number(this.form.charge_list[i].price)).toFixed(2)
                }else if(this.form.charge_list[i].pay_type_name=='支付宝'){
                    this.shuju.zfb=(Number(this.shuju.zfb)+Number(this.form.charge_list[i].price)).toFixed(2)
                }else if(this.form.charge_list[i].pay_type_name=='转账'){
                    this.shuju.zz=(Number(this.shuju.zz)+Number(this.form.charge_list[i].price)).toFixed(2)
                }
                this.shuju.ze=(Number(this.shuju.ze)+Number(this.form.charge_list[i].price)).toFixed(2)
            }
        },
        searchcheck(){
            for(let i in this.form.charge_list){
                if(this.form.charge_list[i].order_no==this.form.search){
                    this.$refs.charge_list.toggleRowSelection(this.form.charge_list[i])
                    return 
                }
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
    #checkFee{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #checkFee{
        .el-date-editor{width:100%;}
        .el-dialog{
            margin-top:0;
            top:5%;
            height:90%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 10px;
            padding-bottom: 10px;
            top: 40px;
            left:0;right:0;
            bottom: 61px;
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