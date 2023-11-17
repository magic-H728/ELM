import request from '@/utils/request'

// 查询车辆报警列表
export function list121(query) {
  return request({
    url: '/job/warning/list',
    method: 'get',
    params: query
  })
}

// 查询车辆报警详细
export function get121(id) {
  return request({
    url: '/job/warning/' + id,
    method: 'get'
  })
}

// 新增车辆报警
export function add121(data) {
  return request({
    url: '/job/warning',
    method: 'post',
    data: data
  })
}

// 修改车辆报警
export function update121(data) {
  return request({
    url: '/job/warning',
    method: 'put',
    data: data
  })
}

// 删除车辆报警
export function del121(id) {
  return request({
    url: '/job/warning/' + id,
    method: 'delete'
  })
}
