import { constantRouterMap } from '@/router'
import { generateRoutes } from '@/api/login'
import Layout from '../../views/layout/Layout'
import { setPathCache } from '@/utils/pathCache'

const _import = require('../../router/_import_' + process.env.NODE_ENV)

function buildRoute(routes, route, index, level) {
  if (route.meta.functionType === 2) {
    routes.splice(index, 1)
  }
  if (route.component && route.meta.functionType === 1) {
    const split = route.component.split('?')
    if (route.component.indexOf('?') > 0) {
      setPathCache('/' + route.component, route.name)
    }
    route.component = _import(split[0])
    route.path = split[0]
    const params = split[1] && split[1].split('&') || []
    for (const param of params) {
      const s = param.split('=')
      const ss = Object()
      ss[s[0]] = s[1]
      if (route.meta.query) {
        Object.assign(route.meta.query, ss)
      } else {
        route.meta.query = ss
      }
    }
  } else {
    if (level >= 1) {
      // 如果是三级路由或者更多，嵌套路由，需要添加 router-view来接收
      route.component = _import('nest/index')
    } else {
      // route.name = ''
      route.component = Layout
    }
  }
  let len = route.children.length
  level++
  while (len--) {
    buildRoute(route.children, route.children[len], len, level)
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        generateRoutes().then(resp => {
          const data = resp.data
          window.sessionStorage.setItem('x-auth-router', JSON.stringify(data.data))
          const routeM = data.data
          let len = routeM.length
          const level = 0
          while (len--) {
            buildRoute(routeM, routeM[len], len, level)
          }
          commit('SET_ROUTERS', routeM)
          resolve()
        })
      })
    }
  }
}

export default permission
