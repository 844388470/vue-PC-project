<!-- by your name -->
<template>
    <div id="complaint"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10" class="MainSearch">
            <el-col :span="4">
                <el-input v-model="search.mobile" placeholder="手机号码"></el-input>
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
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
            <el-table-column
                type="selection"  align="center" width="55">
            </el-table-column>
            <el-table-column
                prop="mobile" align="center" label="投诉号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="content" label="投诉内容" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spana" @click="openeditor(scope.row)">查看详情</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title=""
            :visible.sync="centerDialogVisible"
            fullscreen
            width="600px">
                <div style="height:100%">
                    <el-scrollbar style="height:100%;">
                        <div class="text">
                            <h2>投诉人:{{comname}}</h2>
                            <p>{{comcont}}</p>
                        </div>
                    </el-scrollbar>
                </div>
        </el-dialog>
  </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
import * as api from '@/api/complaint'
export default {
    name:'complaint',
    mixins:[Pagemixin],
    data () {
        return {
            lodingtable:false,
            centerDialogVisible:false,
            comname:'',
            comcont:'',
            list:[],
            search:{
                mobile:''
            }
        }
    },
    watch:{
        
    },
    mounted(){
        this.getList()
    },
    methods:{
        getList(){
            let data={
                'mobile':this.search.mobile,
                'limit':this.page.size,
                'page':this.page.index
            }
            this.lodingtable=true
            api.getcomplist(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        openeditor(val){
            this.centerDialogVisible=true
            this.comname=val.mobile?val.mobile:''
            this.comcont=val.content?val.content:''
        }
    },
    computed:{

    }
}

</script>
<style lang='scss' scoped>
    .spana{color: #65c7ff;margin-right:5px;cursor: pointer;}
    .text h2{margin-bottom:10px;}
    .text p{line-height:30px;font-size:17px;text-indent:34px;}
</style>
<style lang='scss'>
    #complaint{
        .el-dialog{
            margin-top:0;
            top:5%;
            height:90%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 0;
            padding-bottom: 10px;
            top: 50px;
            bottom: 0;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
    }
</style>