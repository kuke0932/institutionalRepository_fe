import area from '../config/area'
export default (_self, h) => {
  const control = [
    h('Cascader', {
      class: {
        'ivu-input-wrapper ': !_self.obj.details_address
      },
      style: {
        width: _self.obj.details_address ? '100%' : '100%',
        display: 'inline-block'
      },
      props: {
        placeholder: _self.obj.placeholder || (_self.obj.fieldName ? '' : '请选择详细地址'),
        data: area,
        elementValue: _self.obj.elementValue || [],
        filterable: false,
        'change-on-select': true
        // trigger: "hover"
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
  if (!_self.obj.details_address) {
    control.splice(1, 1)
  }
  return control
}
export const addressConf = {
  // 对应数据库内类型
  elementType: 'address',
  // 是否必填
  elementRequire: true,
  // 绑定的值
  elementValue: [],
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '详细地址',
  placeholder: '请输入详细地址',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否多选
  multiple: false,
  // 表单name
  fieldName: '',
  // 验证错误提示信息
  ruleError: '请选择并输入详细地址',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true,
  // 是否需要详细地址
  details_address: true,
  // 控制流程变量
  // processize: false,
  // 数据展示
  dataShow: false,
  items: []
}
