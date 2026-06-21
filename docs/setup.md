# 开发环境搭建指南

> 本文档帮助你在本地搭建开箱 Linux 的开发环境。

---

## 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| **Node.js** | v20+ | 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 安装 |
| **npm** | v10+ | 随 Node.js 一起安装 |
| **Git** | — | 克隆代码仓库 |

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/pzmmy/kaixiang-linux.git
cd kaixiang-linux
```

### 2. 国内用户设置 npm 镜像（重要）

```bash
npm config set registry https://registry.npmmirror.com
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量（可选）

```bash
cp .env.example .env.local
```

`env.local` 支持以下变量：

| 变量 | 用途 | 是否必需 |
|------|------|---------|
| `NEXT_PUBLIC_BASE_PATH` | GitHub Pages 子路径（如 `/kaixiang-linux`） | 部署时必需 |
| `NEXT_PUBLIC_UMAMI_ID` | Umami 网站分析 ID | 可选 |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics Token | 可选 |

### 5. 启动开发服务器

```bash
npm run dev
```

浏览器打开 `http://localhost:3000` 即可看到效果。

---

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Next.js 开发服务器（热重载） |
| `npm run build` | 构建静态站点到 `out/` 目录 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 代码风格检查 |
| `npm test` | 运行 Vitest 测试套件（122+ 条用例） |
| `npm run test:watch` | 监听模式下运行测试 |

### 预构建脚本

`npm run dev` 和 `npm run build` 会自动触发：

```bash
node scripts/fetch-verified-flatpaks.mjs   # 从 Flathub 获取已验证应用列表
node scripts/validate-apps.mjs             # 验证所有应用数据完整性
```

如果 Flathub 网络超时，`|| true` 确保不会阻塞构建。

---

## 项目管理

### 脚本目录

| 路径 | 说明 |
|------|------|
| `src/lib/apps/*.json` | 应用注册表（按分类拆分） |
| `src/lib/scripts/*.ts` | 各发行版脚本生成器 |
| `src/lib/data.ts` | 核心数据（发行版、分类、镜像源） |
| `src/components/` | React 组件 |
| `src/hooks/` | 自定义 Hooks |
| `scripts/` | 构建/验证工具脚本 |

### 应用数据结构

每个应用在 `src/lib/apps/*.json` 中用 JSON 定义：

```json
{
  "id": "firefox",
  "name": "Firefox",
  "description": "开源网页浏览器",
  "category": "Web Browsers",
  "icon": {
    "type": "iconify",
    "set": "simple-icons",
    "name": "firefox",
    "color": "#FF7139"
  },
  "targets": {
    "ubuntu": "firefox",
    "arch": "firefox",
    "flatpak": "org.mozilla.firefox",
    "snap": "firefox"
  }
}
```

详见 `CONTRIBUTING.md` 的「添加应用」章节。

---

## 常见问题

### 1. `npm install` 卡住

尝试清除 npm 缓存：

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. `npm run dev` 端口被占用

Next.js 默认端口 3000，可通过环境变量修改：

```bash
npx next dev -p 3001
```

### 3. Flathub 网络超时

项目内置本地缓存数据，超时不影响构建。如需强制更新：

```bash
node scripts/fetch-verified-flatpaks.mjs
```

### 4. 子路径部署资源 404

确保 `.nojekyll` 文件存在于 `out/` 根目录（postbuild 脚本会自动生成）。`next.config.ts` 中的 `NEXT_PUBLIC_BASE_PATH` 需与部署路径一致。

---
