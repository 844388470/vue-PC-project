<!-- by your name -->
<template>
    <div id="picture">
        
    </div>
</template>

<script>
// import * as api from '@/api/public'
export default {
    name:'picture',
    props: {
        gutter:{                            //左右边距
            type:Number,
            default:20
        }, 
        propRules:{                         //表单验证规则
            type:Object,
            default(){
                return {}
            }
        },
        RulesName:{                         //表单验证的名字和宽度
            type:Object,
            default(){
                return {
                    org:{
                        name:'',
                        width:'0'
                    },
                    hpl:{
                        name:'',
                        width:'0'
                    },
                    dub:{
                        name:'',
                        width:'0'
                    },
                    group:{
                        name:'',
                        width:'0'
                    }
                }
            }
        }
    },
    data () {
        return {
            options:[]
        }
    },
    methods:{
        verifica(){
            
        }
    },
    watch:{
        
    },
    mounted(){
        
    },
    computed: {
        
    }
}
</script>
<style lang='scss' scoped>
    
</style>
<style lang='scss'>
    #picture{
        
    }
</style>