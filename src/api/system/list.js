import request from '@/utils/request'

// 查询内容主列表
export function listList(query) {
  return request({
    url: '/system/list/list',
    method: 'get',
    params: query
  })
}

// 查询内容主详细
export function getList(id) {
  return request({
    url: '/system/list/' + id,
    method: 'get'
  })
}

// 新增内容主
export function addList(data) {
  return request({
    url: '/system/list',
    method: 'post',
    data: data
  })
}

// 修改内容主
export function updateList(data) {
  return request({
    url: '/system/list',
    method: 'put',
    data: data
  })
}

// 删除内容主
export function delList(id) {
  return request({
    url: '/system/list/' + id,
    method: 'delete'
  })
}
