<script setup lang="ts">
/**
 * 单页阅读量组件（文章正文底部，doc-after 插槽）
 *
 * 渲染「本文阅读量：N」，其中数字由不蒜子脚本写入 id="busuanzi_value_page_pv" 的 span。
 *
 * doc-after 插槽在首页 home layout 等非文章页面也会触发，因此需判断当前页面
 * 是否为文章页：路径以年份前缀开头（如 /2026/...，未来年份自动匹配）且非 404。
 * 该判断与 docs/{year}/ 目录结构强一致，新增文章无需额外打标记。
 *
 * 无障碍设计：
 * - role="text" + 顶层 aria-label 提供可读句式上下文（label 与 value 视觉分离，
 *   屏幕阅读器需要一条完整句子）
 * - 数值容器 aria-live="polite"：不蒜子脚本异步写入后播报新值
 * - 数值未就绪时最内层 span 显示占位符「--」，消除布局抖动（CLS）
 * - 图标使用内联 SVG（currentColor 继承文字色），避免 emoji 跨平台渲染不一致
 *   且无法被设计 token 控制的问题
 */
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { page } = useData()

// 文章页判断：路径匹配 ^/\d{4}/ 且非 404 页
const isArticle = computed(
  () => /^\/\d{4}\//.test(route.path) && !page.value.isNotFound
)
</script>

<template>
  <div
    v-if="isArticle"
    class="page-view"
    role="text"
    aria-label="本文阅读量统计"
  >
    <!-- 眼睛图标：内联 SVG，stroke 继承 currentColor，暗色模式自动适配 -->
    <svg
      class="page-view-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
    <span class="page-view-label">本文阅读量：</span>
    <span
      id="busuanzi_container_page_pv"
      class="page-view-value"
      aria-live="polite"
      aria-atomic="true"
    >
      <!-- 占位符 --：脚本未就绪时显示，加载成功后被覆盖 -->
      <span id="busuanzi_value_page_pv">--</span>
    </span>
  </div>
</template>