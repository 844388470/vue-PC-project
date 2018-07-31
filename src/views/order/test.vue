<!-- by your name -->
<template>
  <div id="test">
      <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
  </div>
</template>

<script>
import Paging from '@/components/paging'
import Pagemixin from '@/mixins/index'
export default {
    name:'test',
    components:{Paging},
    mixins:[Pagemixin],
    data () {
        return {
        }
    },
    mounted(){
        this.page.total=100
    }
}

</script>
<style lang='scss' scoped>
</style>