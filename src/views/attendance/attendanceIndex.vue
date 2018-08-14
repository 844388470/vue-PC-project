<!-- by your name -->
<template>
    <div id="attendanceIndex"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="20" class="MainSearch">
            <el-col :span="12">
                <selector :typename="['hpl','group']"  ref="hdgseach" :colspan="[0,12,0,12,10]" :gutter="20"></selector>
            </el-col>
            <el-col :span="6">
                <el-date-picker
                    v-model="search.start"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :unlink-panels="true"
                    >
                </el-date-picker>
            </el-col>
            <el-col :span="6" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
                <el-button size="small" type="primary">录入</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @selection-change="">
            <el-table-column
                type="selection"  align="center" width="55">
            </el-table-column>
            <el-table-column
                prop="date" align="center" label="考勤日期">
            </el-table-column>
            <el-table-column
                prop="proname" align="center" label="项目名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="nurname" align="center" label="护理组" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="bb" label="白班" align="center" width="80px">
            </el-table-column>
            <el-table-column
                prop="yb" label="夜班" align="center" width="80px">
            </el-table-column>
            <el-table-column
                prop="lb" label="连班" align="center" width="80px">
            </el-table-column>
            <el-table-column
                prop="bt" label="半天" align="center" width="80px">
            </el-table-column>
            <el-table-column
                prop="rudate" label="录入时间" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spana" @click="openeditor">编辑</span><span class="spana" @click="deleteitem(scope.row.id)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex" :loading="lodingtable"></Paging>
        <el-dialog
            title="录入"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false" fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%">
                    <div>
                        <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                            <el-col :span="10">
                                <div>
                                    <transition name="slide-fade">
                                        <img :style="'width:100%;transform:rotate('+degrees+'deg);transition:transform 1s;'" id="rotImg" :src="picurl" alt="加载中" data-action="zoom"/>
                                    </transition>
                                </div>
                                <!--img src="../../assets/img/404.png" style="width:100%;"-->
                                <el-upload
                                    ref="upload"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :on-change="handlePreview"
                                    :file-list="fileList"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small" type="primary">替换照片</el-button>
                                    <el-button size="small" type="primary" @click="rote" id="rotLeft">旋转</el-button>
                                </el-upload>
                            </el-col>
                            <el-col :span="14">
                                <el-col :span="8">
                                    <b class="el-form-item__label">项目</b>
                                    <el-select v-model="form.project" filterable clearable placeholder="请选择项目">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <b class="el-form-item__label">护理组</b>
                                    <el-select v-model="form.nursegroup" filterable clearable placeholder="请选择护理组">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <b class="el-form-item__label">考勤时间</b>
                                    <el-date-picker
                                        v-model="form.time"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="24">
                                    <el-table
                                        :data="form.table"
                                        style="width: 100%">
                                        </el-table-column>
                                        <el-table-column
                                            label="姓名">
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.name" filterable clearable placeholder="请选择">
                                                    <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="班次">
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.banci" filterable clearable placeholder="请选择">
                                                    <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="操作">
                                            <template slot-scope="scope">
                                                <el-button size="small" type="primary" @click="deleteitem(false,scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="8">
                                    <el-button size="small" type="primary" style="margin-top:10px;" @click="addpeople">添加</el-button>
                                </el-col>
                            </el-col>
                        </el-row>
                    </div>
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import '@/plugins/imagezoom'
import url from '@/assets/img/mask.png'
import Pagemixin from '@/mixins/index'
import * as func from '@/utils/Lfunc'
import {mapGetters} from 'vuex'
export default {
    name:'attendanceIndex',
    mixins:[Pagemixin],
    data () {
        return {
            search:{
                project:'',
                nursegroup:'',
                start:'',
                end:''
            },
            picurl:'../../assets/img/404.png',
            fileList:[],
            degrees:0,
            lodingtable:false,
            dialogVisible:false,
            form:{
                project:'',
                nursegroup:'',
                time:'',
                table:[]
            },
            options: [],
            list:[]
        }
    },
    methods:{
        getList(){
            let start=func.getYearMonthDay(this.search.start[0])
            let end=func.getYearMonthDay(this.search.start[1])
            console.log(this.search.start)
            this.lodingtable=true
            setTimeout(_=>{
                this.page.total=100
                this.lodingtable=false
            },3000)
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
        addpeople(){
            this.form.table.push({name:'',banci:''})
        },
        handlePreview(file,fileList){
            if(file.status=="ready"){
                this.picurl=file.url
            }
        },
        openeditor(){
            this.dialogVisible=true
            this.degrees=-90
            this.picurl='../../assets/img/404.png'
            this.fileList=[]
            setTimeout(_=>{
                $('#rotImg').css('height', $('#rotImg').css('width'))
                $('#rotImg').imagezoom()
                $('.zoomMask').css('background', "url("+url+") repeat scroll 0 0 transparent")
                this.rote()
            },100)
        },
        rote(){
            this.degrees=this.degrees+90
            $("#rotImg")[0].style.transform='rotate('+this.degrees+'deg)'
            $(".bigimg")[0].style.transform='rotate('+this.degrees+'deg)'
            // $("#rotImg")[0].style.
            // .bigimg
            // console.log($("#rotImg"))
            // $("#rotImg").rotate(90)
        }
    },
    watch:{
        project(newValue, oldValue) {
    　　　　this.search.nursegroup=''
    　　},
        projects(newValue, oldValue) {
    　　　　this.form.nursegroup=''
    　　}
    },
    mounted(){
        this.getList()
    },
    computed: {
        ...mapGetters(['loading']),
        project() {
    　　　　return this.search.project
    　　},
        projects() {
    　　　　return this.form.project
    　　}
    }
}
</script>
<style lang='scss' scoped>
    #attendanceIndex{margin-top:-10px}
    .spana{color: #65c7ff;margin-right:5px;cursor: pointer;}
</style>
<style lang='scss'>
    #attendanceIndex{
        .el-dialog{
            top:5%;
            height:90%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 10px;
            padding-bottom: 10px;
            top: 50px;
            bottom: 0;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
    }
</style>