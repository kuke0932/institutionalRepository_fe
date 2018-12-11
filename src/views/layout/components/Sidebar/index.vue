<template>
  <scroll-bar>
    <el-menu mode="vertical" :default-active="$route.path+generatePathQuery($route.query)" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import _ from 'lodash'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      routes: []
    }
  },
  mounted() {
    const _routes = _.cloneDeep(this.permission_routers)
    this.routes = _routes.map(r => this._subFilter(r))
  },
  methods: {
    _subFilter(route) {
      if (route.children && route.children.length > 0) {
        route.children = (route.children.map(r => this._subFilter(r)) || []).filter(r => !!r)
        return route
      } else {
        if (route.meta && route.meta.functionType === 1 && route.hidden) {
          return undefined
        } else {
          return route
        }
      }
    }
  }
}
</script>
