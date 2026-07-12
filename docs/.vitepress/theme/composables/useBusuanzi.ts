/**
 * 不蒜子（Busuanzi）访客统计的组合式工具
 *
 * 背景：VitePress 是 SPA，路由切换时页面不刷新，不蒜子脚本只在首屏执行一次，
 *      导致切换文章后 page_pv 不会更新为当前文章的阅读量。
 *
 * 方案：通过「移除旧 script 标签 + 重新插入新 script 标签」强制浏览器重新
 *      下载并执行该脚本，从而刷新当前页的统计数据。
 */

/** 不蒜子脚本地址（与 config.ts 的 head 注入保持一致） */
const BUSUANZI_SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.min.js'

/**
 * 重新触发不蒜子统计：
 * 先移除页面中已存在的不蒜子 script 节点（避免重复堆积），再插入一个全新的
 * script 节点让浏览器重新执行，从而刷新当前页 page_pv。
 */
export function triggerBusuanzi(): void {
  // SSR 守卫，防止 docs:build 阶段报 document is not defined
  if (typeof document === 'undefined') return

  // 1. 移除旧的不蒜子 script 节点，避免 <head> 中标签累积
  document.querySelectorAll('script[src*="busuanzi"]').forEach((el) => el.remove())

  // 2. 插入新 script，async 重新加载执行
  const s = document.createElement('script')
  s.async = true
  s.src = BUSUANZI_SRC
  document.head.appendChild(s)
}
