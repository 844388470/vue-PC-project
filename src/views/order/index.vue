<!-- by your name -->
<template>
  <div id="orderIndex">
    <div style="width:300px;">
        <RadioTreeSearch :data="data" :name.sync="name" :prohibit="1"></RadioTreeSearch>
        <CheckTreeSearch :data="data"></CheckTreeSearch>
    </div>
  </div>
</template>

<script>
import RadioTreeSearch from '@/components/RadioTreeSearch'
import CheckTreeSearch from '@/components/CheckTreeSearch'
import {getOrgTree} from '@/api/public'
export default {
    name:'orderIndex',
    components:{RadioTreeSearch,CheckTreeSearch},
    data () {
        return {
            data:[],
            name:''
        }
    },
    mounted(){
        getOrgTree(1).then(res=>{
            this.data=res.data
            // console.log(res)
        })
    },
    methods:{
    }
}

</script>
<style lang='scss' scoped>
</style>