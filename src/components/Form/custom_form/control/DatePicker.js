export default (_self, h) => {
  return [
    h('DatePicker', {
      props: {
        placeholder: _self.obj.placeholder || (_self.obj.fieldName ? '' : '请选择日期'),
        type: (!_self.obj.format || _self.obj.format === 'yyyy年MM月dd日') ? 'date' : 'datetime',
        format: _self.obj.format || 'yyyy年MM月dd日',
        value: _self.obj.elementValue
      },
      on: {
        'input'(arr) {
          if (!_self.obj.fieldName) {
            return false
          }
          _self.obj.elementValue = arr
          _self.$emit('handleChangeVal', arr)
        }
      }
    })
  ]
}

export const datePickerConf = {
  // 对应数据库内类型
  elementType: 'datepicker',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '时间选择',
  placeholder: '请选择日期',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  elementRequire: true,
  // 表单name
  fieldName: '',
  // 绑定的值
  elementValue: '',
  // 验证错误提示信息
  ruleError: '选项不能为空',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: false,
  // 是否需要时分
  format: 'yyyy年MM月dd日',
  // 控制流程变量
  // processize: false,
  // 数据展示
  dataShow: false,
  items: []
}
