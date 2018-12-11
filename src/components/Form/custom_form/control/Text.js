export default (_self, h) => {
  return [
    // h('Input', {
    //   attrs: {
    //     type: 'textarea',
    //     placeholder: _self.obj.placeholder || '这是一个文本域',
    //     value: _self.obj.elementValue,
    //     maxlength: _self.obj.maxLength || 200
    //   },
    //   props: {
    //     rows: _self.obj.maxRows || 5
    //   },
    //   on: {
    //     'input'(event) {
    //       if (!_self.obj.fieldName) {
    //         return false
    //       }
    //       _self.obj.elementValue = event.currentTarget.value
    //       _self.$emit('handleChangeVal', event.currentTarget.value)
    //     }
    //   }
    // })
    h('Input', {
      attrs: {
        type: 'textarea',
      },
      props: {
        placeholder: _self.obj.placeholder || '这是一个文本域',
        maxlength: parseInt(_self.obj.maxLength) || 200,
        value: _self.obj.elementValue || ''
      },
      on: {
        'input': function(val) {
          if (!_self.obj.fieldName) {
            return false
          }
          _self.obj.elementValue = event.currentTarget.value
          // _self.$emit('handleChangeVal', val.currentTarget.value)
        }
      }
    })
  ]
}

export const textConf = {
  // 对应数据库内类型
  elementType: 'text',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '文本域',
  placeholder: '',
  // 是否显示行内元素
  inlineBlock: false,
  // 最大长度
  maxLength: 200,
  // 是否必填
  elementRequire: true,
  // 文本域行高
  maxRows: 5,
  // 绑定的值
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
  // 是否被渲染
  visibility: true,
  // 数据展示
  dataShow: false,
  // 控制流程变量
  // processize: false,
  items: []
}
