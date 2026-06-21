# 🐧 开箱 Linux

**一键装软件，Linux 就该这么简单。**

开箱 Linux 是一个开源的 Web 工具，让你在刚装好的 Linux 系统上快速安装常用软件。选好软件，复制命令，粘贴执行——搞定。

> 本项目源自 [abusoww/tuxmate](https://github.com/abusoww/tuxmate) 的中文增强版。遵循 GPL-3.0 许可证。

---

## ✨ 特色

- 🀄 **完整中文界面** — 从分类到一键初始化，全中文
- 🇨🇳 **53 款中国软件** — 微信、QQ、钉钉、飞书、WPS、百度网盘、搜狗输入法等
- 🔄 **7 大国内镜像源** — 清华/阿里云/中科大/上海交大/华为云/网易/官方
- 🐧 **国产发行版** — 支持 Deepin、UOS 统信
- 🎯 **墙内友好** — 砍掉被墙软件，只留能用的
- 📦 **179 款应用**（中国 53 / 国际 126），跨 9 大包管理器 + AUR 支持
- 🚀 **一键初始化** — 换国内源 + 中文输入法 + pip/npm/go/docker 镜像
- 🔒 **安全优先** — 只生成命令，用户审查后再执行
- ⌨️ **键盘快捷键** — 不服鼠标

---

## 🚀 在线使用

**https://pzmmy.github.io/kaixiang-linux/**

点击即用，无需安装。

---

## 🖥️ 界面预览

```
┌────────────────────────────────────────────────────────────┐
│  🐧 开箱 Linux    [帮助] [🌟] [清华镜像源 ▾] [Ubuntu ▾]   │
│  一键装软件，Linux 就该这么简单。                            │
├────────────────────────────────────────────────────────────┤
│  🧩 一键选: [办公必备] [私发环境] [社交娱乐] [日常推荐]     │
│           [游戏玩家] [🚀 一键初始化] [🐳 Docker]            │
├──────┬──────────────┬──────────────┬──────────────────────┤
│ 网页  │ 通讯工具     │ 影音媒体     │ 办公软件             │
│ 浏览  │              │              │                      │
│ 器    │ ☑️ 微信      │ ☐ VLC       │ ☑️ WPS Office       │
│ ☐ Firefox│ ☐ QQ     │ ☐ mpv       │ ☐ LibreOffice       │
│ ☑️ Chrome│ ☑️ 钉钉   │ ☐ 网易云    │ ☐ 福昕PDF           │
│ ☐ Edge  │ ☐ 飞书    │ ☐ 哔哩哔哩  │ ☑️ XMind            │
│ ...    │ ...        │ ...          │ ...                 │
└──────┴──────────────┴──────────────┴──────────────────────┘
                          │
              ┌───────────┴───────────┐
              │ [5] sudo apt install  │
              │ -y wps-office wechat  │
              │ chrome ...   [复制] [下载]│
              └───────────────────────┘
```

---

## 🛠️ 本地开发

```bash
# 国内用户先设镜像源（重要）
npm config set registry https://registry.npmmirror.com

# 安装依赖
npm install

# 复制环境变量模板（可选，部分功能需要）
cp .env.example .env.local

# 启动开发服务器
npm run dev
# 打开 http://localhost:3000
```

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | 代码风格检查 |
| `npm test` | 运行测试套件（122+ 条用例） |
| `npm run test:watch` | 监听模式运行测试 |

### Docker

```bash
docker build -t kaixiang-linux .
docker run -p 3000:3000 kaixiang-linux
```

---

## 🌐 部署

项目已配置 GitHub Actions CI，推送 `main` 分支自动构建并部署到 GitHub Pages。

### 手动部署

```bash
npm install && npm run build
npx gh-pages -d out --dotfiles --no-history
```

### 其他平台

支持 Vercel / Cloudflare Pages 一键部署。

---

## ⚠️ 踩坑记录

### 1. fetch-verified-flatpaks.mjs 超时
GitHub Actions 中如果 Flathub 超时，prebuild 步骤会用本地缓存数据，不影响构建。

### 2. GitHub Pages 子路径 404
确保 `.nojekyll` 文件存在于 `out/` 根目录（postbuild 脚本自动生成）。

### 3. 静态资源 404
如果部署到子路径（如 `/kaixiang-linux/`），manifest.json、apple-touch-icon、SW 等路径需要手动加 basePath 前缀。代码已通过 `generateMetadata()` 自动处理。

### 4. 本地开发路径与生产不一致
开发时 basePath 为空，生产部署为 `/kaixiang-linux`。通过 `next.config.ts` 中 `env.NEXT_PUBLIC_BASE_PATH` 统一控制。

---

## 🗺️ 路线图

- [x] 中文界面
- [x] 砍掉被墙软件
- [x] 53 款中国软件
- [x] 7 大国内镜像源
- [x] Deepin / UOS 统信支持
- [x] Flatpak 国内镜像（清华/中科大/上交自动切换）
- [x] 一键初始化（换源 + 字体 + 输入法 + pip/npm/go/docker）
- [x] Docker CE 安装选项
- [x] Arch Linux CN 仓库
- [x] 搜索关键词高亮
- [x] 122 条测试用例，100% 覆盖
- [x] CI 自动构建部署
- [ ] 语言切换（中/英）

---

## 📜 许可证

GNU General Public License v3.0 — 详见 [LICENSE](./LICENSE)

## 🙏 致谢

- [abusoww/tuxmate](https://github.com/abusoww/tuxmate) — 原版项目
