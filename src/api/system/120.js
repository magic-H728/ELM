import request from '@/utils/request'

// 查询位置信息列表
export function list120(query) {
  return request({
    url: '/device/devPos/list',
    method: 'get',
    params: query
  })
}

// 查询位置信息详细
export function get120(id) {
  return request({
    url: '/device/devPos/' + id,
    method: 'get'
  })
}

// 新增位置信息
export function add120(data) {
  return request({
    url: '/device/devPos',
    method: 'post',
    data: data
  })
}

// 修改位置信息
export function update120(data) {
  return request({
    url: '/device/devPos',
    method: 'put',
    data: data
  })
}

// 删除位置信息
export function del120(id) {
  return request({
    url: '/device/devPos/' + id,
    method: 'delete'
  })
}
