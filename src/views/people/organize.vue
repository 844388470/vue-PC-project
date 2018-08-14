<!-- by your name -->
<template>
    <div id="organize"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="6">
                <el-cascader
                    size="large"
                    :options="options"
                    v-model="search.city"
                    change-on-select
                    placeholder="请选择省市" 
                    clearable>
                </el-cascader>
            </el-col>
            <el-col :span="6">
                <selector :typename="['org']"  ref="orgseach" :colspan="[24,0,0,0,10]" :gutter="10"></selector>
            </el-col>
            <el-col :span="6" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
                <el-button size="small" type="primary" @click="openeditor()">新增</el-button>
                <el-button size="small" type="primary" @click="openeditor">导出</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @sort-change="tableSortEvent">
            <el-table-column type="selection"  align="center" width="55">
            </el-table-column>
            <el-table-column prop="org_no" align="center" label="公司编号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" align="center" label="公司名称" show-overflow-tooltip  sortable="custom">
            </el-table-column>
            <el-table-column prop="province_name" align="center" label="省份" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="city_name" align="center" label="市" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="register_time" align="center" label="注册日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="legal_person" align="center" label="法人代表" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="create_time" align="center" label="登记日期" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="operator_id_name" align="center" label="操作员" show-overflow-tooltip >
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row.pk_id)">编辑</span><span class="spanr" @click="deleteCompany([scope.row.pk_id])">删除</span>
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
                                <el-form-item label="编号" prop="org_no" >
                                    <el-input v-model="form.org_no"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :span="8" prop="name"  label="名称">
                                    <el-input v-model="form.name"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="alias"  label="公司简称">
                                    <el-input v-model="form.alias"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="city"  label="省/市">
                                    <el-cascader
                                        size="large"
                                        :options="options"
                                        v-model="form.city"
                                        clearable>
                                    </el-cascader>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="address"  label="地址">
                                    <el-input v-model="form.address"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="register_time"  label="注册日期">
                                    <el-date-picker
                                        v-model="form.register_time"
                                        type="date"
                                        placeholder="选择注册日期"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="register_no"  label="注册识别号">
                                    <el-input v-model="form.register_no"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="phone"  label="电话">
                                    <el-input v-model="form.phone"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="tax_no"  label="税务编号">
                                    <el-input v-model="form.tax_no"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="legal_person"  label="法人代表">
                                    <el-input v-model="form.legal_person"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="legal_person_id_card"  label="法人身份证">
                                    <el-input v-model="form.legal_person_id_card"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="bank_name"  label="银行名称">
                                    <el-input v-model="form.bank_name"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="account_created_bank"  label="开户行名称">
                                    <el-input v-model="form.account_created_bank"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="account_name"  label="开户名称">
                                    <el-input v-model="form.account_name"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="account"  label="银行账号">
                                    <el-input v-model="form.account"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="8">
                                <el-form-item :span="8" prop="email"  label="email">
                                    <el-input v-model="form.email"></el-input>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="24">
                                <el-form-item :span="24" prop="remark"  label="备注">
                                    <el-input v-model="form.remark" type="textarea" :rows="5"></el-input>
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
import { provinceAndCityData } from 'element-china-area-data'
import Pagemixin from '@/mixins/index'
import * as api from '@/api/people/organize'
import * as vali from '@/utils/validate'
import {mapGetters} from 'vuex'
export default {
    name:'organize',
    mixins:[Pagemixin],
    data () {
        return {
            options: provinceAndCityData,
            search:{
                city:[]
            },
            lodingtable:false,
            dialogVisible:false,
            editloading:false,
            form:{
                pk_id:'',
                org_no:'',
                name:'',
                alias:'',
                city:[],
                provinceid:'',
                cityid:'',
                address:'',
                register_time:'',
                register_no:'',
                phone:'',
                tax_no:'',
                legal_person:'',
                legal_person_id_card:'',
                bank_name:'',
                account_created_bank:'',
                account_name:'',
                account:'',
                email:'',
                remark:''
            },
            rules:{
                org_no:[
                    { validator: vali.isNumber,required: true,positive:true}
                ],
                name:[
                    {required:true, message: '请输入名称'}
                ],
                city:[
                    {type:'array',required:true, message: '请选择省市'}
                ],
                phone:[
                    { validator: vali.isNumber,positive:true}
                ],
                register_no:[
                    { validator: vali.isEngNum}
                ],
                tax_no:[
                    { validator: vali.isEngNum}
                ],
                legal_person_id_card:[
                    { validator: vali.isEngNum}
                ],
                account:[
                    { validator: vali.isEngNum}
                ]
            },
            list:[
                
            ],
            staffsList:[]
        }
    },
    methods:{
        getList(){
            let position=this.$refs.orgseach.getSelect()
            let data={
                'provinceid':this.search.city[0]?this.search.city[0]:'',
                'cityid':this.search.city[1]?this.search.city[1]:'',
                'pk_id':position[0]?position[0]:'',
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getCompanyList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
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
                api.deleteCompany({pk_id}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getList()
                    this.$store.dispatch('setOrgList',{}).then(_=>{

                    }).catch(()=>{})
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
                    data.provinceid=data.city[0]
                    data.cityid=data.city[1]
                    if(this.form.pk_id){
                        api.editCompany(data).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.getList()
                            this.$store.dispatch('setOrgList',{}).then(_=>{

                            }).catch(()=>{})
                        }).catch(()=>{

                        })
                    }else{
                        api.addCompany(data).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.getList()
                            this.$store.dispatch('setOrgList',{}).then(_=>{

                            }).catch(()=>{})
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
            this.form={
                pk_id:'',
                org_no:'',
                name:'',
                alias:'',
                city:[],
                provinceid:'',
                cityid:'',
                address:'',
                register_time:'',
                register_no:'',
                phone:'',
                tax_no:'',
                legal_person:'',
                legal_person_id_card:'',
                bank_name:'',
                account_created_bank:'',
                account_name:'',
                account:'',
                email:'',
                remark:''
            }
            this.rollBack('scrollbar')
            if(pk_id){
                this.editloading=true
                api.getCompanyInfo({pk_id}).then(res=>{
                    let data=res.data[0]
                    this.form.pk_id=data.pk_id
                    this.form.org_no=data.org_no
                    this.form.name=data.name
                    this.form.alias=data.alias
                    this.form.cityid=data.cityid
                    this.form.provinceid=data.provinceid
                    this.form.address=data.address
                    this.form.register_time=data.register_time
                    this.form.register_no=data.register_no
                    this.form.phone=data.phone
                    this.form.tax_no=data.tax_no
                    this.form.legal_person=data.legal_person
                    this.form.legal_person_id_card=data.legal_person_id_card
                    this.form.bank_name=data.bank_name
                    this.form.account_created_bank=data.account_created_bank
                    this.form.account_name=data.account_name
                    this.form.account=data.account
                    this.form.email=data.email
                    this.form.remark=data.remark
                    this.form.city=[data.provinceid,data.cityid]
                    this.editloading=false
                }).catch(()=>{

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
        ...mapGetters(['loading'])
    }
}
</script>
<style lang='scss' scoped>
    #organize{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #organize{
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
            margin-bottom:10px;
        }
    }
</style>