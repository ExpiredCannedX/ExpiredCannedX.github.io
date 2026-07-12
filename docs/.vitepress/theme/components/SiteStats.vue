<script setup lang="ts">
/**
 * 站点级访客统计组件（首页 features 下方）
 *
 * 沿用不蒜子 span id 约定，脚本加载后会自动把数字写入 id="busuanzi_value_*" 的 span：
 * - busuanzi_container_site_uv / busuanzi_value_site_uv：总访客 UV
 * - busuanzi_container_site_pv / busuanzi_value_site_pv：总访问量 PV
 *
 * 容器默认 display:none（由不蒜子脚本注入控制），脚本加载成功后自动置为可见，
 * 数字加载前不会出现「0」或空白闪烁。
 */
</script>

<template>
  <div class="site-stats">
    <div class="site-stats-item">
      <span class="site-stats-label">总访客</span>
      <span id="busuanzi_container_site_uv" class="site-stats-value">
        <span id="busuanzi_value_site_uv"></span>
      </span>
      <span class="site-stats-unit">UV</span>
    </div>
    <div class="site-stats-divider"></div>
    <div class="site-stats-item">
      <span class="site-stats-label">总访问量</span>
      <span id="busuanzi_container_site_pv" class="site-stats-value">
        <span id="busuanzi_value_site_pv"></span>
      </span>
      <span class="site-stats-unit">PV</span>
    </div>
  </div>
</template>
