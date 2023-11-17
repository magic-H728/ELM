<script setup>
import {onMounted, onUnmounted} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";


import {
  listAllEquipment
} from "@/api/regulatory_platform/equipmentmap";


let map = null;

onMounted(() => {
  AMapLoader.load({
    key: "5f2db4b4f39b637ed8e8c6320835b5b0", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
      .then((AMap) => {
        const map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式@！
          zoom: 4.3, // 初始化地图级别
          center: [110.397428, 15.90923], // 初始化地图中心点位置
        });
        let deviceList = [];
        // 获取设备列表
        listAllEquipment().then((res) => {
          deviceList = res.data;
          // 遍历设备列表，添加marker
          for (var i = 0; i < deviceList.length; i++) {
            var marker = new AMap.CircleMarker({
              center: [deviceList[i].longitude, deviceList[i].latitude],
              radius: 10,
              strokeColor: 'white',
              strokeWeight: 2,
              strokeOpacity: 0.5,
              fillColor: 'rgba(0,0,255,1)',
              fillOpacity: 0.5,
              zIndex: 10,
              bubble: true,
              cursor: 'pointer',
              clickable: true
            });
            map.add(marker);
          }
        });


        // for循环添加多个marker，center为经纬度数组,使用随机数模拟
        // for (var i = 0; i < 100; i += 1) {
        //   var center = [97 + Math.random() * 20, 26 + Math.random() * 15];
        //   var circleMarker = new AMap.CircleMarker({
        //     center: center,
        //     radius: 10,
        //     strokeColor: 'white',
        //     strokeWeight: 2,
        //     strokeOpacity: 0.5,
        //     fillColor: 'rgba(0,0,255,1)',
        //     fillOpacity: 0.5,
        //     zIndex: 10,
        //     bubble: true,
        //     cursor: 'pointer',
        //     clickable: true
        //   })
        //   // circleMarker.setMap(map)
        //   map.add(circleMarker)
        // }
      })
      .catch((e) => {
        console.log(e);
      });
});


onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 1400px;
}
</style>

