<!-- by your name -->
<template>
    <div id="paidStatistics">
        <el-row :gutter="20">
            <el-col :span="8">
                <selector :typename="['org','hpl']" ref="ohsearch" :colspan="[12,12,0,0,10]" :gutter="20"></selector>
            </el-col> 
            <el-col :span="3">   
                <el-date-picker
                    v-model="value1"
                    type="month"
                    placeholder="选择起始月份">
                </el-date-picker>
            </el-col>  
            <el-col :span="3">   
                <el-date-picker
                    v-model="value2"
                    type="month"
                    placeholder="选择结束月份">
                </el-date-picker>
            </el-col> 
            <el-col :span="3" style="margin-left:30px;">
                <el-button  type="primary">搜索</el-button>
            </el-col>
        </el-row>
        <el-table :data="list" stripe tooltip-effect="dark" highlight-current-row style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
            <el-table-column prop="" align="center" label="项目" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="" align="center" label="收费金额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="" align="center" label="上缴金额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="" align="center" label="未上缴金额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="" align="center" label="银行存款" show-overflow-tooltip>
            </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
    name:'paidStatistics',
    data () {
        return {
            value1:'',
            value2:''
        }
    }
}

</script>
<style lang='scss' scoped>
</style>