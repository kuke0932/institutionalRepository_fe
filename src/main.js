import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import iview from 'iview'
import iviewArea from 'iview-area'
import 'iview/dist/styles/iview.css'
import cascaderMulti from 'cascader-multi'
import custom_form from './components/Form/custom_form'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data
import i18n from './lang' // Internationalization
import store from './store'

import axios from 'axios'
Vue.prototype.$http = axios

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.prototype.generatePathQuery = function(routeQuery) {
  let query = ''
  if (routeQuery) {
    for (const key in routeQuery) {
      query += key + '=' + routeQuery[key]
    }
  }
  if (query) {
    return '?' + query
  } else {
    return query
  }
}

Vue.prototype.getQuery = function(para) {
  const reg = new RegExp('(^|&)' + para + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return unescape(r[2])
  }
  return null
}

Vue.prototype.getQueryVariable = function(search, variable) {
  const query = search
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      console.log(pair[1])
      const index = pair[1].indexOf('#')
      if (index >= 0) {
        return pair[1].substring(0, index)
      } else {
        return pair[1]
      }
    }
  }
  return null
}

Vue.config.productionTip = false
Vue.use(iview)
Vue.use(iviewArea)
Vue.use(cascaderMulti)
Vue.use(custom_form)
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
