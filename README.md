# 星辉小屋 · XingHuiSama の 宝藏之地

> 🌐 **在线预览：** https://blog-yu-jiamgy1.vercel.app
> 🚧 **自定义域名：** `idcan.top`（ICP 备案中，暂未开放）
> 📦 **仓库：** https://github.com/chenjingyu1116/blog

集成 **博客 + 工具箱 + 完整后台管理 + AI 写作助手** 的现代化个人站点。
基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 构建，部署于 Vercel。

---

## ✨ 功能一览

### 📝 博客系统

| 模块 | 路径 | 说明 |
|---|---|---|
| 首页 | `/` | 个人信息、文章/说说轮播、照片墙、工具箱入口 |
| 文章 | `/posts/[slug]` | Markdown 正文，支持 GFM、KaTeX、代码高亮 |
| 归档 | `/timeline` | 时间线 + 标签过滤 |
| 杂谈 | `/chatter` | 日常碎片、随笔 |
| 说说 | `/moments` | 生活动态、心情记录 |
| 照片墙 | `/photowall` | 相册展示 |
| 友链 | `/friends` | 友情链接 |
| 音乐 | `/music` | 内置播放器 |
| 灵境 | `/tree` | Three.js 粒子飞船互动页 |
| 关于 | `/about` | 个人介绍 + 时间线活动 |

### 🧰 工具箱（18 个工具）

JSON / 颜色 / 时间戳 / 密码 / Base64 / 文本对比 / 二维码 / 图片压缩 / 短链 / 图床 / UUID / URL / 哈希 / 进制 / 正则 / Lorem / 房贷 / 字数统计

支持**实时搜索** + **分类过滤**。

### 🔐 后台管理系统（15 个模块）

路径：`/admin`（需登录）

| 模块 | 路径 | 功能 |
|---|---|---|
| 仪表盘 | `/admin` | 8 项数据卡片 + 快捷操作 + 最近动态 |
| 文章管理 | `/admin/posts` | CRUD + 批量 + 复制 + 导出 |
| 编辑器 | `/admin/posts/new` | Markdown + Ctrl+S + 拖拽 + **猫猫助手** |
| 说说管理 | `/admin/moments` | CRUD |
| 杂谈管理 | `/admin/chatter` | CRUD |
| 相册管理 | `/admin/albums` | 相册 + 照片管理 |
| 友链管理 | `/admin/friends` | CRUD + 主题色 |
| 工具管理 | `/admin/tools` | CRUD + 开关 + 排序 |
| 短链管理 | `/admin/shortlinks` | 点击统计 |
| 图床管理 | `/admin/uploads` | 预览 + 批量删 |
| 站点设置 | `/admin/site` | 5 Tab（基础 / 图片 / 社交 / **导航菜单** / 高级）|
| **猫猫设置** | `/admin/cat` | **说话内容 + AI 人格** |
| 访问统计 | `/admin/stats` | PV / UV / 每日趋势 / 阅读量 TOP20 |
| 数据备份 | `/admin/backup` | 一键导出 JSON |

### 🐱 猫猫写作助手（12 个功能）

在编辑器里点右下角 🐱：

| 功能 | 说明 | 需选中 |
|---|---|---|
| ✨ 续写 | 接着正文往下写 | 否 |
| 🚀 写开头 | 生成吸引人的开头 | 否 |
| 🏁 写结尾 | 生成有深度的结尾 | 否 |
| 📋 大纲 | 生成 Markdown 大纲 | 否 |
| 📖 扩写 | 扩成 2-3 倍 | 是 |
| ✂️ 缩写 | 压缩一半 | 是 |
| 📝 润色 | 更流畅书面 | 是 |
| 🔍 校对 | 改错别字标点 | 是 |
| 🏷️ 起标题 | 3 个标题 | 否 |
| 📄 写摘要 | 50-80 字摘要 | 否 |
| 🔖 标签 | 3-6 个标签 | 否 |
| 🎯 自定义 | 任意要求（"改成鲁迅风格"）| 可选 |

