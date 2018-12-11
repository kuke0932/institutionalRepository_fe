export default (_self, h) => {
  if (typeof _self.obj.items === 'string') {
    _self.obj.items = JSON.parse(_self.obj.items)
  }
  return [
    h('RadioGroup', {
      props: {
        value: _self.obj.elementValue || '-1'
      },
      on: {
        'input'(value) {
          if (!_self.obj.fieldName) {
            return false
          }
          _self.obj = Object.assign(_self.obj, {
            value
          })
          _self.$emit('handleChangeVal', value)
        }
      }
    }, _self.obj.items.map(v => {
      return h('Radio', {
        props: {
          label: v.labelValue
        }
      }, v.labelName)
    }))
  ]
}

export const radioConf = {
  // 对应数据库内类型
  elementType: 'radio',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '单选框',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  elementRequire: true,
  // 绑定的值
  elementValue: '',
  // 选项内数据
  items: [{ 'labelValue': '1', 'labelName': '单选框1' }, { 'labelValue': '2', 'labelName': '单选框2' }],
  // 表单name
  fieldName: '',
  // 验证错误提示信息
  ruleError: '请选择',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 数据展示
  dataShow: false,
  // 控制流程变量
  processize: false,
  // 是否被渲染
  visibility: true
}
