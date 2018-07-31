<template>
    <div class="CheckTreeSearch" style="position:relative">
        <el-input
            ref="treeinput"
            :placeholder="placeholder"
            v-model="search" @focus="isfocus=true" @blur="leaveSearch">
        </el-input>
        <div class="filtertree" v-show="isfocus" @mouseout="ismove=false" @mouseover="ismove=true">
            <el-scrollbar>
                <div style="max-height:350px;min-width:100%;">
                        <div style="float:left;max-height:350px;min-width:100%;">
                            <el-tree
                            class="filter-tree"
                            style="padding:10px;"
                            :data="treedata"
                            :props="defaultProps"
                            default-expand-all
                            :filter-node-method="filterNode"
                            show-checkbox
                            @check-change="checkchange"
                            node-key="id"
                            ref="filtertree">
                            </el-tree>
                        </div>
                        <div style="clear:both"></div>
                </div>
            </el-scrollbar>
        </div>
        
    </div>
</template>

<script>
export default {
    name:'CheckTreeSearch',
    props: {
        data: {
            type: Array,
            default: function(){
                return []
            }
        }
    },
    data(){
        return {
            placeholder:'',
            search:'',
            defaultProps: {
                children: 'children',
                label: 'name',
                id:'pk_id'
            },
            treedata:[],
            isfocus:false,
            idmian:[],
            ismove:false
        }
    },
    watch:{
        search(val) {
            this.idmian=[]
            this.$refs.filtertree.filter(val)
        },
        data(){
            let data=[]
            if(this.data.length!==0 && !this.data[0].setting){
                data=[{
                    name:'全部',
                    pk_id:-1,
                    setting:true,
                    children:this.data
                }]
            }
            this.treedata=data
            this.placeholder=''
            this.search=''
            this.isfocus=false
            this.idmian=[]
        }
    },
    methods:{
        filterNode(value, data) {               //搜索
            if (!value) {
                return true
            }else{
                if(data.name.indexOf(value) !== -1){
                    if(data.children&&data.children.length!==0){
                        this.ergodic(data.children,this.idmian)
                    }
                    return true
                }else if(this.idmian.indexOf(data.pk_id) !== -1){
                    return true
                }else{
                    return false
                }
            }
        },
        ergodic(main,arr){
            for(let i in main){
                if(main[i].children&&main[i].children.length!==0){
                    this.ergodic(main[i].children,arr)
                }else{
                    if(arr.indexOf(main[i].pk_id) == -1){
                        arr.push(main[i].pk_id)
                    }
                }
            }
        },
        checkchange(val){
            let data=this.$refs.filtertree.getCheckedNodes()
            if(data.length!==0){
                let total=0
                let name=''
                for(let i in data){
                    if(!(data[i].children&&data[i].children!==0)){
                        name=data[i].name
                        total=total+1
                    }
                }
                if(total>1){
                    this.placeholder='多网点'
                }else if(total==1){
                    this.placeholder=name
                }else{
                    this.placeholder=''
                }
            }else{
                this.placeholder=''
            }
        },
        leaveSearch(){
            if(!this.ismove){
                this.isfocus=false
            }else{
                this.$refs.treeinput.focus()
                this.isfocus=true
            }
        },
        getcheck(){
            return this.$refs.filtertree.getCheckedNodes()
        },
        claercheck(){

        },
        setcheck(){
            
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .CheckTreeSearch{
    .filtertree{
        position: absolute;top: 40px;left: 0;border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-sizing: border-box;
        margin: 5px 0;max-width:100%;min-width:100%;
        z-index:999;
    }
  }
</style>
<style>
  .CheckTreeSearch .filtertree .el-tree__empty-block{
        min-height: 50px;
    }
</style>