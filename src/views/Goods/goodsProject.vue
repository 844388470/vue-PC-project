<!-- by your name -->
<template>
    <div id="goodsProject"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="6">
                <selector :typename="['hpl']"  ref="hseach" :colspan="[0,24,0,0,10]" :gutter="10"></selector>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search.description" placeholder="关键字搜索"></el-input>
            </el-col>
            <el-col :span="6" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="openeditor()">新增</el-button>
                <el-button size="small" type="primary" @click="excel">导出</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent">
            <el-table-column align="center" label="营业网点" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{func.filterName(scope.row.fk_hpl_id,$store.getters.hpl_list)}}
                </template>
            </el-table-column>
            <el-table-column prop="goodssn" align="center" label="产品编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="goods_name" align="center" label="品名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="description" align="center" label="产品描述" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="combo_type" align="center" label="单位" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="total" align="center" label="单价" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="combo_num" align="center" label="单位数量" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="staff_pay_total" align="center" label="护工费用" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="commission" align="center" label="业务提成" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="price_date" align="center" label="定价日期" show-overflow-tooltip >
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row)">编辑</span><span class="spanr" @click="deleteProjectGoods(scope.row.pk_id)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title="录入"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false" fullscreen
            width="60%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="scrollbar">
                    <el-form :model="form" ref="form" :rules="rules" label-position="top"  v-loading="editloading">
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="12">
                                <el-form-item prop="price_date"  label="定价日期">
                                    <el-date-picker
                                        v-model="form.price_date"
                                        type="date"
                                        placeholder="选择定价日期"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col> 
                            <el-col :span="12">
                                <el-form-item prop="goods_id"  label="产品编号">
                                    <el-select v-model="form.goods_id" clearable>
                                        <el-option
                                            v-for="item in product"
                                            :key="item.pk_id"
                                            :label="item.description"
                                            :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="12">
                                <el-form-item prop="org_id"  label="公司">
                                    <el-select v-model="form.org_id" clearable :disabled="form.pk_id?true:false" @change="orgChange">
                                        <el-option
                                            v-for="item in $store.getters.org_list"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> 
                            <el-col :span="12" v-show="form.pk_id?false:true">
                                <el-form-item prop="hpl_id"  label="项目">
                                    <el-select v-model="form.hpl_id" collapse-tags multiple clearable>
                                        <el-option
                                            v-for="item in $store.getters.hpl_list.filter(res=>form.org_id==res.pid)"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-show="form.pk_id?true:false">
                                <el-form-item prop="hpl_id"  label="项目">
                                    <el-select v-model="form.fk_hpl_id" disabled>
                                        <el-option
                                            v-for="item in $store.getters.hpl_list.filter(res=>form.org_id==res.pid)"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="12">
                                <el-form-item prop="combo_num"  label="单位数量">
                                    <el-input v-model="form.combo_num"></el-input>
                                </el-form-item>
                            </el-col>  
                            <el-col :span="12">
                                <el-form-item prop="total"  label="价格">
                                    <el-input v-model="form.total"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="12">
                                <el-form-item prop="staff_pay_total"  label="护工费用">
                                    <el-input v-model="form.staff_pay_total"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="commission"  label="业务提成">
                                    <el-input v-model="form.commission"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="24">
                                <el-form-item label="备注" prop="remark" >
                                    <el-input v-model="form.remark" type="textarea" :rows="5"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="addProjectGoods" type="primary" :loading="loading" :disabled="editloading">确认</el-button>
                <el-button size="medium" @click="dialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import * as vali from '@/utils/validate'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/Goods/goodsProject'
import {mapGetters} from 'vuex'
export default {
    name:'goodsProject',
    mixins:[Pagemixin],
    data () {
        return {
            func,
            search:{
                name:''
            },
            lodingtable:false,
            dialogVisible:false,
            editloading:false,
            form:{
                pk_id:'',
                goods_id:'',
                combo_num:'',
                total:'',
                staff_pay_total:'',
                commission:'',
                remark:'',
                fk_hpl_id:'',
                price_date:'',
                org_id:'',
                hpl_id:[]
            },
            rules:{
                goods_id:[
                    {required:true, message: '请选择产品'}
                ],
                combo_num:[
                    {validator: vali.isNumber,required: true,positive:true}
                ],
                total:[
                    {validator: vali.isNumber,required: true}
                ],
                staff_pay_total:[
                    {validator: vali.isNumber,required: true}
                ],
                commission:[
                    {validator: vali.isNumber,required: true}
                ],
                price_date:[
                    {required:true, message: '请选择日期'}
                ],
                org_id:[
                    {required:true, message: '请选择公司'}
                ],
                hpl_id:[
                    {required:true, message: '请选择项目'}
                ]
            },
            list:[
                
            ],
            product:[]             //产品
        }
    },
    methods:{
        getList(){
            let position=this.$refs.hseach.getSelect()
            let data={
                'description':this.search.description,
                'fk_hpl_id':position[0] || '',
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getProjectGoodsList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        deleteProjectGoods(pk_id){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteProjectGoods({pk_id}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getList()
                }).catch(()=>{

                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })          
            })
        },
        addProjectGoods(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.form.pk_id){
                        api.editProjectGoods(this.form).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.getList()
                        }).catch(()=>{

                        })
                    }else{
                        let data={
                            goods_id:this.form.goods_id,
                            combo_num:this.form.combo_num,
                            total:this.form.total,
                            staff_pay_total:this.form.staff_pay_total,
                            commission:this.form.commission,
                            remark:this.form.remark,
                            fk_hpl_id:this.form.hpl_id,
                            price_date:this.form.price_date
                        }
                        api.addProjectGoods(data).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.getList()
                        }).catch(()=>{

                        })
                    }
                }else {
                    this.$message({
                        message: '输入有误',
                        type: 'warning'
                    })
                }
            })
        },
        orgChange(){
            this.form.hpl_id=[]
        },
        openeditor(res){
            this.dialogVisible=true
            this.verifica('form')
            this.form={
                pk_id:'',
                goods_id:'',
                combo_num:'',
                total:'',
                staff_pay_total:'',
                commission:'',
                remark:'',
                fk_hpl_id:'',
                price_date:'',
                hpl_id:[],
                org_id:''
            }
            this.rollBack('scrollbar')
            if(res&&res.pk_id){
                this.form.pk_id=res.pk_id
                this.form.goods_id=res.goods_id
                this.form.combo_num=res.combo_num
                this.form.total=res.total
                this.form.staff_pay_total=res.staff_pay_total
                this.form.description=res.description
                this.form.commission=res.commission
                this.form.remark=res.remark
                this.form.fk_hpl_id=res.fk_hpl_id
                this.form.hpl_id=['1']
                this.form.price_date=res.price_date
                this.$store.getters.hpl_list.forEach(ress=>{
                    if(ress.pk_id==res.fk_hpl_id){
                        this.form.org_id=ress.pid
                        return
                    }
                })
            }
        },
        excel(){
            window.open(process.env.host+'/project_goods/excel')
        }
    },
    watch:{
        
    },
    mounted(){
        this.getList()
        api.getGoodsList().then(res=>{
            this.product=res.data
        }).catch(()=>{})
    },
    computed: {
        ...mapGetters(['loading'])
    }
}
</script>
<style lang='scss' scoped>
    #goodsProject{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #goodsProject{
        .el-cascader,.el-date-editor{width:100%}
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
        .el-form-item__label{
            padding:0;
        }
        .el-form-item{
            margin-bottom:10px;
        }
    }
</style>