# 秦晖洋的个人博客

基于 [VitePress](https://vitepress.dev/zh/) 搭建的个人博客。

## 工程结构

```
personalspace
├─ .github              # GitHub 配置
│  └─ workflows         # 自动构建部署配置
├─ docs                 # 博客内容
│   ├─ .vitepress
│   │  ├─ config.ts     # VitePress 配置
│   │  ├─ cache         # 缓存文件，可忽略提交
│   │  ├─ dist          # 构建产物
│   │  └─ theme         # 样式和主题
│   ├─ index.md         # 博客首页
│   ├─ 2026             # 按年份存放博文
│   └─ public           # 静态资源（图片等）
├─ .gitignore           # Git 提交忽略配置
├─ package.json         # Node.js 配置
├─ pnpm-lock.yaml       # 依赖锁定版本号
├─ pnpm-workspace.yaml  # pnpm 工作空间配置
└─ README.md            # 工程说明
```

## 工程开发

```bash
# 安装依赖
pnpm install

# 开发模式启动
pnpm docs:dev

# 手动构建
pnpm docs:build

# 预览构建成果
pnpm docs:preview
```
