import request from '@/utils/request'

// 查询预警机列表
export function list119(query) {
  return request({
    url: '/device/devList/list',
    method: 'get',
    params: query
  })
}

// 查询预警机详细
export function get119(id) {
  return request({
    url: '/device/devList/' + id,
    method: 'get'
  })
}

// 新增预警机
export function add119(data) {
  return request({
    url: '/device/devList',
    method: 'post',
    data: data
  })
}

// 修改预警机
export function update119(data) {
  return request({
    url: '/device/devList',
    method: 'put',
    data: data
  })
}

// 删除预警机
export function del119(id) {
  return request({
    url: '/device/devList/' + id,
    method: 'delete'
  })
}
