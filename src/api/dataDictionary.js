
import request from '@/utils/request'
/**
 * 数据字典保存按钮
 *  */
export function saveData(dictKey, dictValue, elementType, listItems) {
  const data = {
    dictKey,
    dictValue,
    elementType,
    listItems
  }
  return request({
    url: '/business/dict/add',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
