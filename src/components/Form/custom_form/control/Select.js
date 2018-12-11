export default (_self, h) => {
  if (typeof _self.obj.items === 'string') {
    _self.obj.items = JSON.parse(_self.obj.items)
  }
  return [
    h('Select', {
      props: {
        placeholder: _self.obj.placeholder || '这是一个下拉选项框',
        value: _self.obj.value || ''
      },
      on: {
        'input'(value) {
          if (!_self.obj.name) {
            return false
          }
          _self.obj.value = value
          _self.$emit('handleChangeVal', value)
        }
      }
    },
    _self.obj.items.map(v => {
      return h(
        'Option', {
          props: {
            value: '' + v.labelValue
          }
        },
        v.labelName
      )
    })
    )
  ]
}

export const selectConf = {
  elementType: 'select',
  config: true,
  label: '选择框',
  placeholder: '',
  inlineBlock: false,
  elementRequire: true,
  items: Array.apply(null, { length: 5 })
    .map((k, v) => {
      return {
        labelValue: v + 1,
        labelName: '选项' + (v + 1)
      }
    }),
  elementValue: '',
  fieldName: '',
  ruleError: '请选择',
  relation: false,
  relation_name: '',
  relation_value: '',
  // 控制流程变量
  processize: false,
  // 数据展示
  dataShow: false,
  visibility: true
}
