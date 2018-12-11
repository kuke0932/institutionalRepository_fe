/**
 *
 * @author Dragon
 * @create 2018-09-19 18:02
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 新建业务流程
 */
export function formList(name, pageNum, pageSize) {
  const data = {
    name,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/form/list',
    method: 'get',
    params: data
  })
}

/**
 * 查询详情
 *
 * **/
export function formDetail(formId) {
  const data = {
    formId
  }
  return request({
    url: '/business/form/detailById',
    method: 'get',
    params: data
  })
}

/**
 * 修改表单
 *
 * **/
export function editForm(cfd, formId) {
  const data = {
    formId
  }
  return request({
    url: '/business/form/edit',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: cfd,
    params: data
  })
}

/**
 * 删除表单
 *
 * **/
export function removeForm(formIds) {
  return request({
    url: '/business/form/remove',
    method: 'post',
    data: qs.stringify({ formIds })
  })
}

/**
 * 新建业务流程
 */
export function createForm(cfd) {
  return request({
    url: '/business/form/create',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: cfd
  })
}

/**
 * 数据字典下拉框选择值
 */
export function dropDownBox(type) {
  const data = {
    type
  }
  return request({
    url: '/business/dict/select',
    method: 'get',
    params: data
  })
}

/**
 *  提交校检表单名称
 */
export function verifyName(formId, names) {
  const data = {
    formId,
    names
  }
  return request({
    url: '/business/verify/name',
    method: 'post',
    data: qs.stringify(data)
  })
}
