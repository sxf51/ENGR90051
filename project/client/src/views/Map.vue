<template>
    <div class="map-view">
      <h2>Map of Electronic Waste Recycling Points</h2>
      <div class="map-container">
        <l-map :zoom="17" :center="center" style="height: 500px; width: 100%">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker 
            v-for="(bin, index) in recyclingBins" 
            :key="index" 
            :lat-lng="[bin.lat, bin.lng]"
          >
            <l-popup>
              <div>
                <h3>{{ bin.name }}</h3>
                <p>{{ bin.address }}</p>
                <p>Opening time: {{ bin.hours }}</p>
              </div>
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
  </template>
  
  <script>
  import { LMap, LTileLayer, LMarker, LPopup } from 'vue3-leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    name: 'RecycleMap',
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup
    },
    data() {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        center: [-37.79838, 144.95999], // 默认位置，实际应用中可以根据用户位置调整
        recyclingBins: [
          {
            name: 'Central city recycling station',
            address: '123 Main St, City Center',
            lat: -37.79389,
            lng: 144.95962,
            hours: 'Monday to Friday 9:00-17:00'
          },
          {
            name: 'North District Electronic Waste Recycling Point',
            address: '456 North Ave, North District',
            lat: -37.803905,
            lng: 144.963634,
            hours: 'Tuesday, Thursday 10:00-16:00'
          },
          {
            name: 'West District Recycling Center',
            address: '789 West Rd, West Area',
            lat: -37.801922,
            lng: 144.957325,
            hours: 'Wednesday, Saturday 9:00-15:00'
          }
        ]
      };
    },
    created() {
      // 获取用户位置 (需要用户授权)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.center = [position.coords.latitude, position.coords.longitude];
          },
          error => {
            console.error('Error getting location:', error);
          }
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .map-view {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .map-container {
    margin: 1rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 500px;  /* 固定高度 */
    width: 100%;
    position: relative;
    overflow: hidden;  /* 防止内容溢出影响布局 */
    z-index: 0;  /* 确保地图层叠顺序正确 */
  }
    </style>
  