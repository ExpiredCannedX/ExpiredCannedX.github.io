<script setup lang="ts">
/**
 * 单页阅读量组件（文章正文底部，doc-after 插槽）
 *
 * 渲染「本文阅读量：N」，其中数字由不蒜子脚本写入 id="busuanzi_value_page_pv" 的 span。
 *
 * doc-after 插槽在首页 home layout 等非文章页面也会触发，因此需判断当前页面
 * 是否为文章页：路径以年份前缀开头（如 /2026/...，未来年份自动匹配）且非 404。
 * 该判断与 docs/{year}/ 目录结构强一致，新增文章无需额外打标记。
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
  <div v-if="isArticle" class="page-view">
    <span class="page-view-icon">📖</span>
    <span class="page-view-label">本文阅读量：</span>
    <span id="busuanzi_container_page_pv" class="page-view-value">
      <span id="busuanzi_value_page_pv"></span>
    </span>
  </div>
</template>
