import request from '@/utils/request'
import qs from 'qs'

export function search(query, pageNum = 1, pageSize = 10) {
  const data = {
    query,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/search',
    method: 'post',
    data: qs.stringify(data)
  })
}

