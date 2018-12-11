/**
 *
 * @author Dragon
 * @create 2018-09-13 14:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 页面数据列表
 */

export function deploymentProcessList(name, status, pageNum, pageSize) {
  const data = {
    name,
    status,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/model/list',
    method: 'get',
    params: data
  })
}

/**
 * 删除模型
 *
 */

export function deleteDeploymentProcess(modelId) {
  return request({
    url: '/business/model/delete/' + modelId,
    method: 'get'
  })
}

export function deploymentBtn(modelId) {
  const data = {
    modelId
  }
  return request({
    url: '/business/model/deploy',
    method: 'get',
    params: data
  })
}
