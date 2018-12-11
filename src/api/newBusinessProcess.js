/**
 *
 * @author Dragon
 * @create 2018-09-13 8:39
 **/
import request from '@/utils/request'
/**
 * 新建业务流程
 */
export function content() {
  return request({
    url: '/business/model/newModel',
    method: 'get'
  })
}
