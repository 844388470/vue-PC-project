<!-- by your name -->
<template>
    <div id="targetset"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="6">
                <el-select v-model="search.fk_org_id" filterable clearable placeholder="请选择公司" @change="orgchange">
                    <el-option
                    v-for="item in $store.getters.org_list"
                    :key="item.pk_id"
                    :label="item.name"
                    :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="search.fk_hpl_id" filterable placeholder="请选择营业网点">
                    <el-option
                    v-for="item in hpl_list"
                    :key="item.pk_id"
                    :label="item.name"
                    :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="search.search_type" filterable  placeholder="查询类型">
                    <el-option
                    v-for="item in [{pk_id:1,name:'按月'},{pk_id:2,name:'按年'}]"
                    :key="item.pk_id"
                    :label="item.name"
                    :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="openeditor()">新增</el-button>
            </el-col>
        </el-row>
        <el-table
            v-if="type==1"
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent">
            <!--el-table-column type="selection"  align="center" width="55">
            </el-table-column-->
            <el-table-column prop="org_no" align="center" label="公司/网点" show-overflow-tooltip fixed>
                <template slot-scope="scope">
                    <!-- <span class="lh">{{func.filterName(scope.row.fk_org_id,$store.getters.org_list)}}</span> -->
                      <span class="lh">{{scope.row.hospital_name || scope.row.organize_name}}</span>
                </template>
            </el-table-column>

             <el-table-column prop="org_no" align="center" label="年份" show-overflow-tooltip fixed>
                <template slot-scope="scope">
                    <span class="lh">{{scope.row.year}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="目标" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.target}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="一月" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.jan}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="二月" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.feb}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="三月" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.mar}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="四月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.apr}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="五月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.may}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="六月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.june}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="七月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.july}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="八月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.aug}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="九月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.sep}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="十月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.oct}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="十一月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.nov}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="十二月" show-overflow-tooltip >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.dec}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span class="spanb lh" @click="openeditor(item.pk_id)">编辑</span><span class="spanr" @click="deleteCompany(item.pk_id)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-table
            v-if="type==2"
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent">
            <!--el-table-column type="selection"  align="center" width="55">
            </el-table-column-->
            <el-table-column align="center" label="公司/网点" show-overflow-tooltip fixed>
                <template slot-scope="scope">
                    <span class="lh">{{func.filterName(scope.row.fk_org_id,$store.getters.org_list)}}</span>
                    
                </template>
            </el-table-column>
            <el-table-column align="center" label="年份" show-overflow-tooltip fixed>
                <template slot-scope="scope">
                    <span class="lh">{{scope.row.year}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="目标" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.target}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="目标金额" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span  class="lh">{{item.yeartarget}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                    <!-- <span class="spanb lh" @click="openeditor(scope.row.pk_id)">编辑</span><span class="spanr" @click="deleteCompany([scope.row.pk_id])">删除</span> -->
                    <div v-for="item in scope.row.children" :key="item.pk_id">
                        <span class="spanb lh" @click="openeditor(item.pk_id)">编辑</span><span class="spanr" @click="deleteCompany(item.pk_id)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            :title="form.pk_id?'编辑':'新增'"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false" fullscreen
            width="70%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="scrollbar">
                    <el-form :model="form" ref="form" :rules="rules" label-position="top"  v-loading="editloading">
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="8">
                                <el-form-item  prop="fk_org_id" label="公司">
                                    <el-select v-model="form.fk_org_id" filterable  @change="orgchanges" :disabled="form.pk_id!==''">
                                        <el-option
                                        v-for="item in $store.getters.org_list"
                                        :key="item.pk_id"
                                        :label="item.name"
                                        :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="fk_hpl_id" label="营业网点">
                                    <el-select v-model="form.fk_hpl_id" filterable :disabled="form.pk_id!==''">
                                        <el-option
                                        v-for="item in hpl_lists"
                                        :key="item.pk_id"
                                        :label="item.name"
                                        :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="year" label="年份">
                                    <el-date-picker
                                        v-model="form.year"
                                        type="year"
                                        placeholder="选择年"
                                        :disabled="form.pk_id!==''"
                                        value-format="yyyy">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="type" label="目标类型">
                                    <el-select v-model="form.type" :disabled="form.pk_id!==''">
                                        <el-option
                                        v-for="item in [{pk_id:1,name:'营业额'},{pk_id:2,name:'销售费用'},{pk_id:3,name:'净利润'}]"
                                        :key="item.pk_id"
                                        :label="item.name"
                                        :value="item.pk_id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="date" label="创建日期">
                                    <el-date-picker
                                        v-model="form.date"
                                        type="date"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="yeartarget" label="年目标">
                                    <el-input v-model="form.yeartarget" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="jan" label="一月目标">
                                    <el-input v-model="form.jan" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="feb" label="二月目标">
                                    <el-input v-model="form.feb" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="mar" label="三月目标">
                                    <el-input v-model="form.mar" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="apr" label="四月目标">
                                    <el-input v-model="form.apr" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="may" label="五月目标">
                                    <el-input v-model="form.may" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="june" label="六月目标">
                                    <el-input v-model="form.june" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="july" label="七月目标">
                                    <el-input v-model="form.july" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="aug" label="八月目标">
                                    <el-input v-model="form.aug" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="sep" label="九月目标">
                                    <el-input v-model="form.sep" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="oct" label="十月目标">
                                    <el-input v-model="form.oct" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="nov" label="十一月目标">
                                    <el-input v-model="form.nov" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item  prop="dec" label="十二月目标">
                                    <el-input v-model="form.dec" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="addCompany" type="primary" :loading="loading" :disabled="editloading">确认</el-button>
                <el-button size="medium" @click="dialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import * as api from '@/api/operate/targetset'
import * as vali from '@/utils/validate'
import * as func from '@/utils/Lfunc'
import {mapGetters} from 'vuex'
export default {
    name:'targetset',
    mixins:[Pagemixin],
    data () {
        return {
            func,
            search:{
                fk_org_id:'',
                fk_hpl_id:-2,
                search_type:1,
            },
            lodingtable:false,
            dialogVisible:false,
            editloading:false,
            form:{
                pk_id:'',
                fk_org_id:'',
                fk_hpl_id:'',
                yeartarget:'',
                year:'',
                jan:'',
                feb:'',
                mar:'',
                june:'',
                apr:'',
                may:'',
                july:'',
                aug:'',
                sep:'',
                oct:'',
                nov:'',
                date:'',
                type:'',
                dec:''
            },
            rules:{
                fk_org_id:[
                    {required:true, message: '请选择公司'}
                ],
                type:[
                    {required:true, message: '请选择类型'}
                ],
                fk_hpl_id:[
                    {required:true, message: '请选择项目'}
                ],
                year:[
                    {required:true, message: '请选择年份'}
                ],
                yeartarget:[
                    {required:true, message: '请输入年目标'}
                ],
            },
            list:[
                
            ],
            staffsList:[],
            type:1
        }
    },
    methods:{
        orgchange(){
            this.search.fk_hpl_id=-2
        },
        orgchanges(){
            this.form.fk_hpl_id=-2
        },
        getList(){
            let data={
                'fk_org_id':this.search.fk_org_id,
                'fk_hpl_id':this.search.fk_hpl_id,
                'search_type':this.search.search_type,
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
                if(this.search.search_type==1){
                    this.type=1
                }else{
                    this.type=2
                }
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        deleteCompany(pk_id){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.delTarget({pk_id}).then(res=>{
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
        addCompany(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data=this.form
                    if(this.form.pk_id){
                        api.editTarget(data).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.getList()
                        }).catch(()=>{

                        })
                    }else{
                        api.addTarget(data).then(res=>{
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
        openeditor(pk_id){
            this.dialogVisible=true
            this.verifica('form')
            for(let i in this.form){
                this.form[i]=''
            }
            this.rollBack('scrollbar')
            if(pk_id){
                this.editloading=true
                api.delTargeInfo({pk_id}).then(res=>{
                    for(let i in this.form){
                        if(['year','fk_hpl_id'].indexOf(i)!==-1){
                            if(i=='year'){
                                this.form[i]=res.data[i]+''
                            }
                            if(i=='fk_hpl_id'){
                                this.form[i]=-2
                            }
                        }else{
                            this.form[i]=res.data[i] || ''
                        }
                    }
                    this.editloading=false
                    this.editloading=false
                }).catch(()=>{
                    this.dialogVisible=false
                })
            }
        }
    },
    watch:{
        
    },
    mounted(){
        this.getList()
    },
    computed: {
        ...mapGetters(['loading']),
        hpl_list(){
            let list=this.$store.getters.hpl_list.filter(res=>res.pid===this.search.fk_org_id)
            list.unshift({pk_id:-1,name:'全部'})
            list.unshift({pk_id:-2,name:'无'})
            return list
        },
        hpl_lists(){
            let list=this.$store.getters.hpl_list.filter(res=>res.pid===this.form.fk_org_id)
            // list.unshift({pk_id:-1,name:'全部'})
            list.unshift({pk_id:-2,name:'无'})
            return list
        }
    }
}
</script>
<style lang='scss' scoped>
    #targetset{
        margin-top:-10px;
        .lh{
            line-height:50px;
        }
    }
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #targetset{
        .el-cascader{width:100%}
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
            margin-bottom:20px;
        }
    }
</style>