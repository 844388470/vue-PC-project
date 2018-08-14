<!-- by your name -->
<template>
    <div id="hospital"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="3">
                <el-select v-model="search.type" placeholder="请选择部门类型" clearable>
                    <el-option
                        v-for="item in hplType"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search.name" placeholder="请输入部门名称"></el-input>
            </el-col>
            <el-col :span="5">
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
                <selector :typename="['org','hpl']"  ref="ohseach" :colspan="[12,12,0,0,10]" :gutter="10"></selector>
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
            <el-table-column prop="name" align="center" label="部门名称" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column align="center" label="部门类别" show-overflow-tooltip sortable="custom">
                <template slot-scope="scope">
                    {{func.filterName(scope.row.type,hplType) }}
                </template>
            </el-table-column>
            <el-table-column prop="organize_name" align="center" label="归属公司" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column prop="province_name" align="center" label="省份" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column prop="city_name" align="center" label="地市" show-overflow-tooltip sortable="custom">
            </el-table-column>
            <el-table-column prop="administrator_name" align="center" label="管理员" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="create_time" align="center" label="登记日期" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="operator_id_name" align="center" label="操作员" show-overflow-tooltip >
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="openeditor(scope.row.pk_id)">编辑</span><span class="spanr" @click="deleteHospital([scope.row.pk_id])">删除</span>
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
                                <el-col :span="12">
                                    <el-form-item label="归属公司" prop="fk_ogz_id" >
                                        <el-select v-model="form.fk_ogz_id" placeholder="请选择归属公司" @change="setStaffs">
                                            <el-option
                                                v-for="item in $store.getters.org_list"
                                                :key="item.pk_id"
                                                :label="item.name"
                                                :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="部门类别" prop="type" >
                                        <el-select v-model="form.type" placeholder="请选择部门类别">
                                            <el-option
                                                v-for="item in hplType"
                                                :key="item.pk_id"
                                                :label="item.name"
                                                :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>    
                                <el-col :span="12">
                                    <el-form-item prop="hpl_no"  label="部门编号">
                                        <el-input v-model="form.hpl_no"></el-input>
                                    </el-form-item>
                                </el-col>  
                                <el-col :span="12">
                                    <el-form-item prop="name"  label="部门名称">
                                        <el-input v-model="form.name"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="aux_code"  label="辅助项CODE">
                                        <el-input v-model="form.aux_code"></el-input>
                                    </el-form-item>
                                </el-col>  
                                <el-col :span="12">
                                    <el-form-item prop="city"  label="省/市">
                                        <el-cascader
                                            size="large"
                                            :options="options"
                                            v-model="form.city"
                                            clearable>
                                        </el-cascader>
                                    </el-form-item>
                                </el-col>    
                                <el-col :span="12">
                                    <el-form-item prop="addr"  label="地址">
                                        <el-input v-model="form.addr"></el-input>
                                    </el-form-item>
                                </el-col>    
                                <el-col :span="12">
                                    <el-form-item prop="create_time"  label="注册日期">
                                        <el-date-picker
                                            v-model="form.create_time"
                                            type="date"
                                            placeholder="选择注册日期"
                                            value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>  
                                <el-col :span="12">
                                    <el-form-item label="部门类别" prop="level" >
                                        <el-select v-model="form.level" placeholder="请选择部门类别">
                                            <el-option
                                                v-for="item in hplGrade"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="dub_num"  label="科室数">
                                        <el-input v-model="form.dub_num"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="bed"  label="床位数">
                                        <el-input v-model="form.bed"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否签约" prop="is_sign" >
                                        <el-select v-model="form.is_sign" placeholder="请选择">
                                            <el-option
                                                v-for="item in isSign"
                                                :key="item.pk_id"
                                                :label="item.name"
                                                :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="签约起止时间" prop="time" >
                                        <el-date-picker
                                            v-model="form.time"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-col>
                            <el-col :span="15">
                                <div v-if="Number(form.type)!==4&&Number(form.type)!==5&&Number(form.type)!==6">
                                    <h3><span class="mr10 vam">银行账号</span><el-button size="small" type="primary" @click="bankAdd">新增</el-button></h3>
                                    <el-table
                                        :data="bank_list"
                                        :stripe="true"
                                        tooltip-effect="dark"
                                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                        <el-table-column align="center" label="银行名称" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.bank_name"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="开户行" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.create_bank_place"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="户名" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.bank_holder"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="账号" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.bank_no"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="是否默认" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.is_default" placeholder="请选择" @change="bankDefaultChange($event,scope.$index)">
                                                    <el-option
                                                        v-for="item in bankIsDefault"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span class="spanr" @click="bankDelete(scope.$index)">删除</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-if="Number(form.type)!==4&&Number(form.type)!==5&&Number(form.type)!==6">
                                    <h3><span class="mr10 vam">护工组别</span><el-button size="small" type="primary" @click="depGroupAdd">新增</el-button></h3>
                                    <el-table
                                        :data="department_group_list"
                                        :stripe="true"
                                        tooltip-effect="dark"
                                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                        <el-table-column align="center" label="名称" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.name"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="科室" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.dg_id" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in department_list.filter(res=>res.pk_id?true:false)"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="组长" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.fk_stf_id" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in staffsList"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="保底工资" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.minimum_wage"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="组长津贴" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.subsidy"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="是否启用" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.is_use" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in isEnable"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="备注" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.remark"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span class="spanr" @click="depGroupDelete(scope.$index)">删除</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-if="Number(form.type)!==4&&Number(form.type)!==5&&Number(form.type)!==6">
                                    <h3><span class="mr10 vam">医院科室</span><el-button size="small" type="primary" @click="depAdd">新增</el-button></h3>
                                    <el-table
                                        :data="department_list"
                                        :stripe="true"
                                        tooltip-effect="dark"
                                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                        <el-table-column align="center" label="名称" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.name"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="是否主要科室" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.is_primary" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in isMainDep"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="病区" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.ward"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="楼层" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.floor"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="床位数" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.bed_num"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="护士长" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.head_nurse"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="电话" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.nurse_phone"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="是否启用" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.is_use" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in isEnable"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="开科状态" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.pattern" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in connStatus"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="备注" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.remark"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span class="spanr" @click="depDelete(scope.$index)">删除</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-if="Number(form.type)!==4&&Number(form.type)!==5&&Number(form.type)!==6">
                                    <h3><span class="mr10 vam">院方人员</span><el-button size="small" type="primary" @click="hplStaffAdd">新增</el-button></h3>
                                    <el-table
                                        :data="hospital_staff_list"
                                        :stripe="true"
                                        tooltip-effect="dark"
                                        style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                        <el-table-column align="center" label="部门" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.department"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="职务" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.position"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="姓名" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.name"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="电话" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.phone"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="备注" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.remark"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span class="spanr" @click="hplStaffDelete(scope.$index)">删除</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="addHospital" type="primary" :loading="loading" :disabled="editloading">确认</el-button>
                <el-button size="medium" @click="dialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { provinceAndCityData } from 'element-china-area-data'
