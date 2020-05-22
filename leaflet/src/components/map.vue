<template>
	<div id="map" class="map">
		
	</div>
</template>
<script>
export default {
  name:'Map',
  mounted () {
        var map = L.map('map', {
            center: [22.6462504963, 109.5556643139],
            zoom: 10,
            minZoom:3,
            mapType: 'map',
            mapCoordinatesControl: true,
            mapChangeControl: true,
            zoomControl: false
        });
        L.tileLayer("http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}").addTo(map);
        map.attributionControl.setPrefix('随风大侠');
        map.attributionControl.setPosition('bottomleft'); 
        L.control.zoom({position: 'bottomright',zoomInTitle:'放大',zoomOutTitle:'缩小'}).addTo(map);
},
methods:{

}

}
</script>
<style scoped>
.map{
  width: 100%;
  height: 100%;
}
</style>