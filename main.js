import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// Vue.prototype.$getURLParams = function() {
//     let local = location.href;
//     var theRequest = new Object();
//     if (local.indexOf("?") != -1) {
//     var str = local.substr(1);
//     var strs = str.split("&");
//     for (var i = 0; i < strs.length; i++) {
//         theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
//         }
//     }
//     console.log(theRequest)
//     // return theRequest
// }
const app = new Vue({
    ...App
})
app.$mount()
