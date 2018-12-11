export default (_self, h) => {
  return [
    h('Input', {
      props: {
        placeholder: _self.obj.placeholder || '这是一个输入框',
        maxlength: parseInt(_self.obj.maxLength) || 20,
        value: _self.obj.value || ''
      },
      on: {
        'input': function(val) {
          if (!_self.obj.fieldName) {
            return false
          }
          _self.obj.elementValue = event.currentTarget.value
          _self.$emit('handleChangeVal', val)
        }
      }
    })
  ]
}

export const inputConf = {
  // 对应数据库内类型
  elementType: 'input',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '输入框',
  placeholder: '',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否隐藏显示元素
  visibilityHidden: false,
  // 是否必填
  elementRequire: true,
  // 最大长度
  maxLength: 20,
  // 选项内数据
  items: [{ 'labelValue': null, 'labelName': '' }],
  elementValue: '',
  // 表单name
  fieldName: '',
  // 验证错误提示信息
  ruleError: '该字段不能为空',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 控制流程变量
  processize: false,
  // 数据展示
  dataShow: false,
  // 是否被渲染
  visibility: true
}
