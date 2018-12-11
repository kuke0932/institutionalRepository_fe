/**
 *
 * @author Dragon
 * @create 2018-09-10 13:55
 **/
import request from '@/utils/request'
import qs from 'qs'
// 第一个节点  起草任务  提交按钮
export function submit(map, formName, taskId, priority) {
  const data = {
    map,
    formName,
    taskId,
    priority
  }
  return request({
    url: '/business/fillin/unifyport',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 部门下拉框
export function department() {
  return request({
    url: '/system/admin/sysDepartment/treeDepartment',
    method: 'get'
  })
}
// 审批人下拉框
export function inspect(departmentId) {
  const data = {
    departmentId
  }
  return request({
    url: '/system/admin/sysUser/listUser2',
    method: 'get',
    params: data
  })
}

// 启动流程渲染表单
export function transfer(databaseFormName, taskId) {
  const data = {
    databaseFormName,
    taskId
  }
  return request({
    url: '/business/form/detailByFormName',
    method: 'get',
    params: data
  })
}
