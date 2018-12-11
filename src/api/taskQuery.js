/**
 *
 * @author Dragon
 * @create 2018-09-10 11:02
 **/
import request from '@/utils/request'
import qs from 'qs'
// 初始化列表数据
export function taskQueryList() {
  return request({
    url: '/business/process/find',
    method: 'get'
  })
}

// 列表激活按钮
export function activate(taskId) {
  const data = {
    taskId
  }
  return request({
    url: '/business/process/find',
    method: 'get',
    params: data
  })
}

export function search(title, status, pageNum, pageSize) {
  const data = {
    title,
    status,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/process/find',
    method: 'get',
    params: data
  })
}

export function toExamine(formKey) {
  const data = {
    formKey
  }
  return request({
    url: '/business/form/splice',
    method: 'get',
    params: data
  })
}

// 点击文件审批按钮  渲染文件审批弹窗页面
export function renderFromList(databaseFormName, status, onlyId, taskId) {
  const data = {
    databaseFormName,
    status,
    onlyId,
    taskId
  }
  return request({
    url: '/business/form/detailByFormName',
    method: 'get',
    params: data
  })
}
// 文件审批弹窗  提交
export function approvalSubmit(onlyId, formName, opinion) {
  const taskDto = {
    onlyId,
    formName,
    opinion
  }
  return request({
    url: '/business/process/complete',
    method: 'post',
    data: qs.stringify(taskDto)
  })
}
// 文件审批弹窗  挂起
export function hangUp(taskId) {
  const data = {
    taskId
  }
  return request({
    url: '/business/process/hangup',
    method: 'get',
    params: data
  })
}
export function receive(taskId, onlyId, formName) {
  const data = {
    taskId,
    onlyId,
    formName
  }
  return request({
    url: '/business/process/claim',
    method: 'get',
    params: data
  })
}

// export function processHandle(onlyId) {
//   console.log(111)
//   return request({
//     url: '/business/show/processimage',
//     method: 'get'
//   })
// }
