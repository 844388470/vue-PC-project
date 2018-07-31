<!-- by your name -->
<template>
    <div id="bespeak"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="4">
                <el-input v-model="search.pre_order_no" placeholder="预约单号"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search.name" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search.mobile" placeholder="电话"></el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model="search.deal_status" filterable clearable placeholder="状态">
                    <el-option
                    v-for="item in deal_status_list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="7">
                <el-date-picker
                    v-model="search.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="预约开始时间"
                    end-placeholder="预约结束时间"
                    :unlink-panels="true"
                    >
                </el-date-picker>
            </el-col>
            <el-col :span="3" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="setsort"
            @selection-change="">
            <el-table-column
                type="selection"  align="center" width="55">
            </el-table-column>
            <el-table-column
                prop="pre_order_no" align="center" label="预约单号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="name" align="center" label="姓名">
            </el-table-column>
            <el-table-column
                prop="mobile" align="center" label="电话">
            </el-table-column>
            <el-table-column
                label="业务线" align="center">
                <template slot-scope="scope">
                    {{func.filtername(scope.row.type,type_list,'value')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="node_name" label="网点" align="center">
            </el-table-column>
            <el-table-column
                label="状态" align="center">
                <template slot-scope="scope">
                    {{func.filtername(scope.row.deal_status,deal_status_list,'value')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="remark" label="备注" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="created_at" label="预约时间" align="center" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spana" @click="openeditor(scope.row)">编辑</span><span class="spana" @click="deleteitem(scope.row.id)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title="编辑"
            :visible.sync="centerDialogVisible"
            width="600px"
            center>
                <el-form ref="form" :model="form" label-width="80px" style="height:400px;" :rules="formrules">
                    <el-form-item label="预约单号" prop="pre_order_no">
                        <el-input v-model="form.pre_order_no" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="mobile">
                        <el-input v-model="form.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="业务线" prop="type">
                        <el-select v-model="form.type" filterable clearable>
                            <el-option
                            v-for="item in type_list"
                            :key="item.label"
                            :label="item.value"
                            :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网点" prop="fk_hpl_id">
                        <RadioTreeSearch :data="treedate" :name.sync="form.fk_hpl_name" :id.sync="form.fk_hpl_id" :prohibit="1"></RadioTreeSearch>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="form.remark" :rows="4"></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="upeditor" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="centerDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import RadioTreeSearch from '@/components/RadioTreeSearch'
import {getOrgTree} from '@/api/public'
import {mapGetters} from 'vuex'
import * as api from '@/api/bespeak'
import * as func from '@/utils/Lfunc'
export default {
    name:'bespeak',
    components:{RadioTreeSearch},
    mixins:[Pagemixin],
    data () {
        return {
            func,
            name:'',
            lodingtable:false,
            centerDialogVisible:false,
            isInit:false,
            list:[],
            treedate:[],
            deal_status_list:[{label:'0',value:'未处理'},{label:'1',value:'未成交'},{label:'2',value:'成交订单'},{label:'3',value:'已处理'},{label:'4',value:'取消预约'},{label:'5',value:'系统自动分配'}],
            type_list:[{label:'0',value:'未知'},{label:'1',value:'医护线'},{label:'2',value:'母婴线'},{label:'3',value:'邻鹿'}],
            search:{
                pre_order_no:'',
                name:'',
                mobile:'',
                deal_status:'',
                time:[],
                sort:'',
                sort_type:''
            },
            form:{
                pk_id:'',
                pre_order_no:'',
                name:'',
                mobile:'',
                type:'',
                fk_hpl_name:'',
                fk_hpl_id:'',
                remark:''
            },
            formrules:{
                pre_order_no: [
                    { required: true, message: '请输入预约单号' }
                ],
                name: [
                    { required: true, message: '请输入姓名' }
                ],
                mobile: [
                    { required: true, message: '请输入电话' }
                ],
                type: [
                    { required: true, message: '请选择业务线' }
                ],
                fk_hpl_id: [
                    { required: true, message: '请选择网点' }
                ]
            }
        }
    },
    watch:{
        type(){
            if(this.type && this.type!=='0'){
                getOrgTree(this.type).then(res=>{
                    this.treedate=res.data
                    if(!this.isInit){
                        this.form.fk_hpl_name=''
                        this.form.fk_hpl_id=''
                    }
                    this.isInit=false
                })
            }else{
                this.treedate=[]
                this.form.fk_hpl_name=''
                this.form.fk_hpl_id=''
            }
        }
    },
    mounted(){
        this.centerDialogVisible=true
        this.centerDialogVisible=false
        this.getList()
    },
    methods:{
        getList(){
            let data={
                'name':this.search.name,
                'mobile':this.search.mobile,
                'pre_order_no':this.search.pre_order_no,
                'deal_status':this.search.deal_status,
                'start':func.getYearMonthDay(this.search.time[0]),
                'end':func.getYearMonthDay(this.search.time[1]),
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.search.sort,
                'sort_type':this.search.sort_type
            }
            this.lodingtable=true
            api.preOrders(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        setsort(val){
            if(val){
                this.search.sort=val.prop
                if(val.order==='ascending'){
                    this.search.sort_type='asc'
                }else{
                    this.search.sort_type='desc'
                }
            }else{
                this.search.sort=''
                this.search.sort_type=''
            }
            this.getList()
        },
        openeditor(val){
            this.centerDialogVisible=true
            if(val.type!==0&&(this.form.type!==val.type+'')){
                this.isInit=true
            }
            this.form={
                pk_id:val.pk_id,
                pre_order_no:val.pre_order_no,
                name:val.name?val.name:'',
                mobile:val.mobile?val.mobile:'',
                type:val.type?val.type+'':val.type===0?val.type+'':'',
                fk_hpl_name:val.node_name?val.node_name:'',
                fk_hpl_id:val.fk_hpl_id?val.fk_hpl_id+'':'',
                remark:val.remark?val.remark+'':''
            }
        },
        upeditor(){
            let data=this.form
            api.preOrdersupdate(data).then(_=>{
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.centerDialogVisible=false
                this.getList()
            }).catch(_=>{
                this.centerDialogVisible=false
            })
        }
    },
    computed:{
        type(){
            return this.form.type
        },
        ...mapGetters(['loading'])
    }
}

</script>
<style lang='scss' scoped>
    .spana{color: #65c7ff;margin-right:5px;cursor: pointer;}
</style>
<style lang='scss'>
    #bespeak{
        .el-dialog{top:5%;}
        .el-date-editor.el-input{width:100%;}
        .el-date-editor,.el-select{width:100%;max-height:100%;}
    }
</style>