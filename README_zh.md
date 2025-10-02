
<div align="center">
  <img src="./docs/images/logo.png" alt="screenshot" width="100" />
  <h1>Camlife</h1>

  [English](/README.md) | 简体中文

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/camlife">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/camlife?style=flat">
   <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/camlife?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/camlife">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/camlife">
  <img src="https://komarev.com/ghpvc/?username=camlife&label=Views&color=orange&style=flat" alt="visitors count" />&emsp;

  <p>Camlife 是一个为所有热爱摄影的人提供的展示摄影作品的网站</p>
  <img src="./docs/images/preview.png" alt="screenshot" />
</div>

## ✨ Features

- [x] 🎨 简洁极简的设计
- [x] 📱 适配所有设备的响应式设计
- [x] 🖼️ 自动从照片中提取 EXIF 数据
- [x] 🔐 使用 Better Auth 的安全认证
- [x] ☁️ 使用 Cloudflare R2 的云存储
- [ ] 📡 RSS 订阅源
- [ ] ✨ 更多功能...

## 🎬 Showcase

- https://camlife.app

> 欢迎将您的网站添加到列表中 ❤️

## 🔨 Tech Stack

- ⚡ 框架 - [Next.js](https://nextjs.org)
- 🧩 语言 - [TypeScript](https://www.typescriptlang.org)
- 🌬️ 样式 - [Tailwind CSS](https://tailwindcss.com)
- 🎛️ UI 库 - [shadcn/ui](https://ui.shadcn.com)
- 🐻 状态管理 - [Zustand](https://zustand-demo.pmnd.rs)
- 🐘 数据库 - [Postgres](https://www.postgresql.org)
- 🌧️ ORM - [Drizzle](https://orm.drizzle.team)
- 🔑 认证 - [Better Auth](https://www.better-auth.com)
- 🗺️ 地图 - [mapbox](https://mapbox.com)
- 🌐 多语言 - [next-intl](https://next-intl.dev)
- ✅ 模式验证 - [Zod](https://zod.dev)
- 🧪 测试框架 - [Vitest](https://vitest.dev)
- 🔗 API 层 - [tRPC](https://trpc.io)
- 🧹 格式化器和代码检查 - [Biome](https://biomejs.dev)
- 🪝 Git 钩子 - [Lefthook](https://lefthook.dev)
- 📊 流量分析 - [Umami](https://umami.is)

## 👥 Contributors

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/sun0225SUN">
                    <img src="https://avatars.githubusercontent.com/u/79169717?v=4" width="100;" alt="sun0225SUN"/>
                    <br />
                    <sub><b>Guoqi Sun</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->

## 💡 Inspired Projects

- [Camarts](https://camarts.app)
- [exif-photo-blog](https://github.com/sambecker/exif-photo-blog)
- [photography-website](https://github.com/ECarry/photography-website)
- [PicImpact](https://github.com/besscroft/PicImpact)
- [Afilmory](https://github.com/Afilmory/afilmory)
- [chronoframe](https://github.com/HoshinoSuzumi/chronoframe)
- [running_page](https://github.com/yihong0618/running_page)

## 🚀 快速开始

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sun0225SUN/camlife)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sun0225SUN/camlife)

### Docker

1. 在根目录创建 `.env` 文件

2. Docker Compose

```bash
docker-compose up -d
```

> [!warning]
> 请确保在运行项目之前正确配置所有必要的环境变量。

```bash
# 数据库
DATABASE_URL="postgresql://postgres:password@host:port/camlife"

# 存储
STORAGE_PROVIDER="cloudflare-r2" # cloudflare-r2 | aws-s3 | vercel-blob

CLOUDFLARE_R2_ENDPOINT="https://fcb75ae*******2a3f5ce73fb.r2.cloudflarestorage.com"
CLOUDFLARE_R2_BUCKET="files"
CLOUDFLARE_R2_REGION="auto"
CLOUDFLARE_R2_ACCESS_KEY_ID="eac63617**********41cd00889"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="29d01ddcb25d*****************b6d561ab18d175a94f"
CLOUDFLARE_R2_PREFIX="camlife"
CLOUDFLARE_R2_PUBLIC_URL="https://pub-ba****************j.r2.dev"

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.eyJ18***********************************9.N3bTvCedxVfugnrCSRT2kw"

# 认证
# 您可以使用 `openssl rand -base64 32` 生成随机密钥
BETTER_AUTH_SECRET="I1IA7rUTafc+feqzSE61tjlPhtzTkewhJUnp6lL9nVI="
BETTER_AUTH_URL="http://localhost:3000"

# Umami
NEXT_PUBLIC_UMAMI_ANALYTICS_ID="****-1d30-4876-8de6-****"
NEXT_PUBLIC_UMAMI_ANALYTICS_JS="https://umami.guoqi.dev/script.js"
```


| 变量名                            | 描述                                                   | 默认值                  | 必需 |
| :-------------------------------- | :----------------------------------------------------- | :---------------------- | :--- |
| `DATABASE_URL`                    | PostgreSQL 数据库连接 URL                              | None                    | Yes  |
| `STORAGE_PROVIDER`                | 存储提供商 (cloudflare-r2, aws-s3, vercel-blob)        | cloudflare-r2           | Yes  |
| `CLOUDFLARE_R2_ENDPOINT`          | Cloudflare R2 端点 URL                                 | None                    | Yes* |
| `CLOUDFLARE_R2_BUCKET`            | Cloudflare R2 存储桶名称                               | None                    | Yes* |
| `CLOUDFLARE_R2_REGION`            | Cloudflare R2 区域                                     | auto                    | No   |
| `CLOUDFLARE_R2_ACCESS_KEY_ID`     | Cloudflare R2 访问密钥 ID                              | None                    | Yes* |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | Cloudflare R2 秘密访问密钥                             | None                    | Yes* |
| `CLOUDFLARE_R2_PREFIX`            | Cloudflare R2 对象键前缀                               | camlife                 | No   |
| `CLOUDFLARE_R2_PUBLIC_URL`        | Cloudflare R2 公共访问文件 URL                         | None                    | Yes* |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox 地图服务访问令牌                                | None                    | Yes  |
| `BETTER_AUTH_SECRET`              | Better Auth 密钥 (使用 `openssl rand -base64 32` 生成) | None                    | Yes  |
| `BETTER_AUTH_URL`                 | 应用程序基础 URL                                       | `http://localhost:3000` | Yes  |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_ID`  | Umami 网站 ID                                          | None                    | No   |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_JS`  | Umami 自定义分析 JS URL                                | None                    | No   |

> [!note]
> 标记为 `*` 的变量仅在 `STORAGE_PROVIDER` 设置为 `cloudflare-r2` 时必需。对于其他存储提供商（AWS S3、Vercel Blob），需要不同的环境变量。

## 💻 本地开发

1. 克隆仓库

```bash
git clone https://github.com/sun0225SUN/camlife.git

cd camlife
```

2. 在根目录创建 `.env` 文件

3. 安装依赖

```bash
bun install
```

4. 设置数据库

```bash
bun db:migrate
```

5. 启动开发服务器

```bash
bun run dev
```

打开：`http://localhost:3000` 查看您的应用程序。


## 📝 许可证

本项目基于 [GNU General Public License v3.0](LICENSE) 许可证。

## 🤝 贡献

欢迎贡献！请随时提交问题和拉取请求。

## 💖 支持

如果您觉得这个项目有帮助，请在 GitHub 上给它一个 ⭐️！

<table>
	<tbody>
		<tr>
      <td align="center">
         <img src="https://files.guoqi.dev/wxpay.png" width="250px"  alt="wxpay" style="border-radius:10px;" />
      </td>
      <td align="center">
        <img src="https://files.guoqi.dev/alipay.jpg" width="250px"  alt="alipay" style="border-radius:10px;" />
      </td>
		</tr>
	<tbody>
</table>

## 📊 仓库状态

![Alt](https://repobeats.axiom.co/api/embed/f5bb2ebee60c45f94f913acf667a4500d1f0fbfa.svg "Repobeats analytics image")

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/camlife&type=Date)](https://github.com/sun0225SUN/camlife)