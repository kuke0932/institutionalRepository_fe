/* eslint-disable comma-spacing */
// const temp_data = (size, parentIndex, parentName) => {
//   if (parentIndex >= 3) {
//     return []
//   }
//   return Array.apply(null, { length: size })
//     .map((k, v) => {
//       const name = parentName + (v + 1) + '-'
//       return {
//         value: name.substring(0, name.length - 1),
//         label: name.substring(0, name.length - 1),
//         children: temp_data(size, parentIndex + 1, name)
//       }
//     })
// }

export default (_self, h) => {
  var data = ajax.onereadystatechange()
  return [
    h('cascaderMulti', {
      props: {
        placeholder: _self.obj.placeholder || '这是一个级联选择器',
        // data: temp_data(3, 0, '数字'),
        data: data,
        multiple: _self.obj.multiple || false,
        separate: _self.obj.multiple ? '，' : '/',
        filterable: true,
        value: _self.obj.elementValue || []
      },
      on: {
        'on-change'(arr) {
          if (!_self.obj.fieldName) {
            return false
          }
          // _self.obj.elementValue = arr
          // _self.$emit('handleChangeVal', arr)
        }
      }
    })
  ]
}
// 创建异步对象
var ajax = new XMLHttpRequest()
// 设置请求参数 和请求类型
ajax.open('get', '/business/form/treeDepartmentPeople')
// 发送请求
ajax.send()
// 注册事件
ajax.onereadystatechange = function() {
  if (ajax.readyState === 4 && ajax.status === 200) {
    var j = JSON.parse(ajax.response)
    return j.data
  }
}

export const cascaderConf = {
  // 对应数据库内类型
  elementType: 'cascader',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '级联选择',
  placeholder: '',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  elementRequire: true,
  // 是否多选
  multiple: false,
  // 表单name
  fieldName: '',
  // 绑定的值
  elementValue: [],
  // 验证错误提示信息
  ruleError: '该选项不能为空',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true,
  // 控制流程变量
  // processize: false,
  // 数据展示
  dataShow: false,
  items: []
}
