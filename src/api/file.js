/**
 *
 * @author Dragon
 * @create 2018-01-19 13:43
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据id获取file
 * @param id
 */
export function getFileById(id) {
  return request({
    url: '/system/admin/sysFile/getFileById',
    method: 'get',
    params: { id }
  })
}

/**
 * 查看文件夹下的文件
 *
 * @param folderId      文件夹id
 * @param fileRealName  文件真实名称
 * @param fileTitle     文件标题
 * @param pageNum       当前页
 * @param pageSize      每页显示多少条数据
 */
export function listFilePermission(folderId, fileRealName, fileTitle, pageNum = 1, pageSize = 10) {
  const data = {
    folderId,
    fileRealName,
    fileTitle,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysFile/listFilePermission',
    method: 'get',
    params: data
  })
}
/**
 * 查看文件夹下的文件
 *
 * @param folderId      文件夹id
 * @param fileRealName  文件真实名称
 * @param fileTitle     文件标题
 * @param pageNum       当前页
 * @param pageSize      每页显示多少条数据
 */
export function listFile(folderId, fileRealName, fileTitle, pageNum = 1, pageSize = 10) {
  const data = {
    folderId,
    fileRealName,
    fileTitle,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysFile/listFile',
    method: 'get',
    params: data
  })
}

/**
 * 查看文件的附件
 *
 * @param fileId      文件id
 */
export function listFileAttachment(fileId) {
  const data = {
    fileId
  }
  return request({
    url: '/system/admin/sysFile/listFileAttachment',
    method: 'get',
    params: data
  })
}

/**
 * 添加文件
 *
 * @param fileFolderId    所属文件夹id
 * @param fileName        文件名（自动生成）
 * @param fileRealName    文件真实名
 * @param fileDesc        文件描述
 * @param fileTitle       文件标题
 * @param fileContent     文件内容
 * @param fileStatus      文件状态（0正常1草稿）
 * @param fileExtendParentPermission  是否继承父权限（0否1是）
 * @param fileSort        文件排序
 * @param attachmentList  附件集合 属性有：
 * fileId, attachmentName, attachmentRealName, attachmentTitle, attachmentDesc,
 * attachmentSize, attachmentSuffix, attachmentRealPath, attachmentPath, attachmentContent
 *
 * 格式：
 * attachmentList[0].fileId,attachmentList[0].attachmentName
 * attachmentList[1].fileId,attachmentList[1].attachmentName
 */
export function addFile(fileFolderId, fileName, fileRealName, fileDesc, fileTitle, fileContent, fileStatus, fileExtendParentPermission, fileSort, attachmentList) {
  const data = {
    fileFolderId,
    fileName,
    fileRealName,
    fileDesc,
    fileTitle,
    fileContent,
    fileStatus,
    fileExtendParentPermission,
    fileSort,
    attachmentList
  }
  return request({
    url: '/system/admin/sysFile/addFile',
    method: 'post',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'indices', allowDots: true })
    }
  })
}

/**
 * 上传文件
 *
 * @param file
 * @param folderName
 */
export function uploadFile(file, folderName) {
  const data = {
    file,
    folderName
  }
  return request({
    url: '/system/admin/sysFile/uploadFile',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 转换文档格式
 *
 * @param fromPath  文件路径
 */
export function convertFile(fromPath) {
  return request({
    url: '/system/admin/sysFile/convertFile',
    method: 'post',
    data: qs.stringify({ fromPath })
  })
}

/**
 * 修改文件
 *
 * @param id              文件id
 * @param fileFolderId    所属文件夹id
 * @param fileRealName    文件真实名
 * @param fileDesc        文件描述
 * @param fileTitle       文件标题
 * @param fileContent     文件内容
 * @param fileStatus      文件状态（0正常1草稿）
 * @param fileExtendParentPermission  是否继承父权限（0否1是）
 * @param fileSort        文件排序
 * @param attachmentList  附件集合 属性有：
 * fileId, attachmentName, attachmentRealName, attachmentTitle, attachmentDesc,
 * attachmentSize, attachmentSuffix, attachmentRealPath, attachmentPath, attachmentContent
 *
 * 格式：
 * attachmentList[0].fileId,attachmentList[0].attachmentName
 * attachmentList[1].fileId,attachmentList[1].attachmentName
 */
export function updateFile(id, fileFolderId, fileRealName, fileDesc, fileTitle, fileContent, fileStatus, fileExtendParentPermission, fileSort, attachmentList) {
  const data = {
    id,
    fileFolderId,
    fileRealName,
    fileDesc,
    fileTitle,
    fileContent,
    fileStatus,
    fileExtendParentPermission,
    fileSort,
    attachmentList
  }
  return request({
    url: '/system/admin/sysFile/updateFile',
    method: 'post',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'indices', allowDots: true })
    }
  })
}

/**
 * 批量删除文件
 *
 * @param ids 文件id，多个id中间以“,”分开
 */
export function removeFile(ids) {
  return request({
    url: '/system/admin/sysFile/removeFile',
    method: 'post',
    data: qs.stringify({ ids })
  })
}

/**
 * 复制文件
 *
 * @param fileIds   需要复制的文件id，多个id中间以“,”隔开
 * @param folderId  将要复制到的文件夹id
 */
export function copyFile(fileIds, toFolderId) {
  const data = {
    fileIds,
    toFolderId
  }
  return request({
    url: '/system/admin/sysFile/copyFile',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 移动文件
 *
 * @param fileIds   需要移动的文件id，多个id中间以“,”隔开
 * @param toFolderId  将要移动到的文件夹id
 */
export function moveFile(fileIds, toFolderId) {
  const data = {
    fileIds,
    toFolderId
  }
  return request({
    url: '/system/admin/sysFile/moveFile',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查看文件角色
 *
 * @param fileId    文件id
 * @param roleName  角色名
 * @param roleValue 角色值
 */
export function showAllFileRole(fileId, roleName, roleValue) {
  const data = {
    fileId,
    roleName,
    roleValue
  }
  return request({
    url: '/system/admin/sysFile/showAllFileRole',
    method: 'get',
    params: data
  })
}

/**
 * 查看文件部门
 *
 * @param fileId          文件id
 * @param departmentName  部门名
 * @param parentName      父部门名
 */
export function showAllFileDepartment(fileId, departmentName, parentName) {
  const data = {
    fileId,
    departmentName,
    parentName
  }
  return request({
    url: '/system/admin/sysFile/showAllFileDepartment',
    method: 'get',
    params: data
  })
}

/**
 * 查看文件群组
 *
 * @param fileId    文件id
 * @param groupName 群组名
 */
export function showAllFileGroup(fileId, groupName) {
  const data = {
    fileId,
    groupName
  }
  return request({
    url: '/system/admin/sysFile/showAllFileGroup',
    method: 'get',
    params: data
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
 * @param fileId        文件夹id
 * @param roleList        角色id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 * @param departmentList  部门id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 * @param groupList       群组id和文件夹权限id集合  内部属性为 id 和 filePermissionIds
 */
export function setFilePermission(fileId, roleList, departmentList, groupList) {
  const data = {
    fileId,
    roleList,
    departmentList,
    groupList
  }
  return request({
    url: '/system/admin/sysFile/setFilePermission',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/json'
    }
  })
}
