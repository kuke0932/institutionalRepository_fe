export default (_self, h) => {
  if (typeof _self.obj.items === 'string') {
    _self.obj.items = JSON.parse(_self.obj.items)
  }
  return [
    h('CheckboxGroup', {
      props: {
        value: _self.obj.elementValue || []
      },
      on: {
        'on-change'(arr) {
          if (!_self.obj.fieldName) {
            return false
          }
          _self.obj.elementValue = arr
          _self.$emit('handleChangeVal', arr)
        }
      }
    }, _self.obj.items.map(v => {
      return h('Checkbox', {
        props: {
          label: v.labelValue
        }
      }, v.labelName)
    }))
  ]
}

export const checkBoxConf = {
  // 对应数据库内类型
  elementType: 'checkbox',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '多选框',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  elementRequire: true,
  // 绑定的值
  elementValue: [],
  // 选项内数据
  items: [{ 'labelValue': '1', 'labelName': '多选框1' }, { 'labelValue': '2', 'labelName': '多选框2' }, { 'labelValue': '3', 'labelName': '多选框3' }],
  // 表单name
  fieldName: '',
  // 验证错误提示信息
  ruleError: '该选项不能为空',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 控制流程变量
  // processize: false,
  // 数据展示
  dataShow: false,
  // 是否被禁用
  disabled: true,
  // 是否被渲染
  visibility: true
}
