/**
 *
 * @author Dragon
 * @create 2018-01-17 9:20
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取文件夹树形结构
 */
export function treeFolder() {
  return request({
    url: '/system/admin/sysFolder/treeFolder',
    method: 'get'
  })
}

export function getFolderById(id) {
  return request({
    url: '/system/admin/sysFolder/getFolderById',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取当前用户所拥有的文件夹权限
 */
export function treeFolderPermission() {
  return request({
    url: '/system/admin/sysFolder/treeFolderPermission',
    method: 'get'
  })
}

/**
 * 获取当前用户所拥有的文件夹权限
 */
export function listFolderPermission() {
  return request({
    url: '/system/admin/sysFolder/listFolderPermission',
    method: 'get'
  })
}

/**
 * 新增文件夹并设置权限
 *
 * 参数为json字符串格式 例：
 * {"sysFolder":{"folderName":"文件名","folderSort":1,"folderExtendParentPermission":0},
 *  "roleList":[{"id": 1, "filePermissionIds": "1,2"},{"id": 2, "filePermissionIds": "1,2"}],
 *  "departmentList":[{"id": 1, "filePermissionIds": "1,2"}],
 *  "groupList":[{"id": 1, "filePermissionIds": "1,2"}]
 * }
 *
 * @param sysFolder   文件夹属性  （folderName, parentId, folderExtendParentPermission, folderSort）
 * folderName 文件夹名称，parentId 父文件夹，folderExtendParentPermission 是否继承父权限（0否1是），folderSort文件夹顺序
 *
 * @param roleList        角色id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 * @param departmentList  部门id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 * @param groupList       群组id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 */
export function addFolder(sysFolder, roleList, departmentList, groupList) {
  const data = {
    sysFolder,
    roleList,
    departmentList,
    groupList
  }
  return request({
    url: '/system/admin/sysFolder/addFolder',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

/**
 * 新增文件夹获取还未添加的角色列表
 *
 * @param roleIds   角色id集合
 * @param roleName  角色名
 * @param roleValue 角色值
 * @param pageNum   当前页
 * @param pageSize  每页显示多少条数据
 */
export function listAddRole(roleIds, roleName, roleValue, pageNum = 1, pageSize = 10) {
  const data = {
    roleIds,
    roleName,
    roleValue,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysFolder/listAddRole',
    method: 'get',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    }
  })
}

/**
 * 新增文件夹获取还未添加的群组列表
 *
 * @param groupName 群组名
 * @param groupIds  群组id集合
 * @param pageNum   当前页
 * @param pageSize  每页显示条数
 */
export function listAddGroup(groupName, groupIds, pageNum = 1, pageSize = 10) {
  const data = {
    groupName,
    groupIds,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysFolder/listAddGroup',
    method: 'get',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    }
  })
}

/**
 * 文件夹重命名
 *
 * @param id          文件夹id
 * @param folderName  文件夹新名
 */
export function folderRename(id, folderName) {
  const data = {
    id,
    folderName
  }
  return request({
    url: '/system/admin/sysFolder/folderRename',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateFolderSort(id, folderSort) {
  const data = {
    id,
    folderSort
  }
  return request({
    url: '/system/admin/sysFolder/updateFolderSort',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查看文件夹角色
 *
 * @param folderId  文件夹id
 * @param roleName  角色名称
 * @param roleValue 角色值
 */
export function showAllFolderRole(folderId, roleName, roleValue) {
  const data = {
    folderId,
    roleName,
    roleValue
  }
  return request({
    url: '/system/admin/sysFolder/showAllFolderRole',
    method: 'get',
    params: data
  })
}

/**
 * 查看文件夹所有部门
 *
 * @param folderId        文件夹id
 * @param departmentName  部门名称
 * @param parentName      父部门名称
 */
export function showAllFolderDepartment(folderId, departmentName, parentName) {
  const data = {
    folderId,
    departmentName,
    parentName
  }
  return request({
    url: '/system/admin/sysFolder/showAllFolderDepartment',
    method: 'get',
    params: data
  })
}

/**
 * 查看文件夹所有群组
 *
 * @param folderId  文件夹id
 * @param groupName 群组名
 */
export function showAllFolderGroup(folderId, groupName) {
  const data = {
    folderId,
    groupName
  }
  return request({
    url: '/system/admin/sysFolder/showAllFolderGroup',
    method: 'get',
    params: data
  })
}

/**
 * 查看权限 获取带disabled的权限树
 */
export function treeDisabledPermission() {
  return request({
    url: '/system/admin/filePermission/treeDisabledPermission',
    method: 'get'
  })
}

/**
 * 给文件夹设置权限
 *
 * 参数为json字符串格式 例：
 * {"sysFolder":{"folderName":"文件名","folderSort":1,"folderExtendParentPermission":0},
 *  "roleList":[{"id": 1, "filePermissionIds": "1,2"},{"id": 2, "filePermissionIds": "1,2"}],
 *  "departmentList":[{"id": 1, "filePermissionIds": "1,2"}],
 *  "groupList":[{"id": 1, "filePermissionIds": "1,2"}]
 * }
 *
 * @param folderId        文件夹id
 * @param roleList        角色id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 * @param departmentList  部门id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 * @param groupList       群组id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 */
export function setFolderPermission(folderId, roleList, departmentList, groupList) {
  const data = {
    folderId,
    roleList,
    departmentList,
    groupList
  }
  return request({
    url: '/system/admin/sysFolder/setFolderPermission',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}

/**
 * 删除文件夹
 *
 * @param id  文件夹id
 */
export function removeFolder(id) {
  return request({
    url: '/system/admin/sysFolder/removeFolder',
    method: 'post',
    data: qs.stringify({ id })
  })
}
