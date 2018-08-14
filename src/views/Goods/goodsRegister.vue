<!-- by your name -->
<template>
    <div id="goodsRegister"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="3">
                <el-input v-model="search.goods" placeholder="产品编号"></el-input>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search.name" placeholder="品名"></el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model="search.pcate" placeholder="一级分类" clearable  @change="search.ccate=''">
                    <el-option
                        v-for="item in oneClass"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="search.ccate" placeholder="二级分类" clearable>
                    <el-option
                        v-for="item in twoClass.filter(res=>res.pid===search.pcate)"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="search.type" placeholder="产品分类" clearable>
                    <el-option
                        v-for="item in basicData.productClass"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
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
            <el-table-column prop="goodssn" align="center" label="产品编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" align="center" label="品名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="description" align="center" label="描述" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="一级类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{func.filterName(scope.row.pcate,oneClass)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="二级类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{func.filterName(scope.row.ccate,twoClass)}}
                </template>
            </el-table-column>
            <el-table-column prop="combo_type" align="center" label="单位" show-overflow-tooltip >
            </el-table-column>
            <el-table-column align="center" label="产品类型" show-overflow-tooltip >
                <template slot-scope="scope">
                    {{func.filterName(scope.row.type,basicData.productClass)}}
                </template>
            </el-table-column>
            <!--el-table-column prop="" align="center" label="操作员" show-overflow-tooltip >
            </el-table-column-->
            <el-table-column prop="created_time" align="center" label="登记日期" show-overflow-tooltip >
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row)">编辑</span><span class="spanr" @click="deleteGoods(scope.row.pk_id)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title="录入"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false" fullscreen
            width="80%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="scrollbar">
                    <el-form :model="form" ref="form" :rules="rules" label-position="top"  v-loading="editloading">
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="9">
                                <el-row :gutter="20" style="margin:0;">
                                    <el-col :span="12">
                                        <el-form-item prop="pcate"  label="一级分类">
                                            <el-select v-model="form.pcate" clearable @change="pcateChange">
                                                <el-option
                                                    v-for="item in oneClass"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col> 
                                    <el-col :span="12">
                                        <el-form-item prop="ccate"  label="二级分类">
                                            <el-select v-model="form.ccate" @change="ccateChange">
                                                <el-option
                                                    v-for="item in twoClass.filter(res=>res.pid===form.pcate)"
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
                                        <el-form-item prop="option_text"  label="三级说明">
                                            <el-input v-model="form.option_text" @blur="threeBlur"></el-input>
                                        </el-form-item>
                                    </el-col>  
                                    <el-col :span="12">
                                        <el-form-item prop="goodssn"  label="产品编号">
                                            <el-input v-model="form.goodssn"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" style="margin:0;">
                                    <el-col :span="12">
                                        <el-form-item prop="name"  label="产品名称">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>  
                                    <el-col :span="12">
                                        <el-form-item prop="description"  label="产品描述">
                                            <el-input v-model="form.description"></el-input>
                                        </el-form-item>
                                    </el-col>  
                                </el-row>
                                <el-row :gutter="20" style="margin:0;">  
                                    <el-col :span="12">
                                        <el-form-item prop="type"  label="产品类型">
                                            <el-select v-model="form.type" clearable >
                                                <el-option
                                                    v-for="item in basicData.productClass"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item prop="combo_type"  label="单位">
                                            <el-select v-model="form.combo_type" clearable >
                                                <el-option
                                                    v-for="item in basicData.unit"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>  
                                </el-row>
                                <el-row :gutter="20" style="margin:0;">
                                    <el-col :span="24">
                                        <el-form-item label="服务内容" prop="content" >
                                            <el-input v-model="form.content" type="textarea" :rows="5"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="15">
                                <el-table
                                    :data="cGoodslist"
                                    :stripe="true"
                                    tooltip-effect="dark"
                                    style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;" >
                                    <el-table-column prop="option_text" align="center" label="三级说明" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="goodssn" align="center" label="产品编号" show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="addGoods" type="primary" :loading="loading" :disabled="editloading">确认</el-button>
                <el-button size="medium" @click="dialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import * as basicData from '@/assets/BasicData'