import Pagemixin from '@/mixins/index'
import {hplType,hplGrade,isSign,bankIsDefault,isEnable,isMainDep,connStatus} from '@/assets/BasicData'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/people/hospital'
import * as pub from '@/api/public'
import * as vali from '@/utils/validate'
import {mapGetters} from 'vuex'
export default {
    name:'hospital',
    mixins:[Pagemixin],
    data () {
        return {
            func,
            hplType,
            hplGrade,
            isSign,
            bankIsDefault,
            isEnable,
            isMainDep,
            connStatus,
            options: provinceAndCityData,
            search:{
                type:'',
                name:'',
                city:[]
            },
            lodingtable:false,
            dialogVisible:false,
            editloading:false,
            form:{
                pk_id:'',
                fk_ogz_id:'',
                type:'',
                hpl_no:'',
                name:'',
                aux_code:'',
                city:[],
                provinceid:'',
                cityid:'',
                addr:'',
                create_time:'',
                level:'',
                dub_num:'',
                bed:'',
                is_sign:'',
                time:[],
                start:'',
                end:''
            },
            bank_list:[],
            department_group_list:[],
            department_list:[],
            hospital_staff_list:[],
            rules:{
                name:[
                    {required:true, message: '请输入名称'}
                ],
                type:[
                    {required:true, message: '请选择'}
                ],
                fk_ogz_id:[
                    {required:true, message: '请选择公司'}
                ],
                addr:[
                    {required:true, message: '请输入地址'}
                ],
                city:[
                    {type:'array',required:true, message: '请选择省市'}
                ],
                aux_code: [{ validator: vali.isNumber,positive:true}],
                hpl_no: [{ validator: vali.isNumber,positive:true}],
                dub_num: [{ validator: vali.isNumber,positive:true}],
                bed: [{ validator: vali.isNumber,positive:true}]
            },
            list:[
                
            ],
            staffsList:[]
        }
    },
    methods:{
        getList(){
            let position=this.$refs.ohseach.getSelect()
            let data={
                'provinceid':this.search.city[0]?this.search.city[0]:'',
                'cityid':this.search.city[1]?this.search.city[1]:'',
                'type':this.search.type,
                'name':this.search.name,
                'fk_ogz_id':position[0]?position[0]:'',
                'pk_id':position[1]?position[1]:'',
                'limit':this.page.size,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.lodingtable=true
            api.getHospitalList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        deleteHospital(pk_id){
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteHospital({pk_id}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getList()
                    this.$store.dispatch('setHplList',{}).then(_=>{

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
        addHospital(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data=this.form
                    data.provinceid=data.city[0]
                    data.cityid=data.city[1]
                    if(this.form.pk_id){
                        this.form.start=this.form.time&&this.form.time.length===2?this.form.time[0]:''
                        this.form.end=this.form.time&&this.form.time.length===2?this.form.time[1]:''
                        // for(let i in this.bank_list){
                        //     if(this.bank_list[i].pk_id)this.bank_list[i].fk_hpl_id=this.form.pk_id
                        // }
                        for(let i in this.department_group_list){
                            this.department_group_list[i].company_id=this.form.fk_ogz_id
                        }
                        // for(let i in this.department_list){
                        //     if(this.department_list[i].pk_id)this.department_list[i].fk_hpl_id=this.form.pk_id
                        // }
                        // for(let i in this.hospital_staff_list){
                        //     if(this.hospital_staff_list[i].pk_id)this.hospital_staff_list[i].fk_hpl_id=this.form.pk_id
                        // }
                        api.editHospital({
                            hospital_data:{
                                hospital_base_data:this.form,
                                hospital_bank_list_data:this.bank_list,
                                hospital_department_group_list_data:this.department_group_list,
                                hospital_department_list_data:this.department_list,
                                hospital_crew_list_data:this.hospital_staff_list
                            }
                        }).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.getList()
                            this.$store.dispatch('setHplList',{}).then(_=>{

                            }).catch(()=>{})
                        }).catch(()=>{

                        })
                    }else{
                        this.form.start=this.form.time&&this.form.time.length===2?this.form.time[0]:''
                        this.form.end=this.form.time&&this.form.time.length===2?this.form.time[1]:''
                        for(let i in this.department_group_list){
                            this.department_group_list[i].company_id=this.form.fk_ogz_id
                        }
                        api.addHospital({
                            hospital_data:{
                                hospital_base_data:this.form,
                                hospital_bank_list_data:this.bank_list,
                                hospital_department_group_list_data:this.department_group_list,
                                hospital_department_list_data:this.department_list,
                                hospital_crew_list_data:this.hospital_staff_list
                            }
                        }).then(res=>{
                            this.dialogVisible=false
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.getList()
                            this.$store.dispatch('setHplList',{}).then(_=>{

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
            this.form={
                pk_id:'',
                fk_ogz_id:'',
                type:'',
                hpl_no:'',
                name:'',
                aux_code:'',
                city:[],
                provinceid:'',
                cityid:'',
                addr:'',
                create_time:'',
                level:'',
                dub_num:'',
                bed:'',
                is_sign:'',
                time:[],
                start:'',
                end:''
            }
            this.bank_list=[]
            this.staffsList=[]
            this.department_group_list=[]
            this.department_list=[]
            this.hospital_staff_list=[]
            this.rollBack('scrollbar')
            this.verifica('form')
            if(pk_id){
                this.editloading=true
                api.getHospitalInfo({pk_id}).then(res=>{
                    let data=res.data.hospital_base[0]
                    this.form.pk_id=data.pk_id
                    this.form.fk_ogz_id=data.fk_ogz_id
                    this.setStaffs()
                    this.form.type=data.type
                    this.form.hpl_no=data.hpl_no
                    this.form.name=data.name
                    this.form.aux_code=data.aux_code
                    this.form.city=data.provinceid?(data.cityid?[data.provinceid,data.cityid]:[data.provinceid]):[]
                    this.form.cityid=data.cityid
                    this.form.provinceid=data.provinceid
                    this.form.addr=data.addr
                    this.form.create_time=data.create_time
                    this.form.level=data.level
                    this.form.dub_num=data.dub_num
                    this.form.bed=data.bed
                    this.form.is_sign=data.is_sign
                    this.form.time=data.start?(data.end?[data.start,data.end]:[data.start]):[]
                    this.form.start=data.start
                    this.form.end=data.end
                    this.bank_list=res.data.bank_list
                    for(let i in res.data.department_group_list){
                        if(res.data.department_group_list[i].fk_stf_id===0)res.data.department_group_list[i].fk_stf_id=''
                    }
                    this.department_group_list=res.data.department_group_list
                    this.department_list=res.data.department_list
                    this.hospital_staff_list=res.data.hospital_staff_list
                    this.verifica('form')
                    this.editloading=false
                }).catch(()=>{

                })
            }
        },
        bankAdd(){
            this.bank_list.push({
                bank_name:'',
                create_bank_place:'',
                bank_holder:'',
                bank_no:'',
                is_default:0
            })
        },
        bankDefaultChange(val,index){
            if(val){
                this.bank_list[index].is_default=1
                for(let i in this.bank_list){
                    if(Number(i)!==index){
                        this.bank_list[i].is_default=0
                    }
                }
            }
        },
        bankDelete(index){
            this.bank_list.splice(index,1)
        },
        depGroupAdd(){
            this.department_group_list.push({
                name:'',
                fk_stf_id:'',
                subsidy:'',
                minimum_wage:'',
                dg_id:'',
                is_use:1,
                remark:''
            })
        },
        depGroupDelete(index){
            this.department_group_list.splice(index,1)
        },
        depAdd(){
            this.department_list.push({
                name:'',
                is_use:1,
                bed_num:'',
                pattern:'',
                ward:'',
                is_primary:1,
                floor:'',
                head_nurse :'',
                nurse_phone:'',
                remark:''
            })
        },
        depDelete(index){
            this.department_list.splice(index,1)
        },
        hplStaffAdd(){
            this.hospital_staff_list.push({
                department:'',
                position:'',
                name:'',
                phone:'',
                remark:''
            })
        },
        hplStaffDelete(index){
            this.hospital_staff_list.splice(index,1)
        },
        setStaffs(){
            this.staffsList=[]
            pub.getStaffsList({fk_org_id:this.form.fk_ogz_id?[this.form.fk_ogz_id]:[-1],fk_hpl_id:this.form.pk_id?[this.form.pk_id]:[-1]}).then(res=>{
                this.staffsList=res.data
            }).catch(()=>{})
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
    #hospital{margin-top:-10px}
    .spanb{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .spanr{color: #ff0000;cursor: pointer;}
</style>
<style lang='scss'>
    #hospital{
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