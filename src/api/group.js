/**
 *
 * @author Dragon
 * @create 2018-01-15 10:41
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据群组名获取群组列表
 *
 * @param groupName
 * @param pageNum
 * @param pageSize
 */
export function listGroup(groupName, pageNum = 1, pageSize = 10) {
  const data = {
    groupName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysGroup/listGroup',
    method: 'get',
    params: data
  })
}

/**
 * 新增群组
 *
 * @param groupName
 * @param groupDesc
 */
export function addGroup(groupName, groupDesc) {
  const data = {
    groupName,
    groupDesc
  }
  return request({
    url: '/system/admin/sysGroup/addGroup',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id获取群组信息
 *
 * @param id 群组id
 */
export function getGroupById(id) {
  return request({
    url: '/system/admin/sysGroup/getGroupById',
    method: 'get',
    params: id
  })
}

/**
 * 根据id修改群组
 *
 * @param id
 * @param groupName
 * @param groupDesc
 */
export function updateGroup(id, groupName, groupDesc) {
  const data = {
    id,
    groupName,
    groupDesc
  }
  return request({
    url: '/system/admin/sysGroup/updateGroup',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据群组id批量删除群组
 *
 * @param ids
 */
export function removeGroup(ids) {
  const data = { ids }
  return request({
    url: '/system/admin/sysGroup/removeGroup',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据群组id获取该群组下的用户列表
 *
 * @param groupId   群组id
 * @param loginName 用户名
 * @param userName  昵称
 * @param pageNum   当前页
 * @param pageSize  每页显示多少条数据
 */
export function showGroupUsers(groupId, loginName, userName, pageNum = 1, pageSize = 10) {
  const data = {
    groupId,
    loginName,
    userName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysGroup/showGroupUsers',
    method: 'get',
    params: data
  })
}

/**
 * 根据 部门id/用户名/用户昵称 查询用户列表信息
 *
 * @param groupId       群组id
 * @param departmentId  部门id
 * @param loginName     用户名
 * @param userName      用户昵称
 * @param showOrAdd     区分是查看用户还是添加用户（1查看用户列表，2群组添加用户，3角色添加用户）
 * @param pageNum       当前页
 * @param pageSize      每页显示多少条信息
 */
export function listUser(groupId, departmentId, loginName, userName, showOrAdd = 2, pageNum = 1, pageSize = 10) {
  const data = {
    groupId,
    departmentId,
    loginName,
    userName,
    showOrAdd,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysUser/listUser',
    method: 'get',
    params: data
  })
}

/**
 * 添加用户到群组
 *
 * @param groupId
 * @param userIds
 */
export function addUserToGroup(groupId, userIds) {
  const data = {
    groupId,
    userIds
  }
  return request({
    url: '/system/admin/sysGroup/addUserToGroup',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 从群组里删除用户
 *
 * @param groupId
 * @param userIds
 */
export function removeUserFromGroup(groupId, userIds) {
  const data = {
    groupId,
    userIds
  }
  return request({
    url: '/system/admin/sysGroup/removeUserFromGroup',
    method: 'post',
    data: qs.stringify(data)
  })
}
