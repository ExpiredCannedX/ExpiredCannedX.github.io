// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import SiteStats from './components/SiteStats.vue'
import PageView from './components/PageView.vue'
import { triggerBusuanzi } from './composables/useBusuanzi'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 首页 features 下方：站点级总访客 UV / 总访问量 PV
      'home-features-after': () => h(SiteStats),
      // 文章正文底部：本文阅读量（组件内部按路径判断是否渲染）
      'doc-after': () => h(PageView),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // SPA 路由切换后重新触发不蒜子统计，刷新当前页 page_pv
    // onAfterRouteChange 为 VitePress 1.x 推荐钩子（onAfterRouteChanged 已废弃）
    if (typeof window !== 'undefined') {
      router.onAfterRouteChange = () => {
        triggerBusuanzi()
      }
    }
  }
} satisfies Theme
