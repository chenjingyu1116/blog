# 星辉小屋 · XingHuiSama の 宝藏之地

> 🌐 **在线预览：** https://blog-yu-jiamgy1.vercel.app
> 🚧 **自定义域名：** `idcan.top`（ICP 备案中，暂未开放）
> 📦 **仓库：** https://github.com/chenjingyu1116/blog

一个集成 **博客 + 工具箱 + 完整后台管理** 的现代化个人站点。
基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 构建，部署于 Vercel。

---

## ✨ 功能一览

### 📝 博客系统

| 模块 | 路径 | 说明 |
|---|---|---|
| 首页 | `/` | 个人信息、文章/说说轮播、照片墙、工具箱入口 |
| 文章 | `/posts/[slug]` | Markdown 正文，支持 GFM、KaTeX 数学公式、代码高亮 |
| 归档 | `/timeline` | 时间线 + 标签过滤 |
| 杂谈 | `/chatter` | 日常碎片、随笔 |
| 说说 | `/moments` | 生活动态、心情记录、位置标签 |
| 照片墙 | `/photowall` | 相册展示 |
| 友链 | `/friends` | 友情链接 |
| 音乐 | `/music` | 内置播放器 |
| 灵境 | `/tree` | Three.js 粒子飞船互动页 |
| 关于 | `/about` | 个人介绍 + 时间线活动 |

### 🧰 工具箱（18 个工具）

| 工具 | 路径 | 分类 |
|---|---|---|
| JSON 格式化 | `/tools/json` | 开发 |
| 颜色转换 | `/tools/color` | 设计 |
| 时间戳转换 | `/tools/time` | 开发 |
| 密码生成器 | `/tools/password` | 安全 |
| Base64 编解码 | `/tools/base64` | 开发 |
| 文本对比 | `/tools/diff` | 文本 |
| 二维码生成 | `/tools/qrcode` | 设计 |
| 图片压缩 | `/tools/image` | 图片 |
| 短链生成 | `/tools/short` | 实用 |
| 图床 | `/tools/upload` | 图片 |
| UUID 生成 | `/tools/uuid` | 开发 |
| URL 编解码 | `/tools/url` | 开发 |
| 哈希计算 | `/tools/hash` | 安全 |
| 进制转换 | `/tools/radix` | 开发 |
| 正则测试 | `/tools/regex` | 开发 |
| Lorem Ipsum | `/tools/lorem` | 文本 |
| 房贷计算器 | `/tools/loan` | 实用 |
| 字数统计 | `/tools/wordcount` | 文本 |

支持**实时搜索** + **分类过滤**。

### 🔐 后台管理系统（14 个模块）

路径：`/admin`（需登录）

| 模块 | 路径 | 功能 |
|---|---|---|
| 仪表盘 | `/admin` | 8 项数据卡片 + 快捷操作 + 最近动态混合列表 |
| 文章管理 | `/admin/posts` | 增删改查、批量发布/删除、复制、导出 JSON |
| 编辑器 | `/admin/posts/new` | Markdown 预览、Ctrl+S、拖拽上传、自动存草稿、字数统计 |
| 说说管理 | `/admin/moments` | 说说增删改查、日期/地点/图片 |
| 杂谈管理 | `/admin/chatter` | 杂谈增删改查、标签/心情/封面 |
| 相册管理 | `/admin/albums` | 相册增删改查、照片管理 |
| 友链管理 | `/admin/friends` | 友链增删改查、主题色 |
| 工具管理 | `/admin/tools` | 工具增删改查、开关、排序 |
| 短链管理 | `/admin/shortlinks` | 查看点击次数、删除 |
| 图床管理 | `/admin/uploads` | 预览、复制链接、批量删除 |
| 站点设置 | `/admin/site` | 全站信息可视化编辑（5 个 Tab） |
| 访问统计 | `/admin/stats` | PV / UV / 每日趋势 / 文章阅读量 TOP 20 |
| 数据备份 | `/admin/backup` | 一键导出所有文章和配置为 JSON |

**仪表盘亮点：**
- 8 项数据卡片（文章 / 说说 / 杂谈 / 相册 / 友链 / 工具 / 短链 / 访问量）
- 悬停上浮 + 渐变光晕动画
- 6 个快捷操作入口
- 文章 + 说说 + 杂谈按时间混排的「最近动态」
- 欢迎语实时显示今日 PV

**站点设置（5 个 Tab）：**
- 基础信息（标题、作者、简介、导航文案、建站日期）
- 图片资源（favicon、头像、默认封面、背景图）
- 社交链接（GitHub、Gitee、邮箱、QQ、微信、音乐 ID、ICP）
- **导航菜单**（可视化增删改菜单项、开关、排序）
- 高级（弹幕列表、友链申请格式、Gitalk）

**安全机制：** JWT + HttpOnly Cookie，密码 bcrypt 加密，后台接口全部走 `middleware.ts` 鉴权。

### 🎨 主题与交互

- 白天 / 黑夜模式切换
- 樱花飘落 / 星空粒子 / 动漫背景轮换
- 音乐播放器 / 猫猫助手 / 聊天组件
- 全局弹幕背景
- 移动端适配

### 🛡️ 内容安全

- 草稿在前台**完全不可见**（9 个前台页面统一过滤）
- 直接访问草稿 URL → 404
- 后台可控每篇文章的发布状态
- **中文文件名兼容**：文件查找用归一化 + 遍历对比，避免编码问题
- **新文章自动用英文文件名**：彻底避开中文 URL 编码陷阱

---

## 🛠️ 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| UI | React 19 + Tailwind CSS v4 |
| 动画 | Framer Motion |
| 3D | Three.js + @react-three/fiber + drei |
| Markdown | gray-matter + unified + remark + rehype |
| 代码高亮 | highlight.js |
| 数学公式 | KaTeX |
| 富文本 | @tiptap/* |
| 鉴权 | jose (JWT) + bcryptjs |
| 二维码 | qrcode |
| 部署 | Vercel |

---

## 📁 目录结构

```
XHBlogs/
├── app/
│   ├── page.tsx                # 首页
│   ├── layout.tsx              # 根布局（挂 VisitTracker）
│   ├── error.tsx               # 全局错误页
│   ├── loading.tsx             # 全局加载页
│   ├── globals.css
│   │
│   ├── about/                  # 关于
│   ├── posts/                  # 文章
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx     # 详情（force-dynamic）
│   ├── chatter/                # 杂谈
│   ├── moments/                # 说说
│   ├── timeline/               # 归档
│   ├── tree/                   # 灵境（3D）
│   ├── photowall/              # 照片墙
│   ├── friends/                # 友链
│   ├── music/                  # 音乐
│   │
│   ├── tools/                  # 工具箱
│   │   ├── page.tsx
│   │   ├── json/ color/ time/ password/
│   │   ├── base64/ diff/ qrcode/ image/
│   │   ├── short/ upload/ uuid/ url/
│   │   ├── hash/ radix/ regex/ lorem/
│   │   └── loan/ wordcount/
│   │
│   ├── admin/                  # 后台
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 仪表盘
│   │   ├── login/
│   │   ├── posts/              # 文章管理
│   │   ├── moments/            # 说说管理
│   │   ├── chatter/            # 杂谈管理
│   │   ├── albums/             # 相册管理
│   │   ├── friends/            # 友链管理
│   │   ├── tools/              # 工具管理
│   │   ├── shortlinks/         # 短链管理
│   │   ├── uploads/            # 图床管理
│   │   ├── site/               # 站点设置
│   │   ├── stats/              # 访问统计
│   │   └── backup/             # 数据备份
│   │
│   ├── s/[code]/route.ts       # 短链跳转
│   │
│   └── api/
│       ├── admin/              # 后台接口
│       │   ├── login/  logout/
│       │   ├── posts/  moments/  chatter/
│       │   ├── albums/  friends/
│       │   ├── tools/  shortlinks/  uploads/
│       │   ├── site/  stats/  backup/
│       ├── tools/              # 工具接口
│       │   ├── shorten/  upload/
│       ├── track/route.ts      # 访问上报
│       └── posts/[slug]/view/  # 文章阅读上报
│
├── components/
│   ├── admin/                  # 后台组件
│   │   ├── AdminShell.tsx
│   │   ├── PostsClient.tsx
│   │   ├── PostEditor.tsx
│   │   ├── ToolsClient.tsx
│   │   ├── ShortLinksClient.tsx
│   │   └── UploadsClient.tsx
│   ├── ToolsGrid.tsx  ToolsFilter.tsx  ToolsList.tsx
│   ├── VisitTracker.tsx        # 访问统计上报
│   ├── PostViewTracker.tsx     # 文章阅读上报
│   ├── Navbar.tsx  PageTransition.tsx  ...
│
├── lib/
│   ├── auth.ts                 # JWT 鉴权
│   ├── posts.ts                # 文章读写（含中文文件名兼容）
│   ├── tools.ts                # 工具配置
│   ├── shortlinks.ts           # 短链数据
│   ├── admin-data.ts           # 相册 + 友链读写
│   ├── admin-content.ts        # 说说 + 杂谈读写
│   ├── admin-site.ts           # 站点设置读写
│   └── analytics.ts            # 访问统计
│
├── data/
│   ├── site.json               # 站点设置（含 navLinks 导航菜单）
│   ├── albums.ts               # 相册数据
│   ├── friends.ts              # 友链数据
│   ├── tools.json              # 工具配置
│   ├── shortlinks.json         # 短链数据
│   └── analytics.json          # 访问统计（gitignore）
│
├── posts/                      # 文章 .md
├── chatters/                   # 杂谈 .md
├── moments/                    # 说说 .md
│
├── public/
│   ├── uploads/                # 图床文件（gitignore）
│   └── ...
│
├── middleware.ts               # 后台鉴权
├── siteConfig.ts               # 从 data/site.json 导入
├── sync.bat                    # 一键同步到 GitHub
├── .env.local                  # 环境变量（不上传）
└── package.json
```

---

## 🚀 本地运行

### 环境要求

- Node.js **v20 或 v22 LTS**
- npm 10+

### 步骤

```bash
# 1. 克隆
git clone https://github.com/chenjingyu1116/blog.git
cd blog/XHBlogs

# 2. 安装依赖
npm install

# 3. 生成 JWT 密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. 生成管理员密码哈希
node -e "console.log(require('bcryptjs').hashSync('你的密码',10))"

# 5. 创建 .env.local（见下方）
```

### `.env.local` 内容

```bash
JWT_SECRET=刚才生成的64位hex
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=\$2b\$10\$...（每个 $ 前加反斜杠）
```

> ⚠️ **关键**：哈希里的 `$` 必须写成 `\$`，否则 Next.js 会把它当变量名，导致登录 401。

### 启动

```bash
npm run dev
```

访问：

- 前台：http://localhost:3000
- 工具箱：http://localhost:3000/tools
- 后台：http://localhost:3000/admin

---

## 📖 使用指南

### 写文章

1. 进入 `/admin/posts/new`
2. 填写标题、摘要、标签
3. 撰写正文（Markdown）
4. 右侧实时预览
5. 取消勾选「发布」→ 保存为草稿（前台看不到）
6. 勾选「发布」→ 前台立即可见

> 💡 **文件名规则**：新文章会自动生成纯英文文件名（如 `my-post-xxx.md`），避免中文 URL 编码问题。文章的标题、显示内容完全按你写的来。

### 管理说说 / 杂谈

1. 进入 `/admin/moments` 或 `/admin/chatter`
2. 支持增删改查
3. 说说支持：日期、地点、图片 URL
4. 杂谈支持：标题、日期、心情、标签、封面

### 管理相册 / 友链

1. 进入 `/admin/albums` 或 `/admin/friends`
2. 相册：编辑相册信息 + 内部照片增删
3. 友链：编辑名称、链接、头像、主题色

### 站点设置

1. 进入 `/admin/site`
2. 5 个 Tab：
   - **基础信息**：标题、作者、简介、导航文案
   - **图片资源**：favicon、头像、封面、背景图
   - **社交链接**：GitHub、Gitee、邮箱、QQ、微信、音乐 ID
   - **导航菜单**：可视化增删改菜单项、开关、排序
   - **高级**：弹幕列表、友链申请格式、Gitalk
3. 点「保存全部」→ 前台立即生效

### 添加工具

1. 进入 `/admin/tools`
2. 点「＋ 新增工具」
3. 填写 ID、名称、路径、图标、分类、描述
4. 保存 → 前台 `/tools` 立即出现

### 生成短链

1. 进入 `/tools/short`
2. 粘贴长链接
3. 可选填自定义短码（如 `my-link`）
4. 点生成 → 得到 `https://blog-yu-jiamgy1.vercel.app/s/xxxxxx`
5. 可显示二维码、复制 Markdown / HTML

### 上传图片

1. 进入 `/tools/upload`
2. 拖拽或点击选择图片
3. 自动压缩（可选）
4. 上传后复制：链接 / Markdown / HTML

### 查看访问统计

1. 进入 `/admin/stats`
2. 看总 PV / UV / 今日数据
3. 最近 30 天柱状图
4. 文章阅读量 TOP 20

---

## 🔄 日常同步

改完代码，**双击 `sync.bat`** 即可自动：

1. `git add .`
2. `git commit`（消息带时间）
3. `git push`

Vercel 检测到 main 分支更新后**自动部署**，1 分钟后上线。

### 如果 `sync.bat` 报网络错误

GitHub 国内偶尔连不上。解决方案：

1. 等 1 分钟再双击
2. 手机开热点给电脑
3. 使用代理

### 如果 push 被拒绝

远程有 Vercel 自动同步的提交。强制推送：

```powershell
git push origin main --force
```

---

## 📦 部署

### 方案 A：Vercel（当前方案，只读预览）

1. 登录 [Vercel](https://vercel.com)
2. `Add New...` → `Project`
3. 选择 `chenjingyu1116/blog` 仓库
4. 设置：
   - **Root Directory**：`XHBlogs`
   - **Framework Preset**：Next.js
5. 添加环境变量（Settings → Environment Variables）：
   - `JWT_SECRET` = 你的 64 位 hex
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD_HASH` = 你生成的哈希
6. `Deploy`

> ⚠️ **重要限制**：Vercel 是 serverless 环境，**文件系统只读**。后台的**所有保存操作都会失败**（文章、相册、友链、工具、站点设置等）。Vercel 只适合做**只读预览**。

### 方案 B：自建服务器（推荐，全功能）

部署到自己的阿里云 ECS / 腾讯云轻量：

```bash
# 服务器上
git clone https://github.com/chenjingyu1116/blog.git
cd blog/XHBlogs

# 创建 .env.production（内容同 .env.local）
npm install
npm run build

# 使用 PM2 启动
npm install -g pm2
pm2 start npm --name xhblogs -- start
pm2 save
pm2 startup
```

Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name idcan.top;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

HTTPS：使用 `certbot` 一键申请 Let's Encrypt 证书。

### 自定义域名（idcan.top）

> ⚠️ **当前状态**：`idcan.top` 正在 **ICP 备案** 中，暂未开放访问。

**备案流程**（中国大陆服务器需要）：

1. 在阿里云 / 腾讯云 / 华为云等**大陆注册商**购买域名
2. 提交 ICP 备案申请（需**大陆服务器** + 实名认证）
3. 等待 7-20 个工作日审核
4. 审核通过后，域名才能在大陆正常解析

**备案通过后**：

1. 部署到 ECS，配置 Nginx 反向代理
2. DNS 解析到服务器 IP
3. 申请 HTTPS 证书

---

## 🔒 安全说明

- `.env.local` **绝不提交到 Git**（已在 `.gitignore`）
- JWT 有效期 7 天
- Cookie 设置 `httpOnly` + `sameSite=lax`
- 生产环境自动启用 `secure`
- 密码使用 bcrypt 加盐哈希
- 后台接口全部走 `middleware.ts` 鉴权

---

## 🗺️ Roadmap

- [x] 博客系统（文章 / 说说 / 杂谈 / 归档）
- [x] 后台管理系统（14 个模块）
- [x] 工具箱（18 个工具）
- [x] 草稿过滤 + 数据备份
- [x] 站点设置可视化（含导航菜单）
- [x] 访问统计 + 文章阅读量
- [x] 仪表盘升级（8 卡片 + 快捷操作 + 混合动态）
- [x] 中文文件名兼容（遍历对比 + 归一化）
- [ ] 评论系统集成
- [ ] 多用户管理
- [ ] 部署到自建服务器
- [ ] 自定义域名 `idcan.top` 备案通过并绑定

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