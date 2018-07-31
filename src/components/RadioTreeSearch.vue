<template>
    <div class="RadioTreeSearch" style="position:relative">
        <el-input
            v-model="names"
            @focus="isfocus=true" @blur="leaveSearch">
        </el-input>
        <div class="filtertree" v-if="isfocus" @mouseout="ismove=false" @mouseover="ismove=true">
            <el-input
                v-model="search" @focus="isfocus=true" @blur="leaveSearch" ref="RadioSearch" style="width:96%;margin:5px 2%">
            </el-input>
            <el-scrollbar>
                <div style="max-height:300px;min-width:200px;padding:10px;">
                    <div style="float:left;max-height:300px;min-width:200px;">
                        <el-tree
                        class="filter-tree"
                        :data="treedata"
                        :props="defaultProps"
                        @current-change="radios"
                        default-expand-all
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        node-key="id"
                        ref="RadioTree">
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
    name:'RadioTreeSearch',
    props: {
        data: {
            type: Array,
            default: function(){
                return []
            }
        },
        name:{
            type: String,
            default: function(){
                return 'asd'
            }
        },
        id:{
            type: String,
            default: function(){
                return ''
            }
        },
        prohibit:{
            type: Number,
            default: function(){
                return 0
            }
        }
    },
    data(){
        return {
            search:'',
            defaultProps: {
                children: 'children',
                label: 'name',
                id:'pk_id'
            },
            isfocus:false,
            idmian:[],
            treedata:[],
            ismove:false,
            names:''
        }
    },
    mounted(){
        this.names=this.name
    },
    watch:{
        search(val) {
            this.idmian=[]
            this.$refs.RadioTree.filter(val)
        },
        name(val){
            this.names=this.name
        },
        data(){
            let data=[]
            if(this.data.length!==0 && !this.data[0].setting){
                data=[{
                    name:'全部',
                    pk_id:-1,
                    setting:true,
                    type:0,
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
                }else if(this.idmian.indexOf(data.pk_id) !== -1 && data.type!==1){
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
        leaveSearch(){
            if(!this.ismove){
                this.isfocus=false
                this.names=this.name
            }else{
                if(this.isfocus){
                    this.$refs.RadioSearch.focus()
                    this.isfocus=true
                }
            }
        },
        radios(val){
            if(val.type!==this.prohibit&&val.type!==0){
                this.$emit('update:name', val.name)
                this.$emit('update:id', val.pk_id+'')
                this.isfocus=false
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
  .RadioTreeSearch{
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
  .RadioTreeSearch .filtertree .el-tree__empty-block{
        min-height: 50px;
    }
</style>