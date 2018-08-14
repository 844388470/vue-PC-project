<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="票本入库">
                <in-store></in-store>
            </el-tab-pane>
            <el-tab-pane label="票本出库">
                <out-store></out-store>
            </el-tab-pane>
            <el-tab-pane label="单据作废">
                <obsolete></obsolete>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import inStore from './inStore'
import outStore from './outStore'
import obsolete from './obsolete'
export default {
  data () {
    return {

    }
  },
  components:{
      inStore,
      outStore,
      obsolete
  }

}
</script>

<style lang='scss' scoped>



</style>