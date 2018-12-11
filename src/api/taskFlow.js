/**
 *
 * @author Dragon
 * @create 2018-09-05 10:21
 **/
import request from '@/utils/request'

export function taskFlowList() {
  return request({
    url: '/business/model/procdef',
    method: 'get'
  })
}

export function search(key, status, pageNum, pageSize) {
  const data = {
    key,
    status,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/model/procdef',
    method: 'get',
    params: data
  })
}

export function startupProcess(key, name) {
  const data = {
    key,
    name
  }
  return request({
    url: '/business/process/start',
    method: 'get',
    params: data
  })
}

// 页面数据列表 流程激活 按钮 接口
export function listDataActivation(id) {
  const data = {
    id
  }
  return request({
    url: '/business/process/defactive',
    method: 'get',
    params: data
  })
}

// 页面数据列表 流程挂起 按钮 接口
export function listDataPopUpHangUp(id) {
  const data = {
    id
  }
  return request({
    url: '/business/process/defhangup',
    method: 'get',
    params: data
  })
}

// 启动流程 弹出窗 关闭的调用方法
export function closePopUp(onlyId) {
  const data = {
    onlyId
  }
  return request({
    url: '/business/process/cancel',
    method: 'get',
    params: data
  })
}