import request from '@/utils/request'

export function cascade() {
  return request({
    url: '/business/form/treeDepartmentPeople',
    method: 'get'
  })
}
