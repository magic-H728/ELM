import request from '@/utils/request'

// 查询防撞预警设备列表
export function listEarlywarningequipment(query) {
  return request({
    url: '/regulatory_platform/earlywarningequipment/list',
    method: 'get',
    params: query
  })
}

// 查询防撞预警设备详细
export function getEarlywarningequipment(serialNumber) {
  return request({
    url: '/regulatory_platform/earlywarningequipment/' + serialNumber,
    method: 'get'
  })
}

// 新增防撞预警设备
export function addEarlywarningequipment(data) {
  return request({
    url: '/regulatory_platform/earlywarningequipment',
    method: 'post',
    data: data
  })
}

// 修改防撞预警设备
export function updateEarlywarningequipment(data) {
  return request({
    url: '/regulatory_platform/earlywarningequipment',
    method: 'put',
    data: data
  })
}

// 删除防撞预警设备
export function delEarlywarningequipment(serialNumber) {
  return request({
    url: '/regulatory_platform/earlywarningequipment/' + serialNumber,
    method: 'delete'
  })
}
