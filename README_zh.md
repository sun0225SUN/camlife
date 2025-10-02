
<div align="center">
  <img src="./readme/images/logo.png" alt="screenshot" width="100" />
  <h1>Camlife</h1>

  [English](/README.md) | 简体中文

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/camlife">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/camlife?style=flat">
   <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/camlife?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/camlife">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/camlife">
  <img src="https://komarev.com/ghpvc/?username=camlife&label=Views&color=orange&style=flat" alt="visitors count" />&emsp;

  <p>Camlife 是一个为所有热爱摄影的人提供的展示摄影作品的网站</p>
  <img src="./readme/images/preview.png" alt="screenshot" />
</div>

## ✨ 功能特性

- [x] 🌓 支持深色/浅色主题
- [x] ✨ 简约优雅的 UI 设计
- [x] 📱 全设备响应式设计
- [x] 🖼️ 各种精美的图片展示布局
- [ ] 🗺️ 酷炫的交互式地图浏览模式
- [ ] 🏷️ 使用标签整理和展示照片
- [ ] 🔗 图片分享和 OpenGraph 图片生成
- [ ] 💼 支持版权购买的图片使用
- [x] 📊 仪表板支持数据统计、相册管理等
- [x] 🤖 集成 AI 生成的图片标题和描述
- [x] 📷 图片 EXIF 自动解析
- [x] 🗜️ 高效图片压缩和模糊哈希数据生成
- [x] 📍 基于经纬度获取图片位置信息
- [ ] 📦 支持批量自动上传和解析处理图片
- [ ] 📰 生成 RSS/JSON 订阅源
- [ ] 📸 Live Photo 图片格式支持
- [ ] 🚀 支持 CDN 加速，更快的照片传输
- [x] 🔐 使用 Better Auth 的安全认证
- [x] 💾 多存储支持：Cloudflare R2、AWS S3 或 Vercel Blob
- [ ] 🎁 一些彩蛋和更多功能

## 🎬 示例网站

- https://camlife.app

> 欢迎将您的网站添加到列表中 https://github.com/sun0225SUN/camlife/issues/11

## 🔨 技术栈

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

## 👥 贡献者

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

## 💡 启发项目

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

AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_S3_ACCESS_KEY=
AWS_S3_SECRET_ACCESS_KEY=

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
| `AWS_S3_BUCKET`                   | AWS S3 存储桶名称                                      | None                    | Yes* |
| `AWS_S3_REGION`                   | AWS S3 区域                                            | auto                    | No   |
| `AWS_S3_ACCESS_KEY`               | AWS S3 访问密钥                                        | None                    | Yes* |
| `AWS_S3_SECRET_ACCESS_KEY`        | AWS S3 秘密访问密钥                                    | None                    | Yes* |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox 地图服务访问令牌                                | None                    | Yes  |
| `BETTER_AUTH_SECRET`              | Better Auth 密钥 (使用 `openssl rand -base64 32` 生成) | None                    | Yes  |
| `BETTER_AUTH_URL`                 | 应用程序基础 URL                                       | `http://localhost:3000` | Yes  |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_ID`  | Umami 网站 ID                                          | None                    | No   |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_JS`  | Umami 自定义分析 JS URL                                | None                    | No   |

> [!note]
> 标记为 `*` 的变量仅在 `STORAGE_PROVIDER` 设置为 `cloudflare-r2` 时必需。对于其他存储提供商（AWS S3、Vercel Blob），需要不同的环境变量。

<details>
<summary><strong>Cloudflare R2</strong></summary>

1. 设置存储桶
   - [创建 R2 存储桶](https://developers.cloudflare.com/r2/)，使用默认设置
   - 在存储桶设置下配置 CORS：
   ```json
   [{
       "AllowedHeaders": ["*"],
       "AllowedMethods": [
         "GET",
         "PUT"
       ],
       "AllowedOrigins": [
          "http://localhost:3000",
          "https://{VERCEL_PROJECT_NAME}*.vercel.app",
          "{PRODUCTION_DOMAIN}"
       ]
   }]
   ```
   - 通过以下方式之一启用公共托管：
       - 选择"连接自定义域"并选择 Cloudflare 域
       - 或者
       - 从 R2.dev 子域选择"允许访问"
   - 存储公共配置：
     - `CLOUDFLARE_R2_BUCKET`：存储桶名称
     - `CLOUDFLARE_R2_ENDPOINT`：存储桶端点
     - `CLOUDFLARE_R2_PUBLIC_URL`：可以是"your-custom-domain.com"或"pub-jf90908...s0d9f8s0s9df.r2.dev"
2. 设置私有凭据
   - 通过选择"管理 R2 API 令牌"并点击"创建 API 令牌"来创建 API 令牌
   - 选择"对象读写"，选择"仅应用于特定存储桶"，并选择在步骤 1 中创建的存储桶
   - 存储凭据：
     - `CLOUDFLARE_R2_ACCESS_KEY`
     - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

</details>

<details>
<summary><strong>AWS S3</strong></summary>

1. 设置存储桶
   - [创建 S3 存储桶](https://s3.console.aws.amazon.com/s3)，启用"ACL"，并关闭"阻止所有公共访问"
   - 在存储桶权限下设置 CORS：
     ```json
     [{
      "AllowedHeaders": ["*"],
      "AllowedMethods": [
        "GET",
        "PUT"
      ],
      "AllowedOrigins": [
        "http://localhost:*",
        "https://{VERCEL_PROJECT_NAME}*.vercel.app",
        "{PRODUCTION_DOMAIN}"
      ],
      "ExposeHeaders": []
     }]
     ```
   - 存储公共配置
     - `AWS_S3_BUCKET`：存储桶名称
     - `AWS_S3_REGION`：存储桶区域，例如"us-east-1"
2. 设置私有凭据
   - [创建 IAM 策略](https://console.aws.amazon.com/iam/home#/policies)，使用 JSON 编辑器：
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "s3:PutObject",
             "s3:PutObjectACL",
             "s3:GetObject",
             "s3:ListBucket",
             "s3:DeleteObject"
           ],
           "Resource": [
             "arn:aws:s3:::{BUCKET_NAME}",
             "arn:aws:s3:::{BUCKET_NAME}/*"
           ]
         }
       ]
     }
     ```
   - [创建 IAM 用户](https://console.aws.amazon.com/iam/home#/users)，选择"直接附加策略"，并选择上面创建的策略。在"安全凭据"下创建"访问密钥"，选择"在 AWS 外部运行的应用程序"，并存储凭据：
     - `AWS_S3_ACCESS_KEY`
     - `AWS_S3_SECRET_ACCESS_KEY`

</details>

<details>
<summary><strong>Vercel Blob</strong></summary>
  待完成
</details>


## 💻 本地开发

1. 克隆仓库

```bash
git clone https://github.com/sun0225SUN/camlife.git

cd camlife
```

2. 在根目录创建一个 .env 文件，并按照 [🚀 快速开始](#-快速开始) 部分所述配置环境变量

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