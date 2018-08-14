<!-- by your name -->
<template>
  <div id="test">
      <Paging :pageIndex="page.index" :pageSize="page.size" :pageTotal="page.total" @changeSize="changesize" @changeIndex="changeindex"></Paging>
        <el-row :gutter="20" style="margin-left:0;margin-right:0;">
            <el-col :span="24">
                <b class="el-form-item__label">公司-->项目(单选)</b>
            </el-col>
            <el-col :span="6">
                <el-select v-model="value1" filterable placeholder="请选择" clearable @change="change1">
                    <el-option
                    v-for="item in option1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <b class="el-form-item__label"></b>
                <el-select v-model="value11" filterable placeholder="请选择" clearable>
                    <el-option
                    v-for="item in option11"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left:0;margin-right:0;">
            <el-col :span="24">
                <b class="el-form-item__label">公司-->项目(多选)</b>
            </el-col>
            <el-col :span="6">
                <el-select v-model="value2" filterable placeholder="请选择" clearable @change="change2">
                    <el-option
                    v-for="item in option2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <b class="el-form-item__label"></b>
                <el-select v-model="value22" filterable placeholder="请选择" multiple >
                    <el-option
                    v-for="item in option22"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left:0;margin-right:0;">
            <el-col :span="24">
                <b class="el-form-item__label">公司-->项目-->组别</b>
            </el-col>
            <el-col :span="6">
                <el-select v-model="value3" filterable placeholder="请选择" clearable @change="change3">
                    <el-option
                    v-for="item in option3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <b class="el-form-item__label"></b>
                <el-select v-model="value33" filterable placeholder="请选择" clearable>
                    <el-option
                    v-for="item in option33"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <b class="el-form-item__label"></b>
                <el-select v-model="value333" filterable placeholder="请选择" clearable>
                    <el-option
                    v-for="item in option333"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left:0;margin-right:0;">
            <el-col :span="24">
                <b class="el-form-item__label">公司-->项目-->组别</b>
            </el-col>
            <el-col :span="6">
                <el-cascader
                    placeholder=""
                    :options="options"
                    filterable
                    change-on-select
                ></el-cascader>
            </el-col>
        </el-row>
  </div>
</template>