**AI 后端**：智谱 GLM-4-Flash（免费，国内直连）

### 🎨 主题与交互

- 白天 / 黑夜切换、樱花飘落、粒子背景
- 音乐播放器、猫猫助手、聊天组件
- 前台猫猫 AI 聊天（同一套 GLM-4-Flash）
- 全局弹幕背景

### 🛡️ 内容安全

- 草稿前台不可见、草稿 URL 404
- **中文文件名兼容**（NFC/NFD + URL 编码）
- **新文章自动英文文件名**
- JWT + bcrypt 鉴权

---

## 🛠️ 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| UI | React 19 + Tailwind CSS v4 |
| 动画 | Framer Motion |
| 3D | Three.js + @react-three/fiber |
| Markdown | gray-matter + unified + remark + rehype |
| 代码高亮 | highlight.js |
| 数学公式 | KaTeX |
| AI | 智谱 GLM-4-Flash |
| 鉴权 | jose + bcryptjs |
| 部署 | Vercel |

---

## 🚀 本地运行

### 环境要求

- Node.js **v20 或 v22 LTS**
- npm 10+

### 步骤

```bash
git clone https://github.com/chenjingyu1116/blog.git
cd blog/XHBlogs
npm install
```

### `.env.local`

```bash
JWT_SECRET=64位hex
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=\$2b\$10\$...（$ 前加反斜杠）
ZHIPU_API_KEY=你的智谱Key
```

**生成 JWT**：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**生成密码哈希**：

```bash
node -e "console.log(require('bcryptjs').hashSync('你的密码',10))"
```

**申请智谱 Key**：https://open.bigmodel.cn（免费，GLM-4-Flash）

### 启动

```bash
npm run dev
```

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin

---

## 🔄 日常同步

双击 `sync.bat` → 自动 push → Vercel 自动部署。

**网络报错**：等 1 分钟重试 / 手机热点 / `git push origin main --force`

---

## 📦 部署

### Vercel（只读预览）

1. Vercel → `Add New` → `Project` → 选 `chenjingyu1116/blog`
2. **Root Directory**：`XHBlogs`
3. **Environment Variables** 添加：
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `ZHIPU_API_KEY`
4. Deploy

> ⚠️ Vercel 文件系统只读，**后台保存会失败**。只做只读预览。

### 自建服务器（全功能）

备案通过后部署到阿里云 ECS：

```bash
git clone https://github.com/chenjingyu1116/blog.git
cd blog/XHBlogs
npm install
npm run build
pm2 start npm --name xhblogs -- start
```

Nginx 反代 + certbot HTTPS。

---

## 🔒 安全

- `.env.local` 不提交 Git
- JWT 7 天有效，Cookie httpOnly + sameSite
- 密码 bcrypt 加盐
- 后台走 `middleware.ts` 鉴权

---

## 🗺️ Roadmap

- [x] 博客系统（文章 / 说说 / 杂谈 / 归档）
- [x] 后台管理系统（15 个模块）
- [x] 工具箱（18 个工具）
- [x] 草稿过滤 + 数据备份
- [x] 站点设置可视化（含导航菜单）
- [x] 访问统计 + 文章阅读量
- [x] 仪表盘升级
- [x] 中文文件名兼容
- [x] 前台猫猫 AI 聊天
- [x] **猫猫写作助手（12 功能）**
- [ ] 评论系统集成
- [ ] 部署到自建服务器
- [ ] `idcan.top` 备案通过并绑定

---

## 📄 License

[MIT](LICENSE)

---

## 💬 联系

- 博客：https://blog-yu-jiamgy1.vercel.app
- 自定义域名：`idcan.top`（备案中）
- GitHub：[@chenjingyu1116](https://github.com/chenjingyu1116)

---

⭐ 如果这个项目对你有帮助，欢迎 Star！