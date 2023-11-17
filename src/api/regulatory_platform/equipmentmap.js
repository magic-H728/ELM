import request from '@/utils/request'

// 查询防撞预警设备列表
export function EarlywarningequipmentById(query) {
    return request({
        url: `/device/devPos/${query.id}`,
        method: 'get',
        params: query
    });
}


// 查询所有设备
export function listAllEquipment() {
    return request({
        url: '/device/devPos/list',
        method: 'get'
    })
}