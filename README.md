# 🐧 开箱 Linux

**一键装软件，Linux 就该这么简单。**

开箱 Linux 是一个开源的 Web 工具，让你在刚装好的 Linux 系统上快速安装常用软件。选好软件，复制命令，粘贴执行——搞定。

> 本项目源自 [abusoww/tuxmate](https://github.com/abusoww/tuxmate) 的中文增强版。遵循 GPL-3.0 许可证。

---

## ✨ 特色

- 🀄 **完整中文界面** — 从分类到帮助，全中文
- 🇨🇳 **中国软件支持** — 微信、QQ、钉钉、飞书、WPS、百度网盘等 11 款
- 🔄 **国内镜像源** — 清华/阿里云/中科大一键切换
- 🐧 **国产发行版** — 支持 Deepin、UOS 统信
- 🎯 **墙内友好** — 砍掉被墙软件，只留能用的
- 📦 **180+ 应用**，跨 9 大包管理器（apt/pacman/dnf/Flatpak/Snap 等）
- 🔒 **安全优先** — 只生成命令，用户审查后再执行
- ⌨️ **键盘快捷键** — 选软件不用鼠标

---

## 🚀 在线使用

**https://kaixiang-linux.vercel.app**（部署后会更新）

---

## 🖥️ 本地运行

```bash
# 国内用户先设镜像源（重要）
npm config set registry https://registry.npmmirror.com

npm install
npm run dev
# 打开 http://localhost:3000
```

### Docker

```bash
docker build -t kaixiang-linux .
docker run -p 3000:3000 kaixiang-linux
```

---

## 🌐 部署

### GitHub Pages（推荐，免费）

项目已配置 `output: 'export'`，构建后直接部署：

```bash
# 1. 国内用户先设镜像
npm config set registry https://registry.npmmirror.com

# 2. 构建
npm install && npm run build

# 3. 推送到 gh-pages 分支
npx gh-pages -d out -b gh-pages

# 4. 在仓库 Settings > Pages 中
#    - Source 选 "Deploy from a branch"
#    - Branch 选 gh-pages
#    - 等待 1-2 分钟，访问 https://pzmmy.github.io/kaixiang-linux/
```

### Vercel（一键部署）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pzmmy/kaixiang-linux)

### Cloudflare Pages

```bash
npm install && npm run build
npx wrangler pages deploy out/
```

---

## ⚠️ 踩坑记录

### 1. 国内 npm install 慢 / 超时
```bash
# 必须换国内镜像源
npm config set registry https://registry.npmmirror.com
```

### 2. Next.js 构建时文件覆盖报错
如果从原版 tuxmate fork 后在 WSL 构建，可能出现工作目录文件冲突：
```bash
# 切到 main 分支前清理工作区
git stash
git checkout main
```

### 3. 静态导出配置
如果自己从头配 Next.js 静态导出，确保 `next.config.ts` 中有：
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
```

### 4. GitHub Pages 部署后 404
确保 `gh-pages` 分支根目录包含 `index.html`，且仓库 Settings > Pages 中 Branch 正确指向 `gh-pages`（不是 main）。

---

## 🗺️ 路线图

- [x] 中文界面
- [x] 砍掉被墙软件
- [x] 中国软件库（微信 / QQ / 钉钉 / 飞书 / WPS / 百度网盘 / 搜狗输入法等 11 款）
- [x] 国内镜像源切换（清华 / 阿里云 / 中科大）
- [x] Deepin / UOS 统信发行版支持
- [ ] Flathub 镜像加速

---

## 📜 许可证

GNU General Public License v3.0 — 详见 [LICENSE](./LICENSE)

## 🙏 致谢

- [abusoww/tuxmate](https://github.com/abusoww/tuxmate) — 原版项目
