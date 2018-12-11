/**
 *
 * @author Dragon
 * @create 2018-09-11 17:19
 **/
import request from '@/utils/request'
import qs from 'qs'
// 表格数据
export function examineDropdown() {
  return request({
    url: '/system/admin/sysUser/listUserByDep',
    method: 'get'
  })
}
// 提交接口
export function submitBtn(opinion, formName, onlyId, nextId) {
  const data = {
    opinion,
    formName,
    onlyId,
    nextId
  }
  return request({
    url: '/business/process/complete',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 添加任务附件列表
export function addReport(pid) {
  const data = {
    pid
  }
  return request({
    url: '/business/process/attachment',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 添加任务附件  下载按钮
export function download(path, type, name) {
  const data = {
    path,
    type,
    name
  }
  return request({
    url: '/business/download/file',
    method: 'get',
    params: data
  })
}