import * as api from '@/api/Goods/goodsRegister'
import * as vali from '@/utils/validate'
import * as func from '@/utils/Lfunc'
import {mapGetters} from 'vuex'
export default {
    name:'goodsRegister',
    mixins:[Pagemixin],
    data () {
        return {
            func,
            basicData,
            search:{
                goods:'',
                name:'',
                pcate:'',
                ccate:'',
                type:''
            },
            lodingtable:false,
            dialogVisible:false,
            editloading:false,
            form:{
                pk_id:'',
                name:'',
                pcate:'',
                ccate:'',
                type:'',
                description:'',
                combo_type:'',
                goodssn:'',
                option_text:'',
                content:''
            },
            rules:{
                name:[
                    {required:true, message: '请输入产品名称'}
                ],
                pcate:[
                    {required:true, message: '请选择一级分类'}
                ],
                ccate:[
                    {required:true, message: '请选择二级分类'}
                ],
                type:[
                    {required:true, message: '请选择产品类型'}
                ],
                description:[
                    {required:true, message: '请输入产品描述'}
                ],
                combo_type:[
                    {required:true, message: '请选择单位'}
                ],
                goodssn:[
                    {validator: vali.isNumber,required: true,positive:true}
                ],
                option_text:[
                    {required:true, message: '请输入名称'}
                ]
            },
            list:[
                
            ],
            cGoodslist:[
                
            ],
            oneClass:[],            //一级分类
            twoClass:[]             //二级分类详情    
        }
    },
    methods:{
        getList(){
            // let position=this.$refs.ohseach.getSelect()
            let data={
                'type':this.search.type,
                'name':this.search.name,
                'goods':this.search.goods,
                'pcate':this.search.pcate,
                'ccate':this.search.ccate,
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getGoodsList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        getCcateGoods(state){
            this.cGoodslist=[]
            api.getCcateGoods({pcate:this.form.pcate,ccate:this.form.ccate}).then(res=>{
                this.cGoodslist=res.data
                if(state){
                    this.cGoodslist.forEach(res=>{
                        if(res.pk_id==this.form.pk_id){
                            this.form.goodssn=res.goodssn
                            return
                        }
                    })
                    if(this.cGoodslist.length){
                        let n=JSON.stringify(this.cGoodslist)
                        n=JSON.parse(n)
                        this.form.goodssn=Number(n.sort((a,b)=>b.goodssn - a.goodssn)[0].goodssn)+1+''
                    }else{
                        this.form.goodssn=func.filterNamePei(this.form.pcate,this.oneClass,'pk_id','class_no')+func.filterNamePei(this.form.ccate,this.twoClass,'pk_id','class_no')+'01'
                    }
                }
            }).catch(()=>{})
        },
        pcateChange(){
            this.form.ccate=''
            this.cGoodslist=[]
            this.threeBlur()
        },
        ccateChange(){
            if(this.form.ccate){
                this.getCcateGoods(true)
                this.threeBlur()
            }else{
                this.cGoodslist=[]
            }
        },
        threeBlur(){
            this.form.description=(func.filterName(this.form.pcate,this.oneClass) || '空')+'/'+(func.filterName(this.form.ccate,this.twoClass) || '空')+'/'+this.form.option_text
        },
        deleteGoods(pk_id){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteGoods({pk_id}).then(res=>{
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
        addGoods(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.form.pk_id){
                        api.editGoods(this.form).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.getList()
                        }).catch(()=>{

                        })
                    }else{
                        api.addGoods(this.form).then(res=>{
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
        openeditor(res){
            this.dialogVisible=true
            this.verifica('form')
            this.form={
                pk_id:'',
                name:'',
                pcate:'',
                ccate:'',
                type:'',
                description:'',
                combo_type:'',
                goodssn:'',
                option_text:'',
                content:''
            }
            this.cGoodslist=[]
            this.rollBack('scrollbar')
            if(res&&res.pk_id){
                this.editloading=true
                this.form.pk_id=res.pk_id
                this.form.name=res.name
                this.form.pcate=res.pcate
                this.form.ccate=res.ccate
                this.form.type=res.type
                this.form.description=res.description
                this.form.combo_type=res.combo_type
                this.form.goodssn=res.goodssn
                this.form.option_text=res.option_text
                this.form.content=res.content
                this.getCcateGoods()
                this.editloading=false
            }
        },
        excel(){
            window.open(process.env.host+'/goods/excel')
        }
    },
    watch:{
        
    },
    mounted(){
        this.getList()
        api.getLVClass({type:1}).then(res=>{
            this.oneClass=res.data
        })
        api.getLVClass({type:2}).then(res=>{
            this.twoClass=res.data
        })
    },
    computed: {
        ...mapGetters(['loading'])
    }
}
</script>
<style lang='scss' scoped>
    #goodsRegister{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #goodsRegister{
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