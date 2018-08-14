<template>
  <div v-loading="lodingtable" element-loading-text="拼命加载中">
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <selector :typename="['org','hpl']" ref="ohseach" :colspan="[12,12,0,0,10]" :gutter="20"></selector>
        </el-col>
        <el-col :span="4">
          <el-input v-model="search.book_no" placeholder="请输入票据/本编号"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="search.is_use" placeholder="请选择票本状态">
            <el-option v-for="item in basicData.isUse" :key="item.pk_id" :label="item.name" :value="item.pk_id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="search.is_accept" placeholder="请选择接收状态">
            <el-option v-for="item in basicData.isAccept" :key="item.pk_id" :label="item.name" :value="item.pk_id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="search.is_inspect" placeholder="请选择核销状态">
            <el-option v-for="item in basicData.isInspect" :key="item.pk_id" :label="item.name" :value="item.pk_id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="20">
          <el-button size="small" type="primary" @click="getList">搜索</el-button>
          <el-button size="small" type="primary">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table :data="list" :stripe="true" tooltip-effect="dark" highlight-current-row style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="book_no" align="center" label="票本编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="book_status_name" align="center" label="票本状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="receipt_type_name" align="center" label="票据类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="star_no" align="center" label="开始单号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="end_no" align="center" label="结束单号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="目前所在公司" show-overflow-tooltip>
          <template slot-scope="scope">
            {{func.filterName(scope.row.fk_org_id,$store.getters.org_list)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="目前所在项目" show-overflow-tooltip>
          <template slot-scope="scope">
            {{func.filterName(scope.row.fk_hpl_id,$store.getters.hpl_list)}}
          </template>
        </el-table-column>
        <el-table-column prop="is_receive_name" align="center" label="接收状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span class="spanb" @click="receiptDetail(scope.row)">发放轨迹</span>
          </template>

        </el-table-column>
      </el-table>

    </div>
    <Paging :data='list' :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
    <el-dialog title="发放轨迹" :visible.sync="dialogTableVisible">
      <el-table :data="DetailList" border>
        <el-table-column prop="turnover_time" label="出入日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="organize_name" label="公司" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hospital_name" label="项目" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="护理组"></el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import * as basicData from '@/assets/BasicData'
// import {mapGetters} from 'vuex'
import Pagemixin from '@/mixins/index'
// import * as api from '@/api/public'
import * as func from '@/utils/Lfunc'
import * as apii from '@/api/receipt/billQuery'
export default {
  mixins: [Pagemixin],
  data() {
    return {
      func,
      basicData,
      lodingtable: false, //列表
      list: [], //人员列表
      DetailList: [],
      search: {
        fk_psn_id: ''
      },
      dialogTableVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let position = this.$refs.ohseach.getSelect()
      console.log(this.$refs.ohseach)
      let data = {
        is_use: this.search.is_use,
        is_accept: this.search.is_accept,
        is_inspect: this.search.is_inspect,
        limit: this.page.size,
        fk_org_id: position[0],
        fk_hpl_id: position[1],
        page: this.page.index,
        book_no: this.search.book_no
      }

      this.lodingtable = true
      apii
        .getAllReceiptList(data)
        .then(_ => {
          this.page.total = _.data.total
          this.list = _.data.data
          // console.log(this.list)
          this.lodingtable = false
        })
        .catch(_ => {
          this.lodingtable = false
        })
    },
    receiptDetail(scope) {
      let data = {
        book_no: scope.book_no,
        receipt_type: scope.receipt_type
      }
      this.dialogTableVisible = true
      apii
        .getReceiptDetail(data)
        .then(_ => {
          this.DetailList = _.data
        })
        .catch(_ => {})
      //  console.log(scope)
      //  console.log(this.DetailList)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>

</style>
<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>