# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 [VitePress](https://vitepress.dev/zh/) 搭建的个人技术博客（秦晖洋），部署于 GitHub Pages（`ExpiredCannedX.github.io`）。站点语言为 `zh-CN`。

## 常用命令

```bash
pnpm install          # 安装依赖（必须使用 pnpm，版本 ^11.7.0）
pnpm docs:dev         # 开发模式启动本地服务器（支持热更新）
pnpm docs:build       # 构建生产产物到 docs/.vitepress/dist
pnpm docs:preview     # 本地预览构建产物
```

无测试套件、无 lint 脚本。验证变更的方式：本地运行 `pnpm docs:dev` 或 `pnpm docs:build` 后 `pnpm docs:preview`。

## 架构

### 内容与配置分离

- `docs/` 为内容根目录，其中 `.vitepress/` 存放配置与主题，其余子目录按年份存放博文。
- `docs/index.md` — 首页（使用 VitePress `home` layout + frontmatter 配置 hero/features）。
- `docs/{year}/` — 按年份分目录组织文章（当前仅有 `2026/`）。新增文章时需在 `docs/.vitepress/config.ts` 的 `sidebar` 中登记，并在必要时更新 `nav`。
- Markdown 文件可通过 frontmatter 控制行为（如 `outline: deep`、`layout: home`）。

### VitePress 配置（`docs/.vitepress/config.ts`）

集中管理站点元信息、顶部导航（`nav`）、侧边栏（`sidebar`）、本地搜索、社交链接、大纲级别等。配置文件内含较完整的中文注释，修改前应先阅读以理解各字段含义。

### 主题自定义（`docs/.vitepress/theme/`）

- `index.ts` — 继承默认主题，通过 `Layout` 插槽扩展页面结构。
- `style.css` — 通过覆盖 VitePress CSS 变量（`--vp-c-*`、`--vp-button-*`、`--vp-home-hero-*` 等）实现主题配色，不修改组件结构。

### 部署（`.github/workflows/deploy.yml`）

- 触发条件：推送至 `master` 分支，或手动 `workflow_dispatch`。
- 运行环境：Ubuntu + Node 22 + pnpm 11。
- 流程：`pnpm install` → `pnpm run docs:build` → 上传 `docs/.vitepress/dist` 至 GitHub Pages。
- 本地构建产物目录与 CI 一致，均为 `docs/.vitepress/dist`（已加入 `.gitignore`）。

## 约定

- **包管理器固定为 pnpm**：`package.json` 通过 `devEngines.packageManager` 锁定 pnpm ^11.7.0；CI 也使用 pnpm 11。请勿改用 npm/yarn，避免 lockfile 冲突。
- **注释语言**：现有配置与文档注释均为简体中文，新增注释请保持一致。
- **文章发布流程**：在 `docs/{year}/` 新增 `.md` → 在 `config.ts` 的 `sidebar` 中登记 → 推送至 `master` 触发自动部署。
- **构建产物与缓存**：`docs/.vitepress/dist` 和 `docs/.vitepress/cache` 已被 `.gitignore` 忽略，无需手动清理。
- **`.claude` 目录**已被 `.gitignore` 忽略。