<script>
import Pagemixin from '@/mixins/index'
export default {
    name:'test',
    mixins:[Pagemixin],
    data () {
        return {
            value1:'',
            option1:[{
                    value: '1',
                    label: '阿萨德'
                }, {
                    value: '2',
                    label: '气味儿'
                }],
            value11:'',
            option11:[],
            value2:'',
            option2:[{
                    value: '1',
                    label: '阿萨德'
                }, {
                    value: '2',
                    label: '气味儿'
                }],
            value22:[],
            option22:[],
            value3:'',
            option3:[{
                    value: '1',
                    label: '阿萨德'
                }, {
                    value: '2',
                    label: '气味儿'
                }],
            value33:'',
            option33:[],
            value333:'',
            option333:[],
            options: [{
                value: 'zhinan',
                label: '指南',
                children: [{
                    value: 'shejiyuanze',
                    label: '设计原则asdasdadasd',
                    children: [{
                    value: 'yizhi',
                    label: '一致asdasdasdasdasdasdada'
                    }, {
                    value: 'fankui',
                    label: '反馈'
                    }, {
                    value: 'xiaolv',
                    label: '效率'
                    }, {
                    value: 'kekong',
                    label: '可控'
                    }]
                }, {
                    value: 'daohang',
                    label: '导航',
                    children: [{
                    value: 'cexiangdaohang',
                    label: '侧向导航'
                    }, {
                    value: 'dingbudaohang',
                    label: '顶部导航'
                    }]
                }]
                }, {
                value: 'zujian',
                label: '组件',
                children: [{
                    value: 'basic',
                    label: 'Basic',
                    children: [{
                    value: 'layout',
                    label: 'Layout 布局'
                    }, {
                    value: 'color',
                    label: 'Color 色彩'
                    }, {
                    value: 'typography',
                    label: 'Typography 字体'
                    }, {
                    value: 'icon',
                    label: 'Icon 图标'
                    }, {
                    value: 'button',
                    label: 'Button 按钮'
                    }]
                }, {
                    value: 'form',
                    label: 'Form',
                    children: [{
                    value: 'radio',
                    label: 'Radio 单选框'
                    }, {
                    value: 'checkbox',
                    label: 'Checkbox 多选框'
                    }, {
                    value: 'input',
                    label: 'Input 输入框'
                    }, {
                    value: 'input-number',
                    label: 'InputNumber 计数器'
                    }, {
                    value: 'select',
                    label: 'Select 选择器'
                    }, {
                    value: 'cascader',
                    label: 'Cascader 级联选择器'
                    }, {
                    value: 'switch',
                    label: 'Switch 开关'
                    }, {
                    value: 'slider',
                    label: 'Slider 滑块'
                    }, {
                    value: 'time-picker',
                    label: 'TimePicker 时间选择器'
                    }, {
                    value: 'date-picker',
                    label: 'DatePicker 日期选择器'
                    }, {
                    value: 'datetime-picker',
                    label: 'DateTimePicker 日期时间选择器'
                    }, {
                    value: 'upload',
                    label: 'Upload 上传'
                    }, {
                    value: 'rate',
                    label: 'Rate 评分'
                    }, {
                    value: 'form',
                    label: 'Form 表单'
                    }]
                }, {
                    value: 'data',
                    label: 'Data',
                    children: [{
                    value: 'table',
                    label: 'Table 表格'
                    }, {
                    value: 'tag',
                    label: 'Tag 标签'
                    }, {
                    value: 'progress',
                    label: 'Progress 进度条'
                    }, {
                    value: 'tree',
                    label: 'Tree 树形控件'
                    }, {
                    value: 'pagination',
                    label: 'Pagination 分页'
                    }, {
                    value: 'badge',
                    label: 'Badge 标记'
                    }]
                }, {
                    value: 'notice',
                    label: 'Notice',
                    children: [{
                    value: 'alert',
                    label: 'Alert 警告'
                    }, {
                    value: 'loading',
                    label: 'Loading 加载'
                    }, {
                    value: 'message',
                    label: 'Message 消息提示'
                    }, {
                    value: 'message-box',
                    label: 'MessageBox 弹框'
                    }, {
                    value: 'notification',
                    label: 'Notification 通知'
                    }]
                }, {
                    value: 'navigation',
                    label: 'Navigation',
                    children: [{
                    value: 'menu',
                    label: 'NavMenu 导航菜单'
                    }, {
                    value: 'tabs',
                    label: 'Tabs 标签页'
                    }, {
                    value: 'breadcrumb',
                    label: 'Breadcrumb 面包屑'
                    }, {
                    value: 'dropdown',
                    label: 'Dropdown 下拉菜单'
                    }, {
                    value: 'steps',
                    label: 'Steps 步骤条'
                    }]
                }, {
                    value: 'others',
                    label: 'Others',
                    children: [{
                    value: 'dialog',
                    label: 'Dialog 对话框'
                    }, {
                    value: 'tooltip',
                    label: 'Tooltip 文字提示'
                    }, {
                    value: 'popover',
                    label: 'Popover 弹出框'
                    }, {
                    value: 'card',
                    label: 'Card 卡片'
                    }, {
                    value: 'carousel',
                    label: 'Carousel 走马灯'
                    }, {
                    value: 'collapse',
                    label: 'Collapse 折叠面板'
                    }]
                }]
                }, {
                value: 'ziyuan',
                label: '资源'
                }]
            
        }
    },
    mounted(){
        this.page.total=100
    },
    methods:{
        change1(){
            this.value11=''
            this.option11=[]
            if(this.value1=='1'){
                this.option11=[{
                    value: '1-1',
                    label: '阿1-1'
                }]
            }else if(this.value1=='2'){
                this.option11=[{
                    value: '2-1',
                    label: '气2-1'
                }]
            }
        },
        change2(){
            this.value22=[]
            this.option22=[]
            if(this.value2=='1'){
                this.option22=[{
                    value: '1-1',
                    label: '阿1-1'
                },{
                    value: '1-2',
                    label: '阿1-2'
                },{
                    value: '1-3',
                    label: '阿1-3'
                }]
            }else if(this.value2=='2'){
                this.option22=[{
                    value: '2-1',
                    label: '气2-1'
                },{
                    value: '2-2',
                    label: '气2-2'
                },{
                    value: '2-3',
                    label: '气2-3'
                }]
            }
        },
        change3(){
            this.value33=''
            this.option33=[]
            if(this.value3=='1'){
                this.option33=[{
                    value: '1-1',
                    label: '阿1-1'
                }]
            }else if(this.value1=='2'){
                this.option33=[{
                    value: '2-1',
                    label: '气2-1'
                }]
            }
        },
        change33(){
            console.log('111')
            
            this.value333=''
            this.option333=[]
            if(this.value33=='1-1'){
                this.option333=[{
                    value: '1-1-1',
                    label: '阿1-1-1'
                }]
            }else if(this.value33=='2-1'){
                this.option333=[{
                    value: '2-1-1',
                    label: '气2-1-1'
                }]
            }
        }
    },
    watch:{
        value33(){
            console.log('111')
            this.value1=''
            this.value333=''
            this.option333=[]
            if(this.value33=='1-1'){
                this.option333=[{
                    value: '1-1-1',
                    label: '阿1-1-1'
                }]
            }else if(this.value33=='2-1'){
                this.option333=[{
                    value: '2-1-1',
                    label: '气2-1-1'
                }]
            }
        }
    }
}

</script>
<style lang='scss' scoped>
</style>
<style>
    .el-select{width:100%;}
</style>