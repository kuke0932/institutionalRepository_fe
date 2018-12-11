/**
 *
 * @author Dragon
 * @create 2018-01-17 8:49
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取文件权限树形结构
 */
export function treeFilePermission() {
  return request({
    url: '/system/admin/filePermission/treeFilePermission',
    method: 'get'
  })
}

/**
 * 新增文件权限
 *
 * @param filePermissionName  权限名
 * @param parentId            父节点
 * @param filePermissionUrl   权限地址
 * @param filePermissionDesc  权限描述
 * @param filePermissionSort  权限顺序
 */
export function addFilePermission(filePermissionName, parentId, filePermissionUrl, filePermissionDesc, filePermissionCode, filePermissionSort) {
  const data = {
    filePermissionName,
    parentId,
    filePermissionUrl,
    filePermissionDesc,
    filePermissionCode,
    filePermissionSort
  }
  return request({
    url: '/system/admin/filePermission/addFilePermission',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据权限id获取权限信息
 *
 * @param id
 */
export function getPermissionById(id) {
  return request({
    url: '/system/admin/filePermission/getPermissionById',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据id修改文件权限
 *
 * @param id                  权限id
 * @param filePermissionName  权限名
 * @param parentId            父节点
 * @param filePermissionUrl   权限地址
 * @param filePermissionDesc  权限描述
 * @param filePermissionSort  权限顺序
 */
export function updateFilePermission(id, filePermissionName, parentId, filePermissionUrl, filePermissionDesc, filePermissionCode, filePermissionSort) {
  const data = {
    id,
    filePermissionName,
    parentId,
    filePermissionUrl,
    filePermissionDesc,
    filePermissionSort
  }
  return request({
    url: '/system/admin/filePermission/updateFilePermission',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id批量删除文件权限
 *
 * @param id 权限id
 */
export function removeFilePermission(id) {
  return request({
    url: '/system/admin/filePermission/removeFilePermission',
    method: 'post',
    data: qs.stringify({ id })
  })
}
