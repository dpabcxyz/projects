import Vue from 'vue'

Vue.directive('drag', function (el) {
    el.onmousedown = function (e) {
        var disx = e.clientX - el.offsetLeft
        var disy = e.clientY - el.offsetTop
        document.onmousemove = function (e) {
            el.style.left = e.clientX - disx + 'px'
            el.style.top = e.clientY - disy + 'px'
        }
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null
        }
    }
})
