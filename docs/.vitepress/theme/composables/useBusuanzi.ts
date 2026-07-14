/**
 * 不蒜子（Busuanzi）访客统计的组合式工具
 *
 * ========== 背景与根因 ==========
 * VitePress 是 SPA，路由切换不刷新页面，不蒜子官方脚本只在首屏执行一次。
 * 更深层的问题在于：不蒜子后端仅凭 HTTP Referer 区分页面（忽略一切 URL 参数），
 * 而 GitHub Pages 默认不带 Referrer-Policy 响应头，浏览器对跨源请求（不蒜子位于
 * busuanzi.ibruce.info）只发送 origin、不含 path —— 后端永远拿不到页面路径，
 * 导致所有文章共用同一个 page_pv 计数器。
 *
 * 根因已在 config.ts 通过 <meta name="referrer" content="no-referrer-when-downgrade">
 * 修复（强制跨源请求携带完整 URL）。本文件解决的是另一层问题：SPA 路由切换时，
 * 如何在不刷新页面的前提下重新拉取当前文章的统计数据。
 *
 * ========== 方案 ==========
 * 早期实现采用「移除旧 <script> + 重新插入新 <script>」强制重载官方脚本。
 * 但官方脚本每次执行会重新声明 bszTag/bszCaller 等顶层闭包变量并立即 fetch，
 * 重载时新旧请求的 JSONP 回调存在竞态：旧回调可能晚于新回调到达，用旧页面数据
 * 覆盖新值。且首屏 config.ts head 注入的脚本与 triggerBusuanzi 重载的脚本会
 * 双重触发统计。
 *
 * 现改为自维护 JSONP：每次 SPA 切换时用唯一回调名发起一次请求，直接把返回的
 * site_uv / page_pv / site_pv 写入对应 span。不再重载官方脚本，无竞态、无重复触发。
 * 首屏仍由 config.ts head 注入的官方脚本完成首次统计，本工具仅在路由切换时增量刷新。
 */

/** 不蒜子后端 JSONP 端点（与官方脚本 fetch 地址一致） */
const BUSUANZI_API = 'https://busuanzi.ibruce.info/busuanzi'

/** 递增的回调序号，保证每次请求回调名唯一，避免覆盖未完成的旧回调 */
let callbackSeq = 0

/**
 * 将不蒜子返回的数据写入页面中对应的 span：
 * - busuanzi_value_site_uv / busuanzi_value_site_pv：站点总量（首页 SiteStats 组件）
 * - busuanzi_value_page_pv：单篇阅读量（文章页 PageView 组件）
 * 同时把 busuanzi_container_* 从隐藏态切回显示态（与官方脚本 shows 行为一致）。
 */
function applyStats(data: { site_uv?: string; page_pv?: string; site_pv?: string }): void {
  const entries: Array<[string, string | undefined]> = [
    ['site_uv', data.site_uv],
    ['page_pv', data.page_pv],
    ['site_pv', data.site_pv],
  ]
  for (const [key, value] of entries) {
    const valueEl = document.getElementById(`busuanzi_value_${key}`)
    if (valueEl && value !== undefined) valueEl.innerHTML = value
    const containerEl = document.getElementById(`busuanzi_container_${key}`)
    if (containerEl) containerEl.style.display = 'inline'
  }
}

/**
 * 重新触发不蒜子统计：自建 JSONP 请求当前页的 UV/PV/page_pv。
 *
 * 用唯一回调名挂到 window，请求返回后立即自清理（删除 script 节点与回调），
 * 杜绝旧回调残留导致的竞态。SSR 阶段直接跳过。
 */
export function triggerBusuanzi(): void {
  // SSR 守卫，防止 docs:build 阶段报 document/window is not defined
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  // 唯一回调名：序号 + 随机数，确保不与任何在途请求冲突
  const callbackName = `__bsz_cb_${callbackSeq++}_${Math.floor(Math.random() * 1e9)}`

  // 临时挂到 window 供 JSONP 响应调用，响应到达后立即自清理
  ;(window as unknown as Record<string, unknown>)[callbackName] = (data: {
    site_uv?: string
    page_pv?: string
    site_pv?: string
  }) => {
    applyStats(data)
    delete (window as unknown as Record<string, unknown>)[callbackName]
    scriptEl.remove()
  }

  const scriptEl = document.createElement('script')
  scriptEl.async = true
  scriptEl.src = `${BUSUANZI_API}?jsonpCallback=${callbackName}`
  document.head.appendChild(scriptEl)
}
