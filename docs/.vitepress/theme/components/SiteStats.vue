<script setup lang="ts">
/**
 * 站点级访客统计组件（首页 features 下方）
 *
 * 沿用不蒜子 span id 约定，脚本加载后会自动把数字写入 id="busuanzi_value_*" 的 span：
 * - busuanzi_container_site_uv / busuanzi_value_site_uv：总访客 UV
 * - busuanzi_container_site_pv / busuanzi_value_site_pv：总访问量 PV
 *
 * 无障碍设计：
 * - 顶层 aria-label 提供可读上下文（视觉 label/value 分离，屏幕阅读器需完整句式）
 * - 数值容器 aria-live="polite"：不蒜子脚本异步写入后播报新值
 * - 数值未就绪时最内层 span 显示占位符「--」，消除布局抖动（CLS）
 */
</script>

<template>
  <div class="site-stats" aria-label="站点访客统计">
    <div class="site-stats-item">
      <span class="site-stats-label">总访客</span>
      <span
        id="busuanzi_container_site_uv"
        class="site-stats-value"
        aria-live="polite"
        aria-atomic="true"
      >
        <!-- 占位符 --：脚本未就绪时显示，加载成功后被覆盖 -->
        <span id="busuanzi_value_site_uv">--</span>
      </span>
      <span class="site-stats-unit">UV</span>
    </div>
    <div class="site-stats-divider" aria-hidden="true"></div>
    <div class="site-stats-item">
      <span class="site-stats-label">总访问量</span>
      <span
        id="busuanzi_container_site_pv"
        class="site-stats-value"
        aria-live="polite"
        aria-atomic="true"
      >
        <span id="busuanzi_value_site_pv">--</span>
      </span>
      <span class="site-stats-unit">PV</span>
    </div>
  </div>
</template>