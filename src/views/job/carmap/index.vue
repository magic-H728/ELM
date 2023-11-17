<template>
  <div id="container"></div>
  <pagination
      v-show="total > 0"
      :model="queryParams"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
  />
</template>
<script>
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
import AMapLoader from "@amap/amap-jsapi-loader";
import { list120,get120 } from "@/api/system/120";
export default {
  name: "120",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      PosList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 999
      },
      form: {},
      rules: {},
      map: null,

    };
  },
  created() {
    this.loadMap();
  },
  destroyed() {
    this.map?.destroy();
  },
  methods: {
    showMarkerInfo(markerInfo, lnglat) {
      const infoWindowContent = `
    <div class="overlay">

    <div class="custom-info-window">
    <p>详细信息</p>
    <hr>
    <div class="modal-content">
      <p>车辆编号：${markerInfo.mId}</p>
      <p>维护站：${markerInfo.siteId}</p>
      <p>项目号：${markerInfo.projectId}</p>
      </div>
      <router-link class="link-type" :to='/device/devPos/' + ${markerInfo.mId}>历史轨迹</router-link>
    </div>
    </div>
  `;

      const infoWindow = new AMap.InfoWindow({
        content: infoWindowContent,
        position: lnglat, // 将 InfoWindow 定位到点击的位置
      });

      infoWindow.open(this.map, lnglat);
    },



    getList() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        list120(this.queryParams)
            .then((response) => {
              this.PosList = response.rows;
              this.total = response.total;
              this.loading = false;
              resolve(response); // Resolve the Promise with the response
            })
            .catch((error) => {
              reject(error); // Reject the Promise with the error
            });
      });
    },
    async loadMap() {
      try {
        const AMap = await AMapLoader.load({
          key: "5f2db4b4f39b637ed8e8c6320835b5b0",
          version: "2.0",
          plugins: [],
        });

        this.map = new AMap.Map("container", {
          viewMode: "2D",
          zoom: 4.3,
          center: [69.22, 76.22],
        });

        await this.addMarkers();
      } catch (e) {
        console.log(e);
      }
    },

    async addMarkers() {
      await this.getList();
      for (let i = 0; i < this.PosList.length; i++) {
        const marker = new AMap.CircleMarker({
          center: [this.PosList[i].longi, this.PosList[i].lati],
          radius: 10,
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: 'rgba(0,0,255,1)',
          fillOpacity: 0.5,
          zIndex: 10,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
        });
// 在每个标记上添加点击事件监听器
        marker.on('click', ((index) => {
          return (e) => {
            this.showMarkerInfo(this.PosList[index],e.lnglat);
          };
        })(i));
        this.map.add(marker);
      }
      // 在所有标记添加后调用 setFitView
      this.map.setFitView();
    },
  },

};
</script>
<style scoped>
#container {
  width: 100%;
  height: 800px;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.custom-info-window {
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  max-width: 80%;
  overflow-y: auto;

}

/* 弹出框内容 */
.modal-content {
  font-size: 5px;
}
</style>


