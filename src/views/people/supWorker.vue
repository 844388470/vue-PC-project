<!-- 护工管理-->
<template>
  <div id="peopleindex"  v-loading="lodingtable" element-loading-text="拼命加载中">
        <el-row :gutter="10">
            <el-col :span="4">
                <el-input v-model="search.search" placeholder="工号/姓名/身份证/手机号"></el-input>
            </el-col>
            <el-col :span="12">
                <selector :typename="['org','hpl','group']"  ref="ohgseach" :colspan="[8,8,0,8,10]" :gutter="10" :all="true"></selector>
            </el-col>
            <el-col :span="4">
                <el-select v-model="search.fk_psn_id" clearable placeholder="请选择职位">
                    <el-option
                        v-for="item in roleslist"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="search.is_input" placeholder="请选择状态">
                    <el-option
                        v-for="item in basicData.isInput"
                        :key="item.pk_id"
                        :label="item.name"
                        :value="item.pk_id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="20" style="padding: 4px;">
                <el-button size="small" @click="getList" type="primary">搜索</el-button>
                <el-button size="small" v-if="authority.indexOf('un_staff_add')!==-1" @click="opendetail(false)" type="primary">新增</el-button>
                <el-button size="small" v-if="authority.indexOf('staff_null_input')!==-1" @click="luru" type="primary">录入</el-button>
                <el-button size="small" v-if="authority.indexOf('set_user_permission')!==-1" @click="openeditor(radioId,0)" type="primary">设置PC权限</el-button>
                <el-button size="small" v-if="authority.indexOf('set_user_permission')!==-1" @click="openeditor(radioId,1)" type="primary">设置APP权限</el-button>
                <el-button size="small" v-if="authority.indexOf('set_data_auth')!==-1" @click="openeditordata" type="primary">设置数据权限</el-button>
                <el-button size="small" v-if="authority.indexOf('staff_turn_all')!==-1" @click="openturns" type="primary">人员调动</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="list"
            :stripe="true"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
            @current-change="tableRadioEvent"
            @sort-change="tableSortEvent"
            >
            <el-table-column
                prop="name" align="center" label="姓名" show-overflow-tooltip  sortable="custom">
            </el-table-column>
            <el-table-column
                prop="staff_no" align="center" label="编号" show-overflow-tooltip  sortable="custom">
            </el-table-column>
            <el-table-column
                align="center" label="性别" show-overflow-tooltip  sortable="custom">
                <template slot-scope="scope">
                    {{func.filterName(scope.row.sex,basicData.sex)}}
                </template>
            </el-table-column>
            <el-table-column
                prop="phone" align="center" label="电话" show-overflow-tooltip  sortable="custom">
            </el-table-column>
            <el-table-column
                prop="id_card" align="center" label="身份证" show-overflow-tooltip  sortable="custom">
            </el-table-column>
            <el-table-column
                align="center" label="公司" show-overflow-tooltip  sortable="custom" prop="fk_ogz_id">
                <template slot-scope="scope">
                    {{func.filterName(scope.row.fk_ogz_id,$store.getters.org_list)}}
                </template>
            </el-table-column>
            <el-table-column
                align="center" label="项目" show-overflow-tooltip  sortable="custom" prop="fk_hpl_id">
                <template slot-scope="scope">
                    {{func.filterName(scope.row.fk_hpl_id,$store.getters.hpl_list)}}
                </template>
            </el-table-column>
            <el-table-column prop="departments_name" align="center" label="组别" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                align="center" label="岗位" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.position_name}}
                </template>
            </el-table-column>
            <el-table-column
                align="center" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.input_time?'已录入':'未录入'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <span class="spanb" @click="opendetail(scope.row)">编辑</span><span class="spanr" @click="deletePeople([scope.row.pk_id])">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-dialog
            title=""
            :visible.sync="centerDialogVisible"
            width="600px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                        <div v-loading="lodingrole" element-loading-text="拼命加载中">
                            <el-tree
                            v-if="centerDialogVisible"
                            :data="treedata"
                            default-expand-all
                            show-checkbox
                            check-strictly
                            node-key="pk_id"
                            ref="rolestree"
                            highlight-current
                            :props="{label: 'name'}"
                            :expand-on-click-node="false"
                            @current-change="menuAllCheck"
                            @check-change="checkmenu">
                            </el-tree>
                        </div>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="upeditor" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="centerDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="dataDialogVisible"
            width="600px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                        <div v-loading="lodingrole" element-loading-text="拼命加载中">
                            <el-tree
                            v-if="dataDialogVisible"
                            :data="treedata"
                            show-checkbox
                            check-strictly
                            node-key="node_id"
                            ref="rolestree"
                            highlight-current
                            :props="{label: 'name'}"
                            :expand-on-click-node="false"
                            @current-change="menuAllCheck"
                            @check-change="checkdatamenu">
                            </el-tree>
                        </div>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="upeditordata" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="dataDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="detail"
            :visible.sync="detailDialogVisible"
            width="90%"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                        <div v-loading="lodinguser" element-loading-text="拼命加载中">
                        <el-form :model="form"  label-width="40px" :rules="rules" ref="form" label-position="left">
                        <el-tabs v-model="active" >
                            <el-tab-pane label="基本资料" name="1">
                                    <el-row :gutter="10">
                                        <el-col :span="10">
                                            <el-table
                                                ref="singleTable"
                                                :data="form.staff_pic_data"
                                                :stripe="true"
                                                tooltip-effect="dark"
                                                highlight-current-row
                                                style="width:100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
                                                @current-change="licenceRadioEvent">
                                                <el-table-column prop="cert_no" align="center" label="证照编号" show-overflow-tooltip>
                                                </el-table-column>
                                                <el-table-column  align="center" label="证照名称" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        {{func.filterName(scope.row.pic_class,allStaffSelect.staff_pic_class)}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="有效期" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        {{formlicence.valid_type===1?'长期':(scope.row.start_valid_time==''|| (scope.row.start_valid_time=='0000-00-00')?'':scope.row.start_valid_time+'至'+scope.row.end_valid_time)}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="操作">
                                                    <template slot-scope="scope">
                                                        <span class="spanb" @click="licenceOpen('change',scope.$index)">编辑</span><span class="spanr" @click="licenceDelete(scope.$index)">删除</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                            <div id="picid">
                                                <transition name="slide-fade">
                                                    <img :style="'width:100%;transform:rotate('+degrees+'deg);transition:transform 0.5s;'" id="rotImg" :src="picurl" alt="" data-action="zoom"/>
                                                </transition>
                                            </div>
                                            <el-button size="small" type="primary" @click="rote()" id="rotLeft">旋转</el-button>
                                            <el-button size="small" type="primary" @click="licenceOpen('add')">添加证照</el-button>
                                        </el-col>
                                        <el-col :span="14">
                                            <el-row :gutter="10">
                                                <el-col :span="9">
                                                    <el-form-item label="姓名" prop="name"  label-width="60px">
                                                        <el-input v-model="form.name"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="10">
                                                    <el-form-item label="身份证号" prop="id_card"  label-width="80px">
                                                        <el-input v-model="form.id_card"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="编号" prop="staff_no" label-width="60px">
                                                        <el-input v-model="form.staff_no" disabled></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="方言" prop="dialect" label-width="60px">
                                                        <el-input v-model="form.dialect"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="性别" prop="sex" label-width="60px">
                                                        <el-radio v-model="form.sex" v-for="item in basicData.sex" :key="item.pk_id" :label="item.pk_id">{{item.name}}</el-radio>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="学历" prop="fk_dpa_id" label-width="60px">
                                                        <el-select v-model="form.fk_dpa_id" placeholder="请选择" >
                                                            <el-option
                                                                v-for="item in allStaffSelect.staff_dpa"
                                                                :key="item.pk_id"
                                                                :label="item.name"
                                                                :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="生日" prop="birth_day" label-width="60px">
                                                        <el-input v-model="form.birth_day" disabled></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="E-mail" prop="email"  label-width="80px">
                                                        <el-input v-model="form.email"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="微信" prop="weixin" label-width="60px">
                                                        <el-input v-model="form.weixin"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="手机" prop="phone" label-width="60px">
                                                        <el-input v-model="form.phone"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="电话" prop="telephone" label-width="60px">
                                                        <el-input v-model="form.telephone"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="省市" prop="city" label-width="60px">
                                                        <el-cascader
                                                            size="large"
                                                            :options="options"
                                                            v-model="form.city"
                                                            change-on-select
                                                            placeholder="请选择省市" 
                                                            clearable>
                                                        </el-cascader>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="地址" prop="addr" label-width="60px">
                                                        <el-input v-model="form.addr"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="备注" prop="remark" label-width="60px">
                                                        <el-input v-model="form.remark" type="textarea" :rows="3"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-col :span="24">
                                                <h3><span class="mr10 vam">家庭信息</span><el-button size="small" type="primary" @click="tableAdd('family')">新增</el-button></h3>
                                                <el-table
                                                    :data="form.staff_family_data"
                                                    :stripe="true"
                                                    tooltip-effect="dark"
                                                    style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                                    <el-table-column align="center" label="姓名" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.name"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="关系" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.relation"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="联系电话" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.phone"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <span class="spanr" @click="tableDelete('family',scope.$index)">删除</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-col>
                                            <el-col :span="24">
                                                <h3><span class="mr10 vam">教育信息</span><el-button size="small" type="primary" @click="tableAdd('education')">新增</el-button></h3>
                                                <el-table
                                                    :data="form.staff_education_data"
                                                    :stripe="true"
                                                    tooltip-effect="dark"
                                                    style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                                    <el-table-column align="center" label="开始时间" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-date-picker
                                                                v-model="scope.row.start"
                                                                type="date"
                                                                value-format="yyyy-MM-dd">
                                                            </el-date-picker>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="结束时间" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-date-picker
                                                                v-model="scope.row.end"
                                                                type="date"
                                                                value-format="yyyy-MM-dd">
                                                            </el-date-picker>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="毕业院校" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.graduate_school"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="专业" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.professional"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="学历" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.degree"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <span class="spanr" @click="tableDelete('education',scope.$index)">删除</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-col>
                                            <el-col :span="24">
                                                <h3><span class="mr10 vam">工作经历</span><el-button size="small" type="primary" @click="tableAdd('work')">新增</el-button></h3>
                                                <el-table
                                                    :data="form.staff_work_data"
                                                    :stripe="true"
                                                    tooltip-effect="dark"
                                                    style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                                    <el-table-column align="center" label="开始时间" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-date-picker
                                                                v-model="scope.row.start"
                                                                type="date"
                                                                value-format="yyyy-MM-dd">
                                                            </el-date-picker>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="结束时间" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-date-picker
                                                                v-model="scope.row.end"
                                                                type="date"
                                                                value-format="yyyy-MM-dd">
                                                            </el-date-picker>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="单位" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.company"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="岗位" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.position"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="离职原因" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.quit_resion"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <span class="spanr" @click="tableDelete('work',scope.$index)">删除</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-col>
                                            <el-col :span="24">
                                                <h3><span class="mr10 vam">银行账户</span><el-button size="small" type="primary" @click="tableAdd('bank')">新增</el-button></h3>
                                                <el-table
                                                    :data="form.staff_bank_data"
                                                    :stripe="true"
                                                    tooltip-effect="dark"
                                                    style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                                    <el-table-column align="center" label="银行" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.bank"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="户名" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.position_name"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="账号" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <el-input v-model="scope.row.bank_no"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                        <template slot-scope="scope">
                                                            <span class="spanr" @click="tableDelete('bank',scope.$index)">删除</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-col>
                                        </el-col>
                                    </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="用工情况" name="2">
                                <el-row :gutter="10">
                                    <el-col :span="8">
                                        <el-col :span="12">
                                            <el-form-item label="编号">
                                                <el-input v-model="form.staff_no" disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="姓名">
                                                <el-input v-model="form.name" disabled></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="用工类型" label-width="70px">
                                                <el-radio v-model="form.type" v-for="item in basicData.recruitType" :key="item.pk_id" :label="item.pk_id">{{item.name}}</el-radio>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="公司">
                                                <el-input v-model="form.orgnames" v-show="!isAdd" :disabled="!isAdd"></el-input>
                                                 <el-select v-model="form.fk_org_id" v-show="isAdd" filterable clearable placeholder="请选择公司"  @change="orgChange" :disabled="!isAdd">
                                                    <el-option
                                                    v-for="item in $store.getters.org_list"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="部门">
                                                <el-input v-model="form.hplnames" v-show="!isAdd" :disabled="!isAdd"></el-input>
                                                    <el-select v-model="form.fk_hpl_id"  v-show="isAdd" filterable clearable :placeholder="'请选择部门'"  @change="hplChange" :disabled="!isAdd">
                                                        <el-option
                                                        v-for="item in hpl_list"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                        </el-option>
                                                    </el-select>
                                            </el-form-item>
                                            <el-form-item label="组别">
                                                <el-input v-model="form.groupnames" v-show="!isAdd" :disabled="!isAdd"></el-input>
                                                 <el-select v-model="form.fk_group_id"  v-show="isAdd" filterable clearable :placeholder="'请选择护理组'"   :disabled="!isAdd">
                                                    <el-option
                                                    v-for="item in group_list"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="岗位" prop="fk_psn_id" label-width="60px">
                                                <el-select v-model="form.fk_psn_id" placeholder="请选择" filterable multiple>
                                                    <el-option
                                                        v-for="item in roleslist"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- <el-form-item label="职务" prop="fk_duy_id">
                                                <el-select v-model="form.fk_duy_id" placeholder="请选择" multiple>
                                                    <el-option
                                                        v-for="item in roleslist"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item> -->
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="职级">
                                                <el-select v-model="form.fk_lev_id">
                                                    <el-option
                                                        v-for="item in allStaffSelect.staff_lev"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="状态">
                                                <el-select v-model="form.staff_status">
                                                    <el-option
                                                        v-for="item in allStaffSelect.staff_work_type"
                                                        :key="item.pk_id"
                                                        :label="item.name"
                                                        :value="item.pk_id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="入职时间" label-width="80px"  prop="entry_time" >
                                                <el-date-picker
                                                    v-model="form.entry_time"
                                                    type="date"
                                                    value-format="yyyy-MM-dd">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="黑名单" label-width="70px">
                                                <el-radio v-model="form.is_black" v-for="item in basicData.isBlack" :key="item.pk_id" :label="item.pk_id">{{item.name}}</el-radio>
                                            </el-form-item>
                                        </el-col>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-col :span="24">
                                            <h3><span class="mr10 vam">用工合同</span><el-button size="small" type="primary" @click="tableAdd('contract')">新增</el-button></h3>
                                            <el-table
                                                :data="form.staff_rau_contract_data"
                                                :stripe="true"
                                                tooltip-effect="dark"
                                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                                <el-table-column align="center" label="合同编号" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-input v-model="scope.row.contract_no"></el-input>
                                                    </template>
                                                </el-table-column>
                                                  <el-table-column align="center" label="合同类型" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-select v-model="scope.row.type" @change="laborContractTypeChage(scope)">
                                                            <!-- <el-option
                                                                v-for="item in allStaffSelect.staff_labor_type"
                                                                :key="item.pk_id"
                                                                :label="item.name"
                                                                :value="item.pk_id"
                                                                v-if="item.pk_id">
                                                            </el-option> -->
                                                            <el-option label="劳动合同" :value="1" > </el-option>
                                                            <el-option label="居间协议（整体)" v-show="form.fk_psn_id=='12'||form.fk_psn_id=='15'||form.fk_psn_id=='32'" :value="2" > </el-option>
                                                            <el-option label="居间协议（一对一)" v-show="form.fk_psn_id=='12'||form.fk_psn_id=='15'||form.fk_psn_id=='32'"  :value="3" > </el-option>
                                                            <el-option label="居间协议" :value="4" v-show="form.fk_psn_id=='12'||form.fk_psn_id=='15'||form.fk_psn_id=='32'"  > </el-option>
                                                            
                                                           
                                                        </el-select>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="开始时间" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-date-picker
                                                            v-model="scope.row.start"
                                                            type="date"
                                                            value-format="yyyy-MM-dd">
                                                        </el-date-picker>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="结束时间" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-date-picker
                                                            v-model="scope.row.end"
                                                            type="date"
                                                            value-format="yyyy-MM-dd">
                                                        </el-date-picker>
                                                    </template>
                                                </el-table-column>
                                              
                                                <el-table-column align="center" label="签约方式" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-select v-model="scope.row.sign_type">
                                                            <el-option
                                                                v-for="item in allStaffSelect.staff_sign_type"
                                                                :key="item.pk_id"
                                                                :label="item.name"
                                                                :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="备注" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-input v-model="scope.row.remark"></el-input>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <span class="spanr" @click="tableDelete('contract',scope.$index)">删除</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-col>
                                        <el-col v-show="!isAdd" :span="24">
                                            <h3><span class="mr10 vam">调动明细</span><el-button size="small" type="primary" @click="tableAdd('turn')">新增</el-button></h3>
                                            <el-table
                                                :data="form.staff_rau_turn_data"
                                                :stripe="true"
                                                tooltip-effect="dark"
                                                style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                                <el-table-column prop="turnover_date" align="center" label="日期" show-overflow-tooltip>
                                                </el-table-column>
                                                <el-table-column align="center" label="公司" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        {{scope.row.organize_name}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="部门" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        {{scope.row.hospital_name}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="组别" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        {{scope.row.group_name}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <span class="spanb" @click="tableAdd('turn','change',scope.$index)">编辑</span><span class="spanr" @click="tableDelete('turn',scope.$index)">删除</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-col>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="薪资" name="3">
                                <el-row :gutter="10">
                                    <el-col :span="24">
                                        <h3><span class="mr10 vam">薪资结构</span><el-button size="small" type="primary" @click="tableAdd('carer')">新增</el-button></h3>
                                        <el-table
                                            :data="form.staff_carer_data"
                                            :stripe="true"
                                            tooltip-effect="dark"
                                            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                            <el-table-column align="center" label="定薪日期" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-date-picker
                                                        v-model="scope.row.set_time"
                                                        type="date"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="薪资项目" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.type" clearable>
                                                        <el-option
                                                            v-for="item in allStaffSelect.staff_carer_type"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="生效日期" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-date-picker
                                                        v-model="scope.row.start_time"
                                                        type="date"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="失效日期" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-date-picker
                                                        v-model="scope.row.end_time"
                                                        type="date"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="金额" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.money" type="number"></el-input>
                                                </template>
                                            </el-table-column>
                                            <!--el-table-column align="center" label="核准人" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-date-picker
                                                        v-model="scope.row.end_time"
                                                        type="date"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column-->
                                            <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span class="spanr" @click="tableDelete('carer',scope.$index)">删除</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="技能培训" name="4">
                                <el-row :gutter="10">
                                    <el-col :span="24">
                                        <h3><span class="mr10 vam">培训明细</span><el-button size="small" type="primary" @click="tableAdd('train')">新增</el-button></h3>
                                        <el-table
                                            :data="form.staff_train_data"
                                            :stripe="true"
                                            tooltip-effect="dark"
                                            style="width: 100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;">
                                            <el-table-column align="center" label="开始时间" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-date-picker
                                                        v-model="scope.row.start"
                                                        type="date"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="结束时间" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-date-picker
                                                        v-model="scope.row.end"
                                                        type="date"
                                                        value-format="yyyy-MM-dd">
                                                    </el-date-picker>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="培训类型" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.type" clearable>
                                                        <el-option
                                                            v-for="item in allStaffSelect.staff_train_type"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="有效时长" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.valit_time" type="number"></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="考核成绩" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <el-input v-model="scope.row.score"></el-input>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="操作" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span class="spanr" @click="tableDelete('train',scope.$index)">删除</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                        </el-tabs>
                        </el-form>
                        </div>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="updetail" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="detailDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="licence"
            :visible.sync="licenceDialogVisible"
            :close-on-click-modal="false"
            :before-close="licenceCanel"
            width="800px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                            <el-form :model="formlicence"  label-width="100px" ref="formlicence" :rules="formlicencerules" label-position="top">
                                <el-row :gutter="20" style="margin:0">
                                    <el-col :span="12">
                                        <el-form-item label="证件照片" prop="image_url" style="margin-bottom:5px">
                                            <img :src="formlicence.zhan_url" alt="" style="width:300px;height:300px;">
                                            <el-upload
                                                ref="upload"
                                                :action="oss.host+''"
                                                :on-change="licencePicChange"
                                                :on-remove="licencePicRemove"
                                                :on-success="licencePicSuccess"
                                                :on-error="licencePicError"
                                                :data="oss.data || {}"
                                                :auto-upload="false">
                                                <el-button slot="trigger" size="small" type="primary">选择照片</el-button>
                                            </el-upload>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="证照编号" prop="cert_no" style="margin-bottom:5px">
                                            <el-input v-model="formlicence.cert_no"></el-input>
                                        </el-form-item>
                                        <el-form-item label="证照名称" prop="orderno" style="margin-bottom:5px">
                                            <el-select v-model="formlicence.pic_class" clearable>
                                                <el-option
                                                    v-for="item in allStaffSelect.staff_pic_class"
                                                    :key="item.pk_id"
                                                    :label="item.name"
                                                    :value="item.pk_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="有效期类型" prop="valid_type" style="margin-bottom:5px">
                                            <el-radio v-model="formlicence.valid_type" v-for="(item ,i) in basicData.PerOfVal" :key="i" :label="item.pk_id">{{item.name}}</el-radio>
                                        </el-form-item>
                                        <el-form-item label="有效期" prop="time" style="margin-bottom:5px" v-if="Number(formlicence.valid_type)===0">
                                            <el-date-picker
                                                v-model="formlicence.time"
                                                type="daterange"
                                                value-format="yyyy-MM-dd"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="发证单位" prop="check_org" style="margin-bottom:5px">
                                            <el-input v-model="formlicence.check_org"></el-input>
                                        </el-form-item>
                                        <el-form-item label="备注" prop="mark" style="margin-bottom:5px">
                                            <el-input v-model="formlicence.mark" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="licenceConfirm" type="primary" :loading="loadinglicence">确认</el-button>
                <el-button size="medium" @click="licenceCanel">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="turn"
            :visible.sync="turnDialogVisible"
            :close-on-click-modal="false"
            :before-close="turnCanel"
            width="400px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                            <el-form :model="formturn"  label-width="100px" ref="formturn" :rules="formturnrules" label-position="top" v-loading="loadingturn">
                                <el-row :gutter="20" style="margin:0">
                                    <el-col :span="24">
                                        <el-form-item label="日期" prop="turnover_date">
                                            <el-date-picker
                                                v-model="formturn.turnover_date"
                                                type="date"
                                                value-format="yyyy-MM-dd">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <selector :all="true" :typename="['org','hpl','group']"  ref="ohgform" :colspan="[24,24,0,24,22]" :gutter="20" :labelPosition="'top'" :propRules="formselectrules" :RulesName="{org:{name:'公司',width:'40px'},hpl:{name:'项目',width:'40px'},group:{name:'组别',width:'40px'}}"></selector>
                                    </el-col>
                                </el-row>
                            </el-form>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="turnConfirm" type="primary" :loading="loadingturn">确认</el-button>
                <el-button size="medium" @click="turnCanel">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="turns"
            :visible.sync="turnsDialogVisible"
            :close-on-click-modal="false"
            width="800px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="scrollbar">
                        <el-form label-width="100px" ref="formturn" label-position="top" v-loading="loadingturns">
                            <el-row :gutter="20" style="margin:0">
                                <!--el-col :span="24"-->
                                <el-col :span="12">
                                    <selector :typename="['org','hpl','group']"  ref="position" :colspan="[24,24,0,24,8]" :gutter="20" :labelPosition="'top'" :RulesName="{org:{name:'公司',width:'40px'},hpl:{name:'项目',width:'40px'},group:{name:'组别',width:'40px'}}"></selector>
                                    <el-form-item label="姓名">
                                        <el-input v-model="formturns.name" style="width:75%"></el-input>
                                        <el-button size="small" @click="turnsQuery" type="primary">查询</el-button>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <selector :typename="['org','hpl','group']"  ref="leavePosition" :colspan="[24,24,0,24,8]" :gutter="20" :labelPosition="'top'" :RulesName="{org:{name:'公司',width:'40px'},hpl:{name:'项目',width:'40px'},group:{name:'组别',width:'40px'}}"></selector>
                                    <el-form-item label="调动日期">
                                        <el-date-picker
                                            v-model="formturns.time"
                                            type="date"
                                            value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <!--/el-col-->
                                <el-col :span="24">
                                    <el-transfer
                                        :titles="['原位置', '目标位置']"
                                        :props="{ key: 'pk_id', label: 'name'}"
                                        v-model="formturns.pk_id"
                                        ref="transfer"
                                        :data="turnslist">
                                    </el-transfer>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="turnsConfirm" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="turnsDialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import orgSeleceMixin from './mixin.js'
import moment from 'moment'
import '@/plugins/imagezoom'
import mask from '@/assets/img/mask.png'
import nopic from '@/assets/img/404.png'
import Pagemixin from '@/mixins/index'
import selector from '@/components/selector'
import {mapGetters} from 'vuex'
import * as api from '@/api/public'
import * as apii from '@/api/people/index'
import * as func from '@/utils/Lfunc'
import * as basicData from '@/assets/BasicData'
import { provinceAndCityData } from 'element-china-area-data'
export default {
    name:'peopleindex',
    mixins:[Pagemixin,orgSeleceMixin],
    components:{selector},
    data () {
        return {
            isAdd:false,
            func,
            basicData,
            options: provinceAndCityData,
            lodingtable:false,                 //列表
            lodingrole:false,                  //菜单及数据       
            lodinguser:false,                  //人员详情
            loadinglicence:false,              //证照
            loadingturn:false,              //调动
            loadingturns:false,              //人员批量调动
            centerDialogVisible:false,          //菜单权限
            detailDialogVisible:false,           //人员详情
            dataDialogVisible:false,            //数据权限
            licenceDialogVisible:false,         //证照
            turnDialogVisible:false,         //人员调动
            turnsDialogVisible:false,         //人员批量调动
            search:{
                search:'',
                fk_psn_id:'',
                is_input:0
            },
            form:{
                pk_id:'',
                staff_no:'',
                dialect:'',
                name:'',
                sex:'',
                fk_dpa_id:'',
                id_card:'',
                email:'',
                birth_day:'',
                weixin:'',
                city:[],
                provinceid:'',
                cityid:'',
                addr:'',
                phone:'',
                telephone:'',
                remark:'',
                type:'',
                fk_lev_id:'',
                entry_time:'',
                staff_status:'0',
                is_black:'0',
                fk_psn_id:[],
                
              //  fk_duy_id:[],
                staff_pic_data:[],                  //证照
                staff_family_data:[],               //家庭信息
                staff_education_data:[],            //教育信息
                staff_work_data:[],               //工作经历
                staff_bank_data:[],               //银行信息
                staff_rau_contract_data:[],       //用工合同
                staff_rau_turn_data:[],           //调动明细
                staff_carer_data:[],              //薪资信息
                staff_train_data:[],              //培训明细信息
                orgnames:'',
                hplnames:'',
                groupnames:'',
                fk_org_id:'', //公司Id
                fk_hpl_id:'', //项目Id
                fk_group_id:'', //护理
            },
            rules:{
                fk_psn_id:[{ required: true, message: '请选择岗位'}],
                name:[{ required: true, message: '请输入姓名'}],
                entry_time:[{ required: true, message: '请选择入职时间'}]
                // ,
                // id_card:[{ required: true, message: '请输入身份证号',min:15,max:18,trigger:'blur'}]
            },
            formlicence:{
                cert_no:'',
                image_url:'',
                zhan_url:'',
                pic_class:'',
                valid_type:'',
                start_valid_time:'',
                end_valid_time:'',
                check_org:'',
                mark:'',
                index:'',
                time:[]
            },
            formlicencerules:{
                image_url:[{required: true, message: '请选择证件照片'}]
            },
            formturn:{
                turnover_date:'',
                fk_org_id:'',
                fk_hpl_id:'',
                fk_dub_id:'',
                group_name:'',
                index:''
            },
            formturns:{                 //批量调动form
                name:'',
                time:'',
                pk_id:[]
            },
            turnslist:[],                 //批量调动list
            formturnrules:{
                turnover_date:[{required: true, message: '请选择日期'}]
            },
            formselectrules:{                   //selector组件的验证方式
                orgid:[
                    {required:true, message:'请选择公司',trigger: 'change'}
                ],
                hplid:[
                    {required:true, message:'请选择项目',trigger: 'change'}
                ]
            },
            degrees:0,                          //旋转角度
            picurl:'',                          //详情图片地址
            client_type:0,                      //当前的是否是APP端   0pc端  1app端
            active:'1',                         //当前在人员详情的哪个分页   1 基本资料 2 用工情况 3 薪资 4 技能培训
            list:[],                            //人员列表
            treedata:[],                        //菜单及数据的总树形
            roleslist:[],                       //岗位列表
            allDataAuth:[],                     //所有数据权限列表
            orglist:[],                         //数据权限中的总公司列表
            hpllist:[],                         //数据权限中的总项目列表
            rolemenupc_list:[],                 //pc端的总菜单
            rolemenuapp_list:[],                //app端的总菜单
            allStaffSelect:{
                staff_pic_class:[],              //证照类型列表
                staff_dpa:[],                    //学历列表
                staff_carer_type:[],             //薪资类型列表
                staff_train_type:[],             //培训类型列表
                staff_lev:[],                    //职级列表
                staff_labor_type:[],             //合同类型列表
                staff_sign_type:[],             //签约方式列表
                staff_work_type:[]               //用工状态列表
            },
            oss:{},
            authority:[]                    //操作权限
        }
    },
    watch:{
        
    },
    mounted(){
        this.authority=this.$route.meta.permissions
        this.getList()
        this.setBasicDate()
    },
    methods:{
        setBasicDate(){                         //设置基础数据
            api.getAllRolesList({type:2}).then(_=>{
                this.roleslist=_.data
            }).catch(_=>{})
            api.getAllDataAuth().then(_=>{
                this.allDataAuth=_.data
                _.data.forEach(res=>{
                    this.orglist.push(res)
                    if(res.children&&res.children.length!==0){
                        this.hpllist=this.hpllist.concat(res.children)
                    }
                })
            }).catch(_=>{})
            api.getAllMenuList(0).then(res=>{
                this.rolemenupc_list=res.data
            }).catch(_=>{})
            api.getAllMenuList(1).then(res=>{
                this.rolemenuapp_list=res.data
            }).catch(_=>{})
            apii.getAllStaffSelect().then(res=>{
                console.log(res)
                this.allStaffSelect=res.data
            }).catch(()=>{})
        },
        getList(){
            let position=this.$refs.ohgseach.getSelect()
            let data={
                'is_input':this.search.is_input,
                'search':this.search.search,
                'limit':this.page.size,
                'fk_org_id':position[0],
                'fk_hpl_id':position[1],
                'fk_dub_id':position[2],
                'fk_psn_id':this.search.fk_psn_id,
                'page':this.page.index,
                'sort':this.sort,
                'sort_type':this.sort_type
            }
            this.radioId=''
            this.lodingtable=true
            api.getSupWorkerList(data).then(_=>{
                this.page.total=_.data.total
                this.list=_.data.data
                this.lodingtable=false
            }).catch(_=>{
                this.lodingtable=false
            })
        },
        deletePeople(pk_id){                    //删除人员
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                apii.deleteStaff({pk_id}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getList()
                }).catch(()=>{})
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })          
            })
        },
        opendetail(row){                            //打开人员详情
            this.isAdd = !row
            this.detailDialogVisible=true
            this.verifica('form')
            this.rollBack('scrollbar')
            for(let i in this.form){
                if(typeof this.form[i]==='object'){
                    this.form[i]=[]
                }else{
                    if(i=='staff_status') this.form[i]=0
                    else if(i=='is_black')this.form[i]=0
                    else this.form[i]=''
                }
            }
            this.degrees=0
            this.picurl=''
            this.active='1'
            setTimeout(_=>{
                $('#rotImg').css('height', $('#picid').css('width'))
                $('#picid').css('min-height', $('#picid').css('width'))
                $('#rotImg').imagezoom()
                $('.zoomMask').css('background', 'url('+mask+') repeat scroll 0 0 transparent')
                $(".bigimg")[0].style.transform='rotate('+this.degrees+'deg)'
            },500)
            if(row){
                // this.form.pk_id=row.pk_id
                this.lodinguser=true
                
                apii.getStaffInfo({pk_id:row.pk_id}).then(res=>{
                    for(let i in res.data.staff_base_data){
                        for(let j in this.form){
                            if(i===j){
                                this.form[j]=res.data.staff_base_data[i]
                            }
                        }
                    }
                    // this.form.fk_psn_id=[this.form.fk_psn_id]
                    this.form.city=this.form.provinceid?this.form.cityid?[this.form.provinceid,this.form.cityid]:[this.form.provinceid]:[]
                    for(let i in res.data){
                        for(let j in this.form){
                            if(i===j){
                                this.form[j]=res.data[i]
                            }
                        }
                    }
                    // this.form.fk_duy_id.forEach(res=>{
                    //     res=Number(res)
                    // })
                    for(let i in this.form.fk_duy_id){
                        this.form.fk_duy_id[i]=Number(this.form.fk_duy_id[i])
                    }
                    this.form.orgnames=func.filterName(res.data.staff_base_data.fk_ogz_id,this.$store.getters.org_list)
                    this.form.hplnames=func.filterName(res.data.staff_base_data.fk_hpl_id,this.$store.getters.hpl_list)
                    this.form.groupnames=res.data.staff_base_data.group_name
                    this.form.fk_lev_id=this.form.fk_lev_id===0?'':this.form.fk_lev_id
                    if(this.form.staff_pic_data.length){
                        this.$refs.singleTable.setCurrentRow(this.form.staff_pic_data[0])
                    }
                    // console.log(res)
                    // this.form.roles=_.data
                    this.lodinguser=false
                }).catch(_=>{
                    this.lodinguser=false
                })
            }
        },
        updetail(){                                 //确认编辑角色详情
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let data={
                        staff_data:{
                            staff_base_data:{
                                pk_id:this.form.pk_id,
                                dialect:this.form.dialect,
                                name:this.form.name,
                                sex:this.form.sex,
                                fk_dpa_id:this.form.fk_dpa_id,
                                id_card:this.form.id_card,
                                email:this.form.email,
                                birth_day:this.form.birth_day,
                                weixin:this.form.weixin,
                                provinceid:this.form.city[0] || '',
                                cityid:this.form.city[1] || '',
                                addr:this.form.addr,
                                phone:this.form.phone,
                                telephone:this.form.telephone,
                                remark:this.form.remark,
                                type:this.form.type,
                                fk_psn_id:this.form.fk_psn_id,
                                fk_lev_id:this.form.fk_lev_id,
                                entry_time:this.form.entry_time,
                                staff_status:this.form.staff_status,
                                is_black:this.form.is_black,

                                fk_duy_id:this.form.fk_duy_id,
                                // fk_org_id:this.form.fk_org_id,
                                // fk_hpl_id:this.form.fk_hpl_id,
                                // group_id:this.form.fk_group_id,

                            },
                            staff_rau_turn_data:this.form.staff_rau_turn_data,
                            staff_family_data:this.form.staff_family_data,
                            staff_education_data:this.form.staff_education_data,
                            staff_work_data:this.form.staff_work_data,
                            staff_bank_data:this.form.staff_bank_data,
                            staff_pic_data:this.form.staff_pic_data,
                            staff_carer_data:this.form.staff_carer_data,
                            staff_rau_contract_data:this.form.staff_rau_contract_data,
                            staff_train_data:this.form.staff_train_data
                        }
                    }
                    console.log(JSON.stringify(data))
                    if(this.form.pk_id){
                        apii.setStaffEdit(data).then(res=>{
                            this.detailDialogVisible=false
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            this.getList()
                        }).catch(_=>{})
                    }else{
                         data.staff_data.staff_base_data.fk_org_id = this.form.fk_org_id
                          data.staff_data.staff_base_data.fk_hpl_id = this.form.fk_hpl_id
                           data.staff_data.staff_base_data.fk_dub_id = this.form.fk_group_id
                        apii.unSetStaffAdd(data ).then(res=>{
                            this.detailDialogVisible=false
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.getList()
                        }).catch(_=>{})
                    }
                } else {
                    // this.$message({
                    //     message: '输入有误',
                    //     type: 'warning'
                    // })
                    return false
                }
            })
        },
        openeditor(val,isPc){                       //打开菜单权限详情
            if(!this.radioId){
                this.$message({
                    message: '请选择人员',
                    type: 'warning'
                })
                return
            }
            this.centerDialogVisible=true
            this.client_type=isPc
            this.treedata=[]
            if(isPc){
                this.treedata=this.rolemenuapp_list
            }else{
                this.treedata=this.rolemenupc_list
            }
            this.rollBack('scrollbar')
            setTimeout(()=>{
                this.$refs.rolestree.setCheckedKeys([])
                this.lodingrole=true
                api.getUserPermission({user_id:val,client_type:isPc}).then(_=>{
                    this.$refs.rolestree.setCheckedKeys(_.data)
                    this.lodingrole=false
                }).catch(_=>{
                    this.lodingrole=false
                    this.centerDialogVisible=false
                })
            },100)
        },
        upeditor(){                                 //确认菜单权限详情
            api.setUserPermission({user_id:this.radioId,client_type:this.client_type,permission:this.$refs.rolestree.getCheckedKeys()}).then(_=>{
                this.$message({
                    message: '设置成功',
                    type: 'success'
                })
                this.centerDialogVisible=false
                this.getList()
            }).catch(_=>{
                this.centerDialogVisible=false
            })
        },
        openeditordata(){                           //打开数据权限详情
            if(!this.radioId){
                this.$message({
                    message: '请选择人员',
                    type: 'warning'
                })
                return
            }
            this.dataDialogVisible=true
            this.lodingrole=true
            this.treedata=[]
            this.rollBack('scrollbar')
            setTimeout(_=>{
                this.treedata=this.allDataAuth
                this.$refs.rolestree.setCheckedKeys([])
                api.getDataAuth({fk_stf_id:this.radioId}).then(_=>{
                    let list=[]
                    _.data.org_auth.forEach((res,i)=>{
                        this.orglist.forEach((ress,j)=>{
                            if(ress.pk_id==res){
                                list.push(ress.node_id)
                            }
                        })
                    })
                    _.data.hpl_auth.forEach((res,i)=>{
                        this.hpllist.forEach((ress,j)=>{
                            if(ress.pk_id==res){
                                list.push(ress.node_id)
                            }
                        })
                    })
                    this.$refs.rolestree.setCheckedKeys([])
                    console.log(list)
                    setTimeout(()=>{
                    this.$refs.rolestree.setCheckedKeys(list)
                    this.lodingrole=false

                    },100)
                    
                }).catch(_=>{
                    this.lodingrole=false
                    this.dataDialogVisible=false
                })
            },100)
        },
        upeditordata(){                             //确认数据权限详情
            let org=[]
            let hpl=[]
            let list=this.$refs.rolestree.getCheckedNodes()
            list.forEach(res=>{
                if(res.type===1){
                    org.push(res.pk_id)
                }else if(res.type===2){
                    hpl.push(res.pk_id)
                }
            })
            api.setDataAuth({fk_stf_id:this.radioId,org_auth:org,hpl_auth:hpl}).then(_=>{
                this.$message({
                    message: '设置成功',
                    type: 'success'
                })
                this.dataDialogVisible=false
                this.getList()
            }).catch(_=>{
                this.dataDialogVisible=false
            })
        },
        menuAllCheck(val,n){                                   //设置菜单列表及数据列表全选
            n.checked=!n.checked
            if(n.checked){
                if(this.centerDialogVisible){
                    func.filterTree(val,this,'rolestree','pk_id')
                }else if(this.dataDialogVisible){
                    func.filterTree(val,this,'rolestree','node_id')
                }
            }
        },
        checkmenu(val,n,m){                                    //设置菜单列表上级被连选
            if(n&&val.pid&&val.pid!==0){
                this.$refs.rolestree.setChecked(val.pid,true)
            }else if(!n){
                val.children.forEach(res=>{
                    this.$refs.rolestree.setChecked(res.pk_id,false,false)
                })
            }
        },
        checkdatamenu(val,n,m){                                //设置数据列表上级被连选
            if(n&&val.node_pid&&val.node_pid!==0){
                this.$refs.rolestree.setChecked(val.node_pid,true)
            }else if(!n&&val.children){
                val.children.forEach(res=>{
                    this.$refs.rolestree.setChecked(res.node_id,false,false)
                })
            }
        },
        licencePicChange(file,fileList){             //证件照片切换触发的事件
            if(fileList.length>1){
                fileList.splice(0,1)
            }
            if(file.status==='ready'){
                this.formlicence.image_url=''
                this.loadinglicence=true
                this.formlicence.zhan_url=file.url
                this.oss.type=file.raw.type.substring(file.raw.type.indexOf('/')+1)
                this.licencePicBefore()
            }
        },
        licencePicBefore(){                          //上传之前获取OSS
            api.getOss('staff').then(res=>{
                console.log(res)
                let type=this.oss.type
                this.oss=res.data
                this.oss.type=type
                
                this.oss.time=Number(new Date().getTime()+''+Math.floor(Math.random()*1000000))
                this.oss.data={
                    'key':this.oss.key+this.oss.time+'.'+this.oss.type,
                    'OSSAccessKeyId':res.data.OSSAccessKeyId,
                    'policy':res.data.policy,
                    'signature':res.data.signature,
                    'x-oss-object-acl':res.data['x-oss-object-acl'],
                    'success_action_status':res.data.success_action_status,
                    'expire':res.data.expire
                }
                setTimeout(()=>{
                    this.$refs.upload.submit()
                },100)
            }).catch(()=>{})
        },
        licencePicRemove(file,fileList){             //证件照片删除触发的事件
            this.formlicence.image_url=''
            this.formlicence.zhan_url=''
        },
        licencePicSuccess(file,fileList){            //证件照片上传成功触发的事件
            setTimeout(()=>{
                this.formlicence.image_url=this.oss.host+'/'+this.oss.time+'.'+this.oss.type
                this.loadinglicence=false
            },100)
        },
        licencePicError(){                           //证件照片上传失败触发的事件
            this.$message({
                message: '图片上传失败,请重新选择',
                type: 'warning'
            })
            setTimeout(()=>{
                this.loadinglicence=false
                this.formlicence.zhan_url=''
            },100)
        },
        licenceRadioEvent(val){                      //证件图表选择证件
            if(val){this.picurl=val.image_url}
        },
        licenceOpen(val,index){                      //证件打开
            this.formlicence={
                cert_no:'',
                image_url:'',
                zhan_url:'',
                pic_class:'',
                valid_type:'',
                start_valid_time:'',
                end_valid_time:'',
                check_org:'',
                mark:'',
                index:'',
                time:[]
            }
            if(val==='change'){
                let obj=this.form.staff_pic_data[index]
                this.formlicence={
                    index:index,
                    cert_no:obj.cert_no,
                    image_url:obj.image_url,
                    zhan_url:'',
                    pic_class:obj.pic_class,
                    valid_type:obj.valid_type,
                    start_valid_time:obj.start_valid_time,
                    end_valid_time:obj.end_valid_time,
                    check_org:obj.check_org,
                    mark:obj.mark,
                    time:obj.start_valid_time?obj.end_valid_time?[obj.start_valid_time,obj.end_valid_time]:[]:[]
                }
                setTimeout(()=>{
                    this.formlicence.zhan_url=obj.image_url
                },100)
            }
            this.licenceDialogVisible=true
            this.verifica('formlicence')
        },
        licenceDelete(index){                        //证件删除
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form.staff_pic_data.splice(index,1)
                if(this.form.staff_pic_data.length)this.$refs.singleTable.setCurrentRow(this.form.staff_pic_data[0])
                else this.picurl=''
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // })
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // })          
            })
        },
        licenceConfirm(){                            //证件新增或修改
            this.$refs['formlicence'].validate((valid) => {
                if (valid) {
                    this.$refs.singleTable.setCurrentRow()
                    let data={
                        cert_no:this.formlicence.cert_no,
                        image_url:this.formlicence.image_url,
                        pic_class:this.formlicence.pic_class,
                        valid_type:this.formlicence.valid_type,
                        start_valid_time:this.formlicence.time?this.formlicence.time[0] || '':'',
                        end_valid_time:this.formlicence.time?this.formlicence.time[1] || '':'',
                        check_org:this.formlicence.check_org,
                        mark:this.formlicence.mark
                    }
                    if(this.formlicence.index===''){
                        this.form.staff_pic_data.push(data)
                        this.picurl=this.formlicence.image_url
                    }else{
                        let list=JSON.parse(JSON.stringify(this.form.staff_pic_data))
                        list[this.formlicence.index]=data
                        this.form.staff_pic_data=list
                        this.$refs.singleTable.setCurrentRow(this.form.staff_pic_data[this.formlicence.index])
                    }
                    this.$refs.upload.uploadFiles=[]
                    this.loadinglicence=false
                    this.licenceDialogVisible=false
                } else {
                    return false
                }
            })
        },
        licenceCanel(){                              //证件关闭
            this.$refs.upload.uploadFiles=[]
            this.$refs.upload.abort()
            this.loadinglicence=false
            this.licenceDialogVisible=false
        },
        tableAdd(type,val,index){                    //添加输入表格项
            if(type==='family'){
                this.form.staff_family_data.push({
                    name:'',relation:'',phone:''
                })
            }else if(type==='education'){
                this.form.staff_education_data.push({
                    start:'',end:'',graduate_school:'',professiona:'',degree:''
                })
            }else if(type==='work'){
                this.form.staff_work_data.push({
                    start:'',end:'',company:'',position:'',quit_resion:''
                })
            }else if(type==='bank'){
                this.form.staff_bank_data.push({
                    bank:'',position_name:'',bank_no:''
                })
            }else if(type==='contract'){
                this.form.staff_rau_contract_data.push({
                    contract_no:'',
                    start:this.form.entry_time || '', //用工合同 
                    end:'',
                    type:'',
                    sign_type:'',
                    remark:''
                })
            }else if(type==='turn'){
                this.loadingturn=true
                this.turnDialogVisible=true
                this.formturn={
                        turnover_date:moment().format('YYYY-MM-DD'),
                        fk_org_id:'',
                        fk_hpl_id:'',
                        fk_dub_id:'',
                        group_name:'',
                        index:''
                    }
                this.verifica('formturn')
                setTimeout(()=>{
                    this.$refs.ohgform.setSelect()
                    if(val==='change'){
                        let obj=this.form.staff_rau_turn_data[index]
                        this.formturn={
                            index:index,
                            turnover_date:obj.turnover_date,
                            fk_org_id:obj.fk_org_id,
                            fk_hpl_id:obj.fk_hpl_id,
                            fk_dub_id:obj.fk_dub_id,
                            group_name:obj.group_name
                        }
                        this.$refs.ohgform.setSelect({org:obj.fk_org_id,hpl:obj.fk_hpl_id,group:obj.fk_dub_id}).then(res=>{if(res)this.loadingturn=false})
                    }else{
                        this.loadingturn=false
                    }
                    this.$refs.ohgform.clearVerifica()
                },100)
            }else if(type==='carer'){
                this.form.staff_carer_data.push({
                    set_time:'',type:'',start_time:'',end_time:'',money:'',approval_id:''
                })
            }else if(type==='train'){
                this.form.staff_train_data.push({
                    start:'',end:'',type:'',valit_time:'',score:''
                })
            }
        },
        tableDelete(type,index){                     //删除输入表格项
            if(type==='family'){
                this.form.staff_family_data.splice(index,1)
            }else if(type==='education'){
                this.form.staff_education_data.splice(index,1)
            }else if(type==='work'){
                this.form.staff_work_data.splice(index,1)
            }else if(type==='bank'){
                this.form.staff_bank_data.splice(index,1)
            }else if(type==='contract'){
                this.form.staff_rau_contract_data.splice(index,1)
            }else if(type==='turn'){
                this.form.staff_rau_turn_data.splice(index,1)
            }else if(type==='carer'){
                this.form.staff_carer_data.splice(index,1)
            }else if(type==='train'){
                this.form.staff_train_data.splice(index,1)
            }
        },
        turnConfirm(){                            //调动新增或修改
            this.$refs.ohgform.verifica()
            this.$refs['formturn'].validate((valid) => {
                if (valid&&this.$refs.ohgform.verifica()) {
                    let obj={
                            turnover_date:this.formturn.turnover_date,
                            fk_org_id:this.$refs.ohgform.getSelect()[0],
                            fk_hpl_id:this.$refs.ohgform.getSelect()[1],
                            fk_dub_id:this.$refs.ohgform.getSelect()[2],
                            group_name:this.$refs.ohgform.getSelectName().group,
                            organize_name:this.$store.getters.org_list.filter(i=>i.pk_id==this.$refs.ohgform.getSelect()[0]).length?(this.$store.getters.org_list.filter(i=>i.pk_id==this.$refs.ohgform.getSelect()[0])[0].name?this.$store.getters.org_list.filter(i=>i.pk_id==this.$refs.ohgform.getSelect()[0])[0].name:""):'',
                            hospital_name:this.$store.getters.all_hpl_list.filter(i=>i.pk_id==this.$refs.ohgform.getSelect()[1]).length?(this.$store.getters.all_hpl_list.filter(i=>i.pk_id==this.$refs.ohgform.getSelect()[1])[0].name?this.$store.getters.all_hpl_list.filter(i=>i.pk_id==this.$refs.ohgform.getSelect()[1])[0].name:""):''
                        }
                    if(this.formturn.index===''){
                        this.form.staff_rau_turn_data.push(obj)
                    }else{
                        let list=JSON.parse(JSON.stringify(this.form.staff_rau_turn_data))
                        list[this.formturn.index]=obj
                        this.form.staff_rau_turn_data=list
                    }
                    this.turnDialogVisible=false
                } else {
                    return false
                }
            })
        },
        turnCanel(){                              //调动关闭
            this.turnDialogVisible=false
        },
        openturns(){
            this.turnsDialogVisible=true
            this.formturns.name=''
            this.formturns.time=moment().format('YYYY-MM-DD')
            this.turnslist=[]
            setTimeout(()=>{
                this.$refs.position.setSelect(false)
                this.$refs.leavePosition.setSelect(false)
            },100)
        },
        turnsQuery(){
            if(!this.$refs.position.getSelect()[0]){
                this.$message({
                    type: 'warning',
                    message: '请选择公司'
                })
                return 
            }
            this.formturns.pk_id=[]
            let data={
                'fk_org_id':this.$refs.position.getSelect()[0],
                'fk_hpl_id':this.$refs.position.getSelect()[1],
                'fk_dub_id':this.$refs.position.getSelect()[2],
                'name':this.formturns.name
            }
            this.loadingturns=true
            apii.getAllList(data).then(_=>{
                this.turnslist=_.data
                this.loadingturns=false
            }).catch(_=>{
                this.loadingturns=false
            })
        },
        turnsConfirm(){                           //确认批量调动
            if(!this.$refs.leavePosition.getSelect()[0]){
                this.$message({
                    type: 'warning',
                    message: '请选择公司'
                })
                return 
            }else if(!this.formturns.time){
                this.$message({
                    type: 'warning',
                    message: '请选择调动时间'
                })
            }else if(!this.formturns.pk_id.length){
                this.$message({
                    type: 'warning',
                    message: '请选择调动人员'
                })
            }
            let data={
                'fk_org_id':this.$refs.leavePosition.getSelect()[0],
                'fk_hpl_id':this.$refs.leavePosition.getSelect()[1] || '',
                'fk_dub_id':this.$refs.leavePosition.getSelect()[2] || '',
                'pk_id':this.formturns.pk_id,
                'turnover_date':this.formturns.time
            }
            apii.setTurnAll(data).then(res=>{
                this.$message({
                    type: 'success',
                    message: res.message
                })
                this.turnsDialogVisible=false
                this.getList()
            }).catch(()=>{})
        },
        rote(n){                                  //旋转
            if(n) this.degrees=0
            else this.degrees+=90
            $("#rotImg")[0].style.transform='rotate('+this.degrees+'deg)'
            $(".bigimg")[0].style.transform='rotate('+this.degrees+'deg)'
        },
        luru(){
            apii.getLuruId().then(res=>{
                this.opendetail({pk_id:res.data.pk_id})
            }).catch(()=>{})
        },
        //合同类型改变
        laborContractTypeChage(data){
            console.log(data)
            let index = data.$index
            let begin = data.row.start
            let end = ''
            if(data.row.type==1){
              end = moment(begin).add(3,'years').subtract(1,'days').format('YYYY-MM-DD')

            }else{
                end = moment(begin).add(1,'years').subtract(1,'days').format('YYYY-MM-DD')
            }
             console.log(end,begin)
             this.form.staff_rau_contract_data[index].end = end

        }
    },
    computed:{
        ...mapGetters(['loading'])
    }
}

</script>
<style scoped>
</style>
<style lang='scss'>
    #peopleindex{
        .el-transfer{
            width:100%;
            .el-input{
                width:auto;
            }
            .el-transfer-panel{width:40%}
            .el-transfer__buttons{
                width: 20%;
                box-sizing: border-box;
                .el-button+.el-button{
                    margin: 0 auto;
                }
            }
        }
        .el-tree-node__content{padding:5px 0;}
        .el-tree span{font-size:15px}
        .el-tree .el-button span{font-size:14px}
        .el-dialog{
            margin-top:0;
            top:5%;
            height:90%;
        }
        .detail .el-dialog{
            margin-top:0;
            top:5%;
            height:90%;
        }
        .licence .el-dialog{
            margin-top:0;
            top:15%;
            height:70%;
        }
        .turn .el-dialog{
            margin-top:0;
            top:15%;
            height:70%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 0;
            padding-bottom: 10px;
            top: 40px;
            bottom: 76px;
            left:0;right:0;
        }
        .el-dialog__footer{
            position: absolute;
            bottom: 0;
            left:0;right:0;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
    }
</style>