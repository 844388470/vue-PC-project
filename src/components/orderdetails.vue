<!-- by your name -->
<template>
    <div id="orderdetails">
        <el-dialog
            title=""
            :before-close="handleClose"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            fullscreen
            width="90%">
            <div style="height:100%">
                <el-scrollbar style="height:100%;" ref="detscroll">
                    <el-form :model="form"  v-loading="loadingdetail"  label-width="85px" ref="form" :rules="rules" label-position="left">
                        <el-row :gutter="20" style="margin:0;">
                            <el-col :span="10">
                                <div>
                                    <el-table
                                        ref="singleTable"
                                        :data="change_orders"
                                        :stripe="true"
                                        tooltip-effect="dark"
                                        highlight-current-row
                                        style="width:100%;border:1px solid #ddd;margin:10px 0;border-radius: 5px;"
                                        @current-change="licenceRadioEvent">
                                        <el-table-column prop="bill_time" align="center" label="变更日期" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作">
                                            <template slot-scope="scope">
                                                <span class="spanb" @click="licenceOpen('change',scope.$index)" v-if="!scope.row.zs">编辑</span><span class="spanr" @click="licenceDelete(scope.$index)" v-if="!scope.row.zs">删除</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div id="picid">
                                    <transition name="slide-fade">
                                        <img :style="'width:100%;transform:rotate('+degrees+'deg);transition:transform 1s;'" id="rotImg" :src="form.picurl" alt="" data-action="zoom" />
                                    </transition>
                                </div>
                                <el-button size="small" type="primary" @click="rote" id="rotLeft">旋转</el-button>
                                <el-button size="small" type="primary" @click="licenceOpen('add')">添加变更单</el-button>
                                <!--el-button size="small" type="primary" @click="licenceOpen('kai')">选择开单图片</el-button-->
                            </el-col>
                            <el-col :span="14" class="bottom20">
                                <el-col :span="12" style="border-bottom:1px solid #EBEEF5;">
                                    <el-form-item  prop="pk_id"  label-width="0">
                                        <el-button size="medium" @click="openCus" v-if="myoryh.indexOf('my')!==-1">客户资料</el-button>
                                        &nbsp;
                                    </el-form-item>
                                    <el-form-item label="项目" prop="fk_hpl_id">
                                        <el-select v-model="form.fk_hpl_id" filterable clearable placeholder="请选择项目" @change="hplChange(false,false,false)" :disabled="form.pk_id!=='' || order_goods.length!==0">
                                            <el-option
                                            v-for="item in this.$store.getters.hpl_list"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="科室" prop="fk_dub_id">
                                        <el-select v-model="form.fk_dub_id" filterable clearable placeholder="请选择科室" @change="dubChange">
                                            <el-option
                                            v-for="item in dublist"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="护理组" prop="group_id">
                                        <el-select v-model="form.group_id" filterable clearable placeholder="请选择护理组" :disabled="form.pattern!==1">
                                            <el-option
                                            v-for="item in grouplist"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="客户手机" prop="patient_phone">
                                        <el-input v-model="form.patient_phone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="家属手机" prop="family_phone">
                                        <el-input v-model="form.family_phone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="床位" prop="bed">
                                        <el-input v-model="form.bed"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" style="border-bottom:1px solid #EBEEF5;">
                                    <el-form-item label="订单号" prop="order_no">
                                        <el-input v-model="form.order_no"></el-input>
                                    </el-form-item>
                                    <el-form-item label="护理模式" prop="pattern">
                                        <el-radio v-model="form.pattern" :disabled="order_server.length!==0" v-for="item in BsDate.nursingMode" :key="item.pk_id" :label="item.pk_id" @change="patternChange">{{item.name}}</el-radio>
                                    </el-form-item>
                                    <el-form-item label="护工薪酬" prop="work_type" >
                                        <el-radio v-model="form.work_type" :label="1">月结</el-radio>
                                        <el-radio v-model="form.work_type" :label="2">日结</el-radio>
                                    </el-form-item>
                                    <el-row :gutter="0">
                                        <el-col :span="12">
                                            <el-form-item label="姓名" prop="patient_name" >
                                                <el-input v-model="form.patient_name"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12" style="padding-left:10px;">
                                            <el-form-item label="性别" prop="patient_sex" label-width="50px">
                                                <el-radio v-model="form.patient_sex" :label="1">男</el-radio>
                                                <el-radio v-model="form.patient_sex" :label="2">女</el-radio>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-form-item label="开单员" prop="fk_stf_q_id">
                                        <el-select v-model="form.fk_stf_q_id" filterable clearable placeholder="请选择开单员">
                                            <el-option
                                            v-for="item in staffs"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="开单时间" prop="bill_time"  >
                                        <el-date-picker type="date" placeholder="选择日期" v-model="form.bill_time" value-format="yyyy-MM-dd" @change="dateChange('bill_time')"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结算时间" prop="endtime">
                                        <el-date-picker type="date" placeholder="选择日期" v-model="form.endtime" value-format="yyyy-MM-dd" @change="dateChange('endtime')"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" style="padding:0">
                                    <div>
                                        <span class="title">产品明细:</span><el-button size="mini" style="margin-left:10px" @click="orderGoodadd">新增</el-button><span class="title" style="margin-left:200px;font-family: monospace;vertical-align: middle;color: #f56c6c;">金额合计:{{form.total |toTow }}</span>
                                    </div>
                                    <el-table
                                        :data="order_goods"
                                        style="width: 100%;border:1px solid #ddd;margin:3px 0 10px;border-radius: 5px;">
                                      
                                        <el-table-column
                                            label="明细">
                                            <template slot-scope="scope">
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="产品" label-width="50px">
                                                        <el-select v-model="scope.row.goods_id" filterable placeholder="请选择产品" @change="orderGoodchange($event,scope.$index)" :disabled="func.indexOfId(scope.row.selectid,order_server,'virtual_good_id')">
                                                            <el-option
                                                            v-for="item in goodsList"
                                                            :key="item.goods_id"
                                                            :label="item.goods_description"
                                                            :value="item.goods_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="业务员" label-width="60px">
                                                        <el-select v-model="scope.row.saleman" filterable clearable placeholder="请选择业务员">
                                                            <el-option
                                                            v-for="item in staffs"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="数量" label-width="50px">
                                                        <el-input v-model="scope.row.real_combo_num" type="number" @blur="orderGoodSum(scope.$index)">
                                                             <template slot="append">{{scope.row.combo_num?'/'+scope.row.combo_num:''}}</template>
                                                        </el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="单价浮动" label-width="80px">
                                                        <el-input v-model="scope.row.discount" type="number" @blur="orderGoodSum(scope.$index)" :disabled="func.indexOfId(scope.row.selectid,order_server,'virtual_good_id')"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="总价浮动" label-width="80px">
                                                        <el-input v-model="scope.row.total_discount" type="number"  @blur="orderGoodSum(scope.$index)" :disabled="func.indexOfId(scope.row.selectid,order_server,'virtual_good_id')"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                </el-row>
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="单位" label-width="50px">
                                                        <el-input v-model="scope.row.combo_type" disabled></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="金额小计" label-width="80px">
                                                        {{scope.row.real_total | toTow}}
                                                        <!-- <el-input v-model="scope.row.real_total" disabled type="number"></el-input> -->
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="业务抽成" label-width="80px">
                                                        <el-input v-model="scope.row.commission" type="number"  @blur="orderGoodSum(scope.$index)"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="操作" width="100px;">
                                            <template slot-scope="scope">
                                                <el-button size="small" type="primary" @click="orderGooddelete(scope.$index)" :disabled="func.indexOfId(scope.row.selectid,order_server,'virtual_good_id')">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="24" style="padding:0">
                                    <div>
                                        <span class="title">服务明细:</span><el-button size="mini" style="margin-left:10px" @click="serverGoodadd">新增</el-button>
                                    </div>
                                    <el-table
                                        :data="order_server"
                                        style="width: 100%;border:1px solid #ddd;margin:3px 0 10px;border-radius: 5px;">
                                        
                                        <el-table-column
                                            label="明细">
                                            <template slot-scope="scope">
                                            <el-row :gutter="10">
                                                <el-col :span="12">
                                                    <el-form-item label="产品">
                                                        <el-select v-model="scope.row.virtual_good_id" filterable placeholder="请选择产品" @change="serverGoodchange($event,scope.$index)">
                                                            <el-option
                                                            v-for="item in order_goods.filter(_=>_.type!==2&&_.goods_id!=='')"
                                                            :key="item.selectid"
                                                            :label="item.goods_description"
                                                            :value="item.selectid">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="护工/组别" label-width="80px">
                                                        <el-select v-model="scope.row.fk_stf_id" filterable clearable placeholder="请选择项目">
                                                            <el-option
                                                            v-for="item in form.pattern==1?grouplist:nuringsList"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                             <el-row :gutter="10">
                                                <el-col :span="24">
                                                    <el-form-item label="计时方式" label-width="80px">
                                                            <el-radio v-model="scope.row.count_type" :label="1" :disabled="scope.row.count_type===3" @change="serverGoodSum(scope.$index)">12小时</el-radio>
                                                            <el-radio v-model="scope.row.count_type" :label="2" :disabled="scope.row.count_type===3" @change="serverGoodSum(scope.$index)">24小时</el-radio>
                                                            <el-radio v-model="scope.row.count_type" :label="3" v-if="scope.row.count_type===3">服务计量</el-radio>
                                                    </el-form-item>
                                                </el-col>
                                                </el-row>
                                             <el-row :gutter="10">
                                                <el-col :span="9">
                                                    <el-form-item label="开始时间">
                                                        <el-date-picker type="date" placeholder="选择日期" v-model="scope.row.start" value-format="yyyy-MM-dd"  @change="serverGoodSum(scope.$index)"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="5">
                                                    <el-form-item label="数量" label-width="50px">
                                                        <el-input v-model="scope.row.time" type="number" @blur="serverGoodSum(scope.$index)"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-form-item label="单位" label-width="50px">
                                                        <el-input v-model="scope.row.vir_combo_type" disabled></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="实际单价">
                                                        <span>{{scope.row.per_price | toTow}}</span>
                                                        <!-- <el-input v-model="scope.row.per_price" disabled></el-input> -->
                                                    </el-form-item>
                                                </el-col>
                                                </el-row>
                                             <el-row :gutter="10">
                                                <el-col :span="9">
                                                    <el-form-item label="结束时间">
                                                        <el-date-picker type="date" placeholder="选择日期" v-model="scope.row.end" value-format="yyyy-MM-dd" disabled></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="7">
                                                    <el-form-item label="金额小计">
                                                        <span>{{scope.row.server_amount | toTow}}</span>
                                                        <!-- <el-input v-model="scope.row.server_amount"  type="number" disabled></el-input> -->
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="7">
                                                    <el-form-item label="护工所得">
                                                        <el-input v-model="scope.row.staff_pay"  type="number"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="操作" width="100px;">
                                            <template slot-scope="scope">
                                                <el-button size="small" type="primary" @click="serverGooddelete(scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="24" style="padding:0">
                                    <div>
                                        <span class="title">收付明细:</span><el-button size="mini" style="margin-left:10px" @click="chargeGoodadd">新增</el-button><span class="title" style="margin-left:200px;font-family: monospace;vertical-align: middle;color: #f56c6c;">收付合计:{{form.has_pay  | toTow}}</span>
                                    </div>
                                    <el-table
                                        :data="order_charge"  style="width: 100%;border:1px solid #ddd;margin:3px 0 10px;border-radius: 5px;">
                                        
                                        <el-table-column
                                            label="明细">
                                            <template slot-scope="scope">
                                            <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="收据单号">
                                                        <el-input v-model="scope.row.receipt_no"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="收费日期">
                                                        <el-date-picker type="date" placeholder="选择日期" v-model="scope.row.charge_time" value-format="yyyy-MM-dd"></el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="收款金额">
                                                        <el-input v-model="scope.row.price" type="number" @blur="chargeTotal"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                             <el-row :gutter="10">
                                                <el-col :span="8">
                                                    <el-form-item label="收银员">
                                                        <el-select v-model="scope.row.fk_stf_c_id" filterable>
                                                            <el-option
                                                            v-for="item in staffs"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                              
                                                <el-col :span="8">
                                                    <el-form-item label="收付类型">
                                                        <el-select v-model="scope.row.charge_type" filterable>
                                                            <el-option
                                                            v-for="item in BsDate.chargeType"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                  <el-col :span="8">
                                                    <el-form-item label="付款方式">
                                                        <el-select v-model="scope.row.pay_type" filterable>
                                                            <el-option
                                                            v-for="item in BsDate.payType"
                                                            :key="item.pk_id"
                                                            :label="item.name"
                                                            :value="item.pk_id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>


                                                 </el-row>
                                             <el-row :gutter="10">
                                              
                                                <el-col :span="8">
                                                    <el-form-item label="支付流水号" label-width="90px">
                                                        <el-input v-model="scope.row.trans_no"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-form-item label="备注">
                                                        <el-input v-model="scope.row.item"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="操作" width="100px;">
                                            <template slot-scope="scope">
                                                <el-button size="small" type="primary" @click="chargeGooddelete(scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="confirmeditor" type="primary" :loading="loading">确认</el-button>
                <el-button size="medium" @click="closeeditor">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="licence"
            :visible.sync="licenceDialogVisible"
            :close-on-click-modal="false"
            :before-close="licenceCanel"
            width="400px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="licencescroll">
                            <el-form :model="formlicence"  label-width="100px" ref="formlicence" :rules="licencerules" label-position="top">
                                <el-row :gutter="20" style="margin:0">
                                    <el-col :span="24">
                                        <el-form-item label="变更单号"  style="margin-bottom:5px" v-if="formlicence.index!=='kai'">
                                            <el-input v-model="formlicence.order_no"></el-input>
                                        </el-form-item>
                                        <el-form-item label="变更日期" prop="bill_time" style="margin-bottom:5px" v-if="formlicence.index!=='kai'">
                                            <el-date-picker type="date" placeholder="选择日期" v-model="formlicence.bill_time" value-format="yyyy-MM-dd"></el-date-picker>
                                        </el-form-item>
                                        <label for="name" class="el-form-item__label bitian">变更单图片</label><br />
                                        <img :src="formlicence.src" alt="" style="width:200px;height:200px;">
                                        <el-upload
                                            ref="upload"
                                            :action="oss.host+''"
                                            :on-change="licenceHandlePreview"
                                            :on-remove="licencePicRemove"
                                            :on-success="licencePicSuccess"
                                            :on-error="licencePicError"
                                            :data="oss.data || {}"
                                            :auto-upload="false">
                                            <el-button slot="trigger" size="small" type="primary">选择照片</el-button>
                                        </el-upload>
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
            class="cus"
            :visible.sync="cusDialogVisible"
            width="500px"
            fullscreen
            center>
                <div style="height:100%">
                    <el-scrollbar style="height:100%;" ref="cusscroll">
                            <el-form :model="formcus"  label-width="100px" ref="formcus"  label-position="left">
                                <el-row :gutter="20" style="margin:0">
                                    <el-form-item label="姓名">
                                        <el-input v-model="formcus.patient_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别">
                                        <el-radio v-model="formcus.patient_sex" :label="1">男</el-radio>
                                        <el-radio v-model="formcus.patient_sex" :label="2">女</el-radio>
                                    </el-form-item>
                                    </el-row>
                                     <el-row>
                                    <el-form-item label="客户手机">
                                        <el-input v-model="formcus.patient_phone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="家属手机">
                                        <el-input v-model="formcus.family_phone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="科室">
                                        <el-select v-model="formcus.fk_dub_id" filterable clearable placeholder="请选择科室" @change="dubChange">
                                            <el-option
                                            v-for="item in dublist"
                                            :key="item.pk_id"
                                            :label="item.name"
                                            :value="item.pk_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="床位">
                                        <el-input v-model="formcus.bed"></el-input>
                                    </el-form-item>
                                        <el-form-item label="分娩时间">
                                        <el-date-picker type="date" placeholder="选择日期" v-model="formcus.birth_time" value-format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="分娩类型">
                                        <el-radio v-model="formcus.birth_type" :label="1">顺</el-radio>
                                        <el-radio v-model="formcus.birth_type" :label="2">剖</el-radio>
                                    </el-form-item>
                                    </el-row>
                                    <el-row>
                                    <el-form-item label="宝宝">
                                        <el-input v-model="formcus.baby_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="省市">
                                        <el-cascader
                                            size="large"
                                            :options="options"
                                            v-model="formcus.city"
                                            change-on-select
                                            placeholder="请选择省市" 
                                            clearable>
                                        </el-cascader>
                                    </el-form-item>
                                    <el-form-item label="地址">
                                        <el-input v-model="formcus.family_addr"></el-input>
                                    </el-form-item>
                                    <el-form-item label="备注">
                                        <el-input type="textarea" v-model="formcus.remark" :rows="5"></el-input>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                    </el-scrollbar>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="cusConfirm" type="primary">确认</el-button>
                <el-button size="medium" @click="cusDialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import '@/plugins/imagezoom'
