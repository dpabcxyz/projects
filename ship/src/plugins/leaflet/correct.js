import L from "leaflet"

var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

var LatLngInRegion = function(t, e) {
    if (!t || !e)
        return !1;
    for (var i = 0, n = 0, o = 0; o < e.length; o++) {
        o == e.length - 1 ? n = 0 : n += 1;
        var r = (e[n][0] - e[o][0]) * (t[1] - e[o][1]) - (t[0] - e[o][0]) * (e[n][1] - e[o][1]);
        e[o][1] <= t[1] ? e[n][1] > t[1] && r > 0 && i++ : e[n][1] <= t[1] && r < 0 && i--
    }
    return 0 != i
};
/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
var out_of_china = function out_of_china(lat, lng) {
    var lat = +lat;
    var lng = +lng;

    var CHINA_BODER = [
        [40.296287, 124.694824],
        [39.597223, 124.112549],
        [39.448919, 123.348999],
        [39.00211, 123.123779],
        [38.83115, 122.156982],
        [38.61687, 121.525269],
        [38.578232, 121.063843],
        [38.873929, 120.888062],
        [39.440435, 121.151733],
        [39.968701, 121.47583],
        [40.350731, 122.003174],
        [40.517975, 121.843872],
        [40.613952, 121.497803],
        [40.618122, 121.278076],
        [40.128491, 120.745239],
        [39.821194, 120.009155],
        [39.440435, 119.624634],
        [39.061849, 119.212646],
        [38.843986, 118.67981],
        [38.625454, 118.586426],
        [38.363195, 118.927002],
        [38.030786, 119.432373],
        [37.692514, 119.772949],
        [38.195022, 120.640869],
        [37.952861, 121.234131],
        [37.68382, 121.827393],
        [37.457418, 122.816162],
        [36.75649, 122.926025],
        [36.394757, 122.167969],
        [35.755428, 121.190186],
        [35.173808, 120.717773],
        [34.587997, 120.717773],
        [32.962586, 121.772461],
        [31.662733, 122.530518],
        [30.524413, 123.299561],
        [29.113775, 122.827148],
        [27.362011, 121.783447],
        [25.740529, 120.487061],
        [24.20689, 118.948975],
        [23.352343, 117.696533],
        [22.466878, 116.339722],
        [22.329752, 114.922485],
        [22.388174, 114.590149],
        [22.433879, 114.437714],
        [22.560757, 114.329224],
        [22.537927, 114.157562],
        [22.475761, 113.972168],
        [22.352616, 113.727722],
        [22.235718, 113.565674],
        [22.156883, 113.499756],
        [21.971066, 113.491516],
        [21.672744, 113.266296],
        [21.542511, 112.939453],
        [21.401934, 112.376404],
        [21.32264, 111.571655],
        [21.194655, 111.058044],
        [21.06656, 110.830078],
        [20.766387, 110.725708],
        [20.300842, 110.706482],
        [20.014645, 111.236572],
        [19.761534, 111.272278],
        [18.966039, 110.717468],
        [18.529096, 110.478516],
        [18.218916, 109.984131],
        [18.036198, 109.443054],
        [18.432713, 108.555908],
        [19.112732, 108.535309],
        [19.650348, 108.671265],
        [20.396123, 109.476013],
        [20.750977, 109.517212],
        [20.889608, 109.050293],
        [21.263781, 108.797607],
        [21.575719, 107.995605],
        [22.87744, 106.435547],
        [22.268764, 103.754883],
        [21.248422, 101.030273],
        [24.006326, 98.701172],
        [24.846565, 97.514648],
        [27.644606, 98.041992],
        [28.304381, 95.756836],
        [27.44979, 92.06543],
        [27.76133, 88.461914],
        [29.878755, 81.386719],
        [32.435613, 78.398438],
        [35.424868, 77.651367],
        [38.410558, 74.179688],
        [40.5472, 76.552734],
        [42.455888, 80.288086],
        [43.739352, 80.463867],
        [44.964798, 80.15625],
        [45.336702, 82.177734],
        [46.890232, 83.012695],
        [47.040182, 85.297852],
        [48.224673, 85.649414],
        [49.095452, 86.923828],
        [48.429201, 88.505859],
        [47.487513, 90.527344],
        [46.012224, 91.010742],
        [45.213004, 91.142578],
        [44.527843, 94.350586],
        [44.056012, 95.229492],
        [42.843751, 96.459961],
        [42.682435, 100.986328],
        [41.967659, 104.018555],
        [42.455888, 107.446289],
        [43.675818, 112.016602],
        [44.746733, 111.533203],
        [45.089036, 114.169922],
        [46.528635, 117.597656],
        [46.679594, 119.135742],
        [46.875213, 119.816895],
        [47.724545, 118.959961],
        [47.945786, 117.685547],
        [47.768868, 116.323242],
        [48.297812, 115.72998],
        [49.738682, 116.696777],
        [49.59647, 117.883301],
        [50.722547, 119.575195],
        [51.98488, 120.60791],
        [52.629729, 120.212402],
        [53.409532, 122.563477],
        [53.120405, 125.046387],
        [51.330612, 127.001953],
        [49.61071, 127.924805],
        [48.936935, 130.319824],
        [47.680183, 131.374512],
        [48.122101, 133.110352],
        [48.297812, 134.692383],
        [47.487513, 134.67041],
        [46.255847, 134.121094],
        [44.949249, 133.066406],
        [45.166547, 131.506348],
        [43.818675, 131.11084],
        [42.892064, 131.000977],
        [42.358544, 130.473633],
        [42.569264, 129.616699],
        [41.983994, 128.759766],
        [41.557922, 128.012695],
        [41.672912, 126.958008],
        [40.813809, 126.057129],
        [40.296287, 124.694824]
    ]
    return !LatLngInRegion([lat, lng], CHINA_BODER);
};


/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
var bd09togcj02 = function bd09togcj02(bd_lat, bd_lon) {
    var bd_lon = +bd_lon;
    var bd_lat = +bd_lat;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return L.latLng(gg_lat, gg_lng)
};

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
var gcj02tobd09 = function gcj02tobd09(lat, lng) {
    var lat = +lat;
    var lng = +lng;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return L.latLng(bd_lat, bd_lng)
};

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
var wgs84togcj02 = function wgs84togcj02(lat, lng) {
    var lat = +lat;
    var lng = +lng;
    var outOfChian = out_of_china(lat, lng)
    if (outOfChian) {
        return L.latLng(lat, lng)
    } else {
        var dlat = transformlat(lat - 35.0, lng - 105.0);
        var dlng = transformlng(lat - 35.0, lng - 105.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return L.latLng(mglat, mglng)
    }
};

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
var gcj02towgs84 = function gcj02towgs84(lat, lng) {
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lat, lng)) {
        return L.latLng(lat, lng)
    } else {
        var dlat = transformlat(lat - 35.0, lng - 105.0);
        var dlng = transformlng(lat - 35.0, lng - 105.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return L.latLng(lat * 2 - mglat, lng * 2 - mglng)
    }
};

var transformlat = function transformlat(lat, lng) {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
};

var transformlng = function transformlng(lat, lng) {
    var lat = +lat;
    var lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
};

export {
    bd09togcj02,
    gcj02tobd09,
    wgs84togcj02,
    gcj02towgs84
}