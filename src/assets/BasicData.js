export let nursingMode=[    //护理模式
    {pk_id:1,name:'整体'},
    {pk_id:2,name:'一对一'}
]   
export let connStatus=[    //开科状态
    {pk_id:1,name:'整体'},
    {pk_id:2,name:'一对一'},
    {pk_id:3,name:'暂停'},
    {pk_id:4,name:'未开科'}
]                        

export let orderStatus=[                             //订单状态或是否结算
   {pk_id:0,name:'未结算'},
   {pk_id:1,name:'已结算'}
]

export let hplType=[                             //部门类型
   {pk_id:1,name:'医院项目'},
   {pk_id:2,name:'线下门店'},
   {pk_id:3,name:'居家社区'},
   {pk_id:4,name:'职能部门'},
   {pk_id:5,name:'人才库'},
   {pk_id:6,name:'离职人员'}
]

export let hplGrade=[                             //医院等级
   {name:'三级特等'},
   {name:'三级甲等'},
   {name:'三级乙等'},
   {name:'三级丙等'},
   {name:'二级甲等'},
   {name:'二级乙等'},
   {name:'二级丙等'},
   {name:'一级甲等'},
   {name:'一级乙等'},
   {name:'一级丙等'}
]

export let isSign=[                             //是否签约
   {pk_id:0,name:'未签约'},
   {pk_id:1,name:'已签约'}
]

export let bankIsDefault=[                             //银行账号是否默认
   {pk_id:0,name:'否'},
   {pk_id:1,name:'是'}
]

export let isEnable=[                             //是否启用
   {pk_id:0,name:'未启用'},
   {pk_id:1,name:'启用'}
]

export let isMainDep=[                             //是否主要科室
   {pk_id:0,name:'否'},
   {pk_id:1,name:'是'}
]

export let productClass=[                             //产品分类
   {pk_id:1,name:'服务计时'},
   {pk_id:2,name:'实物产品'},
   {pk_id:3,name:'服务计量'}
]

export let unit=[                                   //单位
   {name:'月',pk_id:'月'},
   {name:'套',pk_id:'套'},
   {name:'天',pk_id:'天'},
   {name:'次',pk_id:'次'},
   {name:'盒',pk_id:'盒'},
   {name:'只',pk_id:'只'},
   {name:'个',pk_id:'个'},
   {name:'人',pk_id:'人'},
   {name:'瓶',pk_id:'瓶'},
   {name:'箱',pk_id:'箱'},
   {name:'包',pk_id:'包'},
   {name:'项',pk_id:'项'},
   {name:'小时',pk_id:'小时'}
]

export let PerOfVal=[                             //有效期类型
   {pk_id:0,name:'截止日期'},
   {pk_id:1,name:'长期'}
]

export let sex=[                             //有效期类型
   {pk_id:1,name:'男'},
   {pk_id:2,name:'女'}
]

export let recruitType=[                             //用工类型
   {pk_id:1,name:'合同雇佣'},
   {pk_id:2,name:'居间协议'}
]

export let isBlack=[                             //是否被拉黑
   {pk_id:0,name:'未拉黑'},
   {pk_id:1,name:'拉黑'}
]

export let isInput=[                             //是否录入
    {pk_id:0,name:'全部'},
    {pk_id:1,name:'已录入'},
    {pk_id:2,name:'未录入'}
]
export let isUse=[                             //票本状态是否使用
    {pk_id:0,name:'全部'},
    {pk_id:1,name:'未使用'},
    {pk_id:2,name:'已使用'},
    {pk_id:3,name:'部分使用'}
]
export let isAccept=[                             //接收状态是否接收
    {pk_id:0,name:'全部'},
    {pk_id:1,name:'未接收'},
    {pk_id:2,name:'已接收'}
    
]
export let isInspect=[                             //核销状态正常/已核销
    {pk_id:0,name:'全部'},
    {pk_id:1,name:'正常'},
    {pk_id:2,name:'已核销'}
    
]
export let codeType=[                             //入库类别
    {pk_id:0,name:'存盘入库'},
    {pk_id:1,name:'编号入库'}
    
]
export let receiptType=[                             //票据类别
    {pk_id:0,name:'请选择'},
    {pk_id:1,name:'生活护理收费票据'}
    
]

export let isPay=[                             //是否支付
    {pk_id:0,name:'未支付'},
    {pk_id:1,name:'已支付'}
]

export let chargeType=[                             //收付类型
    {pk_id:1,name:'收费'},
    {pk_id:2,name:'退费'},
    {pk_id:3,name:'付费'}
]

export let payType=[                             //付款方式
    {pk_id:1,name:'现金'},
    {pk_id:2,name:'银行转账'},
    {pk_id:3,name:'微信'},
    {pk_id:4,name:'支付宝'},
    {pk_id:5,name:'其他'}
]
export let inStoreType=[                             //入库类别
    {pk_id:1,name:'调拨入库'},
    {pk_id:2,name:'核销入库'}
]

export let isLock=[                             //是否锁定
    {pk_id:-1,name:'全部'},
    {pk_id:0,name:'未锁定'},
    {pk_id:1,name:'锁定'}
]

export let cancellationType=[                             //作废类别
    {pk_id:1,name:'印刷错误'},
    {pk_id:2,name:'填写错误'}
]
export let isConfirm=[                             //是否确认
    {pk_id:1,name:'未确认'},
    {pk_id:2,name:'已确认'}
]