import mask from '@/assets/img/mask.png'
import selector from '@/components/selector'
import * as func from '@/utils/Lfunc'
import * as api from '@/api/order'
import * as apip from '@/api/public'
import * as BsDate from '@/assets/BasicData'
import { mapGetters } from 'vuex'
import { provinceAndCityData } from 'element-china-area-data'
import monent from 'moment'
export default {
    name:'orderdetails',
    components:{selector},
    props: {

    },
    data () {
        return {
            func,
            BsDate,
            degrees:0,
            myoryh:process.env.type||'kong',
            options: provinceAndCityData,
            virtual_good_id:1,                          //虚拟id
            dialogVisible:false,
            licenceDialogVisible:false,
            cusDialogVisible:false,
            loadinglicence:false,
            loadingdetail:false,
            form:{
                pk_id:'',
                fk_hpl_id:'',
                fk_dub_id:'',
                group_id:'',
                patient_name:'',
                patient_phone:'',
                family_phone:'',
                order_no:'',
                bed:'',
                fk_stf_q_id:'',
                total:0,
                has_pay:0,
                patient_sex:1,
                work_type:1,
                pattern:2,
                bill_time:'',
                endtime:'',
                picurl:'',
                birth_time:'',
                birth_type:'',
                baby_name:'',
                family_addr:'',
                provinceid:'',
                cityid:'',
                remark:'',
                 custom_id:'', //客户id
               
            },
            rules:{
                fk_hpl_id:[
                    {required:true,message:' ' }
                ],
                fk_dub_id:[
                    {required:true,message:' ' }
                ],
                patient_name:[
                    {required:true,message:' ' }
                ],
                group_id:[
                    {required:false,message:' ' }
                ],
                bill_time:[
                    {required:true,message:' ' }
                ],
                fk_stf_q_id:[
                    {required:true,message:' ' }
                ]
            },
            order_goods:[],                                 //产品明细
            order_server:[],                                //服务明细
            order_charge:[],                                //收付明细
            change_orders:[],                               //变更单
            formlicence:{                                   //证照
                index:'',
                pk_id:'',
                order_no:'',
                bill_time:monent().format('YYYY-MM-DD'),  //变更日期
                src:'',
                path:'',
                order_id:'',
                is_change:'',
                id:''
            },
            formcus:{
                patient_name:'',
                patient_sex:'',
                patient_phone:'',
                family_phone:'',
                fk_dub_id:'',
                bed:'',
                birth_time:'',
                birth_type:'',
                baby_name:'',
                city:[],
                family_addr:'',
                remark:''
            },
            licencerules:{                                  //证照
                order_no:[{ required: true, message: '请输入单号'}],
                bill_time:[{ required: true, message: '请选择时间'}]
            },
            staffs:[],                                      //人员
            nuringsList:[],                                 //护工
            goodsList:[],                                   //产品
            servergoodsList:[],                             //服务明细对应的产品
            oss:{},
            dublist:[],                                     //科室
            grouplist:[],                                    //护理组
            useddata:{}                                     //旧数据
        }
    },
    methods:{
        hplChange(dub,group,staff){                          //项目改变触发事件
            this.dublist=[]
            this.grouplist=[]
            this.goodsList=[]
            this.staffs=[]
            this.nuringsList=[]
            if(this.form.fk_hpl_id){
                apip.getDubList({fk_hpl_id:[this.form.fk_hpl_id]}).then(res=>{
                    this.dublist=res.data
                    this.rules.fk_dub_id[0].required=this.dublist.length!==0
                    this.form.fk_dub_id=dub || ''
                }).catch(()=>{})
                apip.getGroupList({fk_hpl_id:[this.form.fk_hpl_id]}).then(res=>{
                    this.grouplist=res.data
                    this.form.group_id=group || ''
                }).catch(()=>{})
                api.getGoodsList({fk_hpl_id:this.form.fk_hpl_id}).then(res=>{
                    this.goodsList=res.data
                }).catch(()=>{})
                api.getStaffsList({fk_hpl_id:[this.form.fk_hpl_id],fk_psn_id:[1,10,11,12,14,32]}).then(res=>{
                    this.staffs=res.data
                    this.form.fk_stf_q_id=staff || ''
                }).catch(()=>{})
                api.getStaffsList({fk_hpl_id:[this.form.fk_hpl_id],fk_psn_id:[10,11,12,13,32]}).then(res=>{
                    console.log(res)
                    this.nuringsList=res.data
                }).catch(()=>{})
            }else{
                this.form.fk_dub_id=dub || ''
                this.form.group_id=group || ''
                this.form.fk_stf_q_id=staff || ''
            }
        },
        dubChange(e){                                        //科室改变触发事件
            let list=this.dublist.filter(_=>e===_.pk_id)
            if(list.length!==0&&this.order_server.length===0&&list[0].pattern){
                this.form.pattern=list[0].pattern
                this.patternChange()
            }
        },
        patternChange(){                                     //护理模式改变触发事件
            this.rules.group_id[0].required=this.form.pattern===1
        },
        dateChange(index){                                   //开单时间和结算时间对比
            if(new Date(this.form.bill_time).getTime()>new Date(this.form.endtime).getTime()){
                this.$message({
                    type: 'warning',
                    message: index=='bill_time'?'开单时间应小于结算时间':'结算时间应大于开单时间'
                })
                this.form[index]=''
            }
        },
        openeditor(pk_id){                                   //打开订单详情
            this.dialogVisible=true
            this.degrees=0
            this.virtual_good_id=1
            for(let i in this.form){
                if(typeof this.form[i]==='object'){
                    this.form[i]=[]
                }else{
                    if(['total','has_pay'].indexOf(i)!==-1){
                        this.form[i]=0
                    }else if(['patient_sex','work_type'].indexOf(i)!==-1){
                        this.form[i]=1
                    }else if(['pattern'].indexOf(i)!==-1){
                        this.form[i]=2
                    }else if(['bill_time'].indexOf(i)!==-1){
                        this.form[i]=func.getYearMonthDay(new Date())
                    }else{
                        this.form[i]=''
                    }
                }
            }
            this.change_orders=[]
            this.order_goods=[]
            this.order_server=[]
            this.order_charge=[]
            this.useddata=JSON.parse(JSON.stringify({
                order_base:this.form,
                order_goods:this.order_goods,
                order_service:this.order_server,
                order_charge:this.order_charge,
                change_orders:this.change_orders
            }))
            setTimeout(_=>{
                this.$refs['detscroll'].wrap.scrollTop=0
                this.$refs['form'].clearValidate()
                this.$refs.singleTable.setCurrentRow()
                if(this.change_orders.length&&!this.form.pk_id){
                    this.$refs.singleTable.setCurrentRow(this.change_orders[0])
                }
                $('#rotImg').css('height', $('#picid').css('width'))
                $('#picid').css('min-height', $('#picid').css('width'))
                $('#rotImg').imagezoom()
                $('.zoomMask').css('background', 'url('+mask+') repeat scroll 0 0 transparent')
                $(".bigimg")[0].style.transform='rotate('+this.degrees+'deg)'
            },500)
            if(pk_id){
                this.loadingdetail=true
                api.getOrderInfo({pk_id}).then(res=>{
                    this.loadingdetail=false
                    this.change_orders=res.data.data.change_orders
                    if(res.data.data.order_base.pic_path){
                        this.change_orders.unshift({
                            path:res.data.data.order_base.pic_path,
                            zs:true
                        })
                    }
                    if(this.change_orders.length){
                        this.$refs.singleTable.setCurrentRow(this.change_orders[0])
                    }
                    this.order_charge=res.data.data.order_charge
                    for(let i in res.data.data.order_base){
                        for(let j in this.form){
                            if(i===j){
                                this.form[j]=res.data.data.order_base[i]
                            }
                        }
                    }
                    this.hplChange(res.data.data.order_base.fk_dub_id,res.data.data.order_base.group_id,res.data.data.order_base.fk_stf_q_id)
                    for(let i in res.data.data.order_goods){
                        res.data.data.order_goods[i].selectid=res.data.data.order_goods[i].pk_id
                        if(res.data.data.order_goods[i].saleman===0){
                            res.data.data.order_goods[i].saleman=''
                        }
                    }
                    for(let i in res.data.data.order_service){
                        res.data.data.order_service[i].virtual_good_id=res.data.data.order_service[i].order_goods_id
                    }
                    this.order_goods=res.data.data.order_goods
                    this.order_server=res.data.data.order_service
                    this.useddata=JSON.parse(JSON.stringify({
                        order_base:this.form,
                        order_goods:this.order_goods,
                        order_service:this.order_server,
                        order_charge:this.order_charge,
                        change_orders:this.change_orders
                    }))
                }).catch(()=>{})
            }
        },
        confirmeditor(){                                     //确认修改或新增
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let list=JSON.parse(JSON.stringify(this.order_server))
                    let listch=JSON.parse(JSON.stringify(this.change_orders))
                    let changeorder=[]
                    for(let i in list){
                        list[i].pattern=this.form.pattern
                    }
                    let data={
                        order_base:this.form,
                        order_goods:this.order_goods,
                        order_service:list,
                        order_charge:this.order_charge,
                        change_orders:this.change_orders
                    }
                    if(!this.ischange(this.useddata,data)&&this.form.pk_id!==''){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        this.dialogVisible=false
                        return true
                    }
                    for(let i in listch){
                        if(!listch[i].zs){
                            changeorder.push(listch[i])
                        }
                    }
                    for(let i in changeorder){
                        if(i=='0'){
                            changeorder[i].is_change=0
                        }else{
                            changeorder[i].is_change=1
                        }
                    }
                    if(this.form.pk_id){
                        api.updateOrder({order_data:data}).then(res=>{
                            this.dialogVisible=false
                                    this.$message({
                                        message: '编辑成功',
                                        type: 'success'
                                    })
                                    this.$emit('getList')
                        }).catch(()=>{})
                    }else{
                        api.addOrder({order_data:data}).then(res=>{
                            this.dialogVisible=false
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    })
                                    this.$emit('getList')
                        }).catch(()=>{})
                    }
                }
            })
        },
        closeeditor(){                                       //关闭订单详情
            let list=JSON.parse(JSON.stringify(this.order_server))
            for(let i in list){
                list[i].pattern=this.form.pattern
            }
            let data={
                order_base:this.form,
                order_goods:this.order_goods,
                order_service:list,
                order_charge:this.order_charge,
                change_orders:this.change_orders
            }
            if(this.ischange(this.useddata,data)){
                this.$confirm('有未保存项,确认退出吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dialogVisible=false
                }).catch(() => {})
            }else{
                this.dialogVisible=false
            }
        },

        handleClose(){
            this.closeeditor()
        },
        rote(){                                              //点击旋转
            this.degrees=this.degrees+90
            $("#rotImg")[0].style.transform='rotate('+this.degrees+'deg)'
            $(".bigimg")[0].style.transform='rotate('+this.degrees+'deg)'
        },
        licenceHandlePreview(file,fileList){                 //选中图片后触发的事件
            if(fileList.length>1){
                fileList.splice(0,1)
            }
            if(file.status==='ready'){
                this.formlicence.src=file.url
                this.loadinglicence=true
                this.oss.type=file.raw.type.substring(file.raw.type.indexOf('/')+1)
                this.licencePicBefore()
            }
        },
        licencePicBefore(){                          //上传之前获取OSS
            api.getOss('orders').then(res=>{
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
            this.formlicence.src=''
            this.formlicence.allurl=''
        },
        licencePicSuccess(file,fileList){            //证件照片上传成功触发的事件
            setTimeout(()=>{
                this.formlicence.path=this.oss.host+'/'+this.oss.key+this.oss.time+'.'+this.oss.type
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
                this.formlicence.src=''
            },100)
        },
        licenceRadioEvent(val){                      //点击票据展示图片
            if(val){this.form.picurl=val.path}
        },
        licenceOpen(val,index){                      //打开编辑变更单或选择开单图片
            if(val==='add'){
                this.formlicence={
                    index:'',
                    pk_id:'',
                    order_no:'',
                    bill_time:monent().format('YYYY-MM-DD'),
                    src:'',
                    path:'',
                    order_id:this.form.pk_id,
                    is_change:'',
                    id:''
                }
            }else if(val==='change'){
                this.formlicence={
                    index:index,
                    order_no:this.change_orders[index].order_no,
                    bill_time:this.change_orders[index].bill_time,
                    src:this.change_orders[index].path,
                    path:this.change_orders[index].path,
                    pk_id:this.change_orders[index].pk_id,
                    order_id:this.change_orders[index].order_id,
                    is_change:this.change_orders[index].is_change,
                    id:this.change_orders[index].id
                }
            }
            this.licenceDialogVisible=true
            setTimeout(_=>{
                this.$refs['licencescroll'].wrap.scrollTop=0
                this.$refs['formlicence'].clearValidate()
            },100)
        },
        licenceDelete(index){                        //删除变更单
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.change_orders.splice(index,1)
                if(this.change_orders.length){
                    this.$refs.singleTable.setCurrentRow(this.change_orders[0])
                }else{
                    this.form.picurl=''
                }
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
        licenceConfirm(){                            //确认新增或修改变更单或确认开单图片
            this.$refs['formlicence'].validate((valid) => {
                if (valid) {
                    if(this.formlicence.path===''){
                        this.$message({
                            message: '图片不得为空',
                            type: 'warning'
                        })
                        return 
                    }
                    this.$refs.singleTable.setCurrentRow()
                    this.loadinglicence=true
                    if(this.formlicence.index===''){
                        this.change_orders.push({
                            order_no:this.formlicence.order_no,
                            bill_time:this.formlicence.bill_time,
                            src:this.formlicence.src,
                            path:this.formlicence.path,
                            pk_id:this.formlicence.pk_id,
                            order_id:this.formlicence.order_id,
                            is_change:this.formlicence.is_change,
                            id:this.formlicence.id
                        })
                        this.form.picurl=this.formlicence.src
                    }else{
                        let list=JSON.parse(JSON.stringify(this.change_orders))
                        list[this.formlicence.index]={
                            order_no:this.formlicence.order_no,
                            bill_time:this.formlicence.bill_time,
                            src:this.formlicence.src,
                            path:this.formlicence.path,
                            pk_id:this.formlicence.pk_id,
                            order_id:this.formlicence.order_id,
                            is_change:this.formlicence.is_change,
                            id:this.formlicence.id
                        }
                        this.change_orders=list
                        this.$refs.singleTable.setCurrentRow(this.change_orders[this.formlicence.index])
                    }
                    this.loadinglicence=false
                    this.licenceDialogVisible=false
                    this.$refs.upload.uploadFiles=[]
                } else {
                    return false
                }
            })
        },
        licenceCanel(){                              //取消新增修改变更单及开单图片
            this.loadinglicence=false
            this.$refs.upload.abort()
            this.$refs.upload.uploadFiles=[]
            this.licenceDialogVisible=false
        },
        orderGoodadd(){                              //新增产品明细项
            if(this.form.fk_hpl_id==''){
                this.$message({
                    type: 'warning',
                    message: '请先选择项目'
                })
                return
            }
            this.order_goods.push({
                pk_id:'',
                order_id:this.form.pk_id,
                goods_id:'',
                price:'',
                num:1,
                real_total:0,
                staff_pay:'',
                staff_pay_total:'',
                per_price:'',
                virtual_good_id:'asd'+this.virtual_good_id,
                discount:0,
                total_discount:0,
                goods_name:'',
                description:'',
                goodssn:'',
                combo_type:'',
                real_combo_num:1,
                combo_num:0,
                commission:0,
                saleman:'',
                type:'',
                selectid:'asd'+this.virtual_good_id
            })
            this.virtual_good_id+=1
        },
        orderGoodchange(val,index){                  //产品明细项选择产品后触发的事件
            var list=this.goodsList.filter(_=>val==_.goods_id)
            if(val&&list.length!==0){
                this.order_goods[index].combo_type=list[0].combo_type
                this.order_goods[index].combo_num=list[0].combo_num
                this.order_goods[index].commission=Number(list[0].commission)
                this.order_goods[index].description=list[0].description
                this.order_goods[index].goods_description=list[0].goods_description
                this.order_goods[index].goods_name=list[0].goods_name
                this.order_goods[index].goods_id=list[0].goods_id
                this.order_goods[index].goodssn=list[0].goodssn
                this.order_goods[index].per_price=list[0].per_price
                this.order_goods[index].price=list[0].price
                this.order_goods[index].staff_pay=list[0].staff_pay
                this.order_goods[index].staff_pay_total=list[0].staff_pay_total
                this.order_goods[index].type=list[0].type
            }
            this.orderGoodSum(index)
        },
        orderGooddelete(index){                      //删除产品明细项
            for(let i in this.order_server){
                if(this.order_server[i].goods_id==''){
                    this.$message({
                        type: 'warning',
                        message: '服务明细产品不得为空'
                    })
                    return
                }
            }
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.order_goods.splice(index,1)
                this.orderTotal()
            }).catch(() => {})
        },
        orderGoodSum(index){                         //计算产品明细项的金额小计及数量不得为0
            let arr=this.order_goods[index]
            let list=this.order_server.filter(_=>arr.selectid===_.virtual_good_id)
            arr.sum=arr.real_combo_num
            if(arr.real_combo_num<0 || arr.real_combo_num==0 || arr.real_combo_num==''){
                let sum=0
                for(let i in list){
                    sum+=Number(list[i].time)
                }
                arr.sum=arr.real_combo_num=(sum===0?1:sum)
            }
            if(arr.discount==''){
                arr.discount=0
            }
            if(arr.total_discount==''){
                arr.total_discount=0
            }
            if(arr.commission==''){
                arr.commission=0
            }
            if(list.length){
                let sum=0
                for(let i in list){
                    sum+=Number(list[i].time)
                }
                if(sum>Number(arr.real_combo_num)){
                    arr.sum=arr.real_combo_num=sum
                    this.$message({
                        type: 'warning',
                        message: '产品数量不得小于服务数量'
                    })
                }
            }
            // list.forEach(res=>{
            //     res.per_price=arr.per_price
            // })
            arr.real_total=arr.goods_id?(((Number(arr.price)+Number(arr.discount))*(Number(arr.real_combo_num)/Number(arr.combo_num))) + Number(arr.total_discount)).toFixed(4):0
            arr.per_price=Number(arr.real_total)/Number(arr.real_combo_num).toFixed(4)
            this.orderTotal()
        },
        orderTotal(){                                //计算金额合计
            let total=0
            this.order_goods.forEach(res=>{
                if(!res.real_total){res.real_total=0}
                total+=Number(res.real_total)
            })
            this.form.total=total.toFixed(4)
        },
        serverGoodadd(){                             //新增服务明细
            if(this.order_goods.length==0){
                this.$message({
                    type: 'warning',
                    message: '请先新增产品'
                })
                return
            }
            for(let i in this.order_goods){
                if(this.order_goods[i].goods_id==''){
                    this.$message({
                        type: 'warning',
                        message: '新增产品项不得为空'
                    })
                    return
                }
            }
            //计时方式 默认 医护12小时，母婴 24
             let count_type =''
             if(this.ismy){
                 count_type=2
             }else{
                  count_type=1
             }
 
            this.order_server.push({
                pk_id:'',
                order_id:this.form.pk_id,
                virtual_good_id:'',
                order_goods_id:'',
                goods_id:'',
                start:'',
                combo_type:'',
                vir_combo_type:'',
                type:'',
                end:'',
                time:0,
                fk_stf_id:'',
                staff_pay:0,
                vir_staff_pay:0,
                pattern:'',
                price:0,
                per_price:0,
                pay_type:'',
                server_amount:0,
                count_type,
            })
        },
        serverGoodchange(val,index){                 //服务明细选择产品明细触发事件
            var list=this.order_goods.filter(_=>val==_.selectid)
            if(val&&list.length!==0){
                this.order_server[index].order_goods_id=list[0].pk_id
                // this.order_server[index].virtual_good_id=list[0].virtual_good_id
                this.order_server[index].goods_id=list[0].goods_id
                this.order_server[index].type=list[0].type
                
                console.log(list[0]) 
                list[0].type===3&&(this.order_server[index].count_type=3)
                // this.order_server[index].count_type=list[0].type===3?3:2
                
                
                this.order_server[index].price=Number(list[0].price)
                this.order_server[index].per_price=list[0].per_price
                this.order_server[index].vir_staff_pay=list[0].staff_pay
                this.order_server[index].vir_combo_type=list[0].combo_type==='月'?'天':list[0].combo_type==='套'?'次':list[0].combo_type
            }
            this.serverGoodSum(index)
        },
        serverGooddelete(index){                     //删除服务明细项
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.order_server.splice(index,1)
            }).catch(() => {})
        },
        serverGoodSum(index){                        //计算服务明细项的金额小计等
            let arr=this.order_server[index]
            let list=this.order_server.filter(_=>arr.virtual_good_id===_.virtual_good_id)
            let master=this.order_goods.filter(_=>arr.virtual_good_id===_.selectid)
            if(arr.time<0 || arr.time==''){
                arr.time=0
            }
            if(master.length){
                let sum=0
                for(let i in list){
                    sum+=Number(list[i].time)
                }
                if(sum>Number(master[0].real_combo_num)){
                    arr.time=0
                    this.$message({
                        type: 'warning',
                        message: '服务明细数量不得超过对应产品的数量'
                    })
                }
            }
            if(arr.start&&Number(arr.time)!=0&&arr.count_type!='3'){
                let n=new Date(new Date(arr.start).getTime()+(Math.ceil(arr.time)-(arr.count_type=='1'?1:0))*86400000)
                arr.end=func.getYearMonthDay(n)
            }else{
                arr.end=arr.count_type=='3'?arr.start:''
            }
            arr.staff_pay=Number(arr.vir_staff_pay)*Number(arr.time).toFixed(4)
            arr.server_amount=Number(arr.per_price)*Number(arr.time).toFixed(4)
        },
        chargeGoodadd(){                             //新增收付明细项
            this.order_charge.push({
                pk_id:'',
                order_id:this.form.pk_id,
                price:0,
                trans_no:'',
                charge_time:func.getYearMonthDay(new Date()),
                charge_type:1,
                pay_type:1,
                fk_stf_c_id:'',
                receipt_no:'',
               
                item:''
            })
        },
        chargeGooddelete(index){                     //删除收付明细项
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.order_charge.splice(index,1)
                this.chargeTotal()
            }).catch(() => {})
        },
        chargeTotal(){                                //计算金额合计
            let total=0
            this.order_charge.forEach(res=>{
                if(!res.price){res.price=0}
                total+=Number(res.price)
            })
            this.form.has_pay=total.toFixed(4)
        },
        ischange(old,news){                         //判断是否修改
            if(news.order_goods.length!==old.order_goods.length || news.order_service.length!==old.order_service.length || news.order_charge.length!==old.order_charge.length || news.change_orders.length!==old.change_orders.length){
                return true
            }
            for(let i in news.order_base){
                if(!(news.order_base[i]==old.order_base[i])){
                    return true
                }
            }
            for(let n in news){
                if(['order_goods','order_service','order_charge','change_orders'].indexOf(n)!==-1){
                    for(let i in news[n]){
                        for(let j in news[n][i]){
                            if(!(news[n][i][j]==old[n][i][j])){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        },
        openCus(){                                  //打开客户资料
            for(let i in this.formcus){
                if(i=='city'){
                    this.formcus[i]=this.form.provinceid?this.form.cityid?[this.form.provinceid,this.form.cityid]:[this.form.provinceid]:[]
                }else{
                    this.formcus[i]=this.form[i]
                }
            }
            this.cusDialogVisible=true
        },
        cusConfirm(){                               //确认客户资料
            for(let i in this.formcus){
                if(i=='city'){
                    this.form.provinceid=this.formcus.city.length!==0?this.formcus.city[0]:''
                    this.form.cityid=this.formcus.city.length===2?this.formcus.city[1]:''
                }else{
                    this.form[i]=this.formcus[i]
                }
            }
            this.cusDialogVisible=false
        }
    },
    watch:{
        
    },
    mounted(){
        
    },
    computed: {
        ...mapGetters(['loading']),
    }
}
</script>
<style lang='scss' scoped>
    
</style>
<style lang='scss'>
    #orderdetails{
        .el-dialog{
            top:5%;
            height:90%;
        }
        .licence .el-dialog{
            margin-top:0;
            top:15%;
            height:70%;
        }
        .cus .el-dialog{
            margin-top:0;
            top:15%;
            height:70%;
        }
        .el-dialog__body{
            position: absolute;
            padding-top: 10px;
            padding-bottom: 10px;
            top: 40px;
            left:0;right:0;
            bottom: 61px;
        }
        .el-scrollbar__wrap{
            padding-bottom: 17px;
        }
        .el-dialog__footer{
            position: absolute;
            bottom: 0;
            left:0;right:0;
        }
        .el-radio+.el-radio{
            margin-left: 15px;
        }
        .bottom20{
            .el-form-item{
                margin-bottom: 10px;
            }
        }
        .title{
            color: #909399;font-weight: bold;line-height: 45px;font-size: 17px;
        }
    }
</style>