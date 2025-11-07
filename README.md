
<div align="center">
  <img src="./readme/images/logo.png" alt="screenshot" width="100" />
  <h1>Camlife</h1>

  English | [简体中文](/README_zh.md)

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/camlife">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/camlife?style=flat">
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/camlife?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/camlife">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/camlife">
  <img alt="Page views" src="https://komarev.com/ghpvc/?username=camlife&label=Views&color=orange&style=flat" />

  <p>Camlife is a website that showcases photography works for everyone who loves photography</p>
  <img src="./readme/images/preview.png" alt="screenshot" />
</div>

## ✨ Features

- [x] 🌓 Supports dark/light themes
- [x] ✨ Minimalist and elegant UI design
- [x] 📱 Responsive design for all devices
- [x] 🖼️ Various beautiful image display layouts
- [x] 🗺️ Cool interactive map browsing mode
- [ ] 🏷️ Organize and display photos using tags
- [ ] 🔗 Image sharing and open graph image generation
- [ ] 💼 Support image usage with copyright purchase
- [x] 📊 Dashboard supports data statistics, album management, and others
- [x] 🤖 Integrate AI generated image titles and descriptions
- [x] 📷 Image EXIF automatic parsing
- [x] 🗜️ High-efficiency image compression and generation of BlurHash data
- [x] 📍 Get image location information based on latitude and longitude
- [ ] 📦 Support for batch automatic upload and parsing processing of images
- [ ] 📰 Generate RSS/JSON feeds
- [ ] 📸 Live Photo image format support
- [ ] 🚀 Supports CDN acceleration for faster photo delivery
- [x] 🔐 Secure authentication with Better Auth
- [x] 💾 Multi-Storage Support: Cloudflare R2、AWS S3 or Vercel Blob
- [ ] 🎁 Hide some Easter eggs and more features at any time

## 🎬 Showcase

- https://camlife.app

> Welcome to add your website to the list https://github.com/sun0225SUN/camlife/issues/11

## 🔨 Tech Stack

- ⚡ Framework - [Next.js](https://nextjs.org)
- 🧩 Language - [TypeScript](https://www.typescriptlang.org)
- 🌬️ Styling - [Tailwind CSS](https://tailwindcss.com)
- 🎛️ UI Library - [shadcn/ui](https://ui.shadcn.com)
- 🐻 State Management - [Zustand](https://zustand-demo.pmnd.rs)
- 🐘 Database - [Postgres](https://www.postgresql.org)
- 🌧️ ORM - [Drizzle](https://orm.drizzle.team)
- 🔑 Auth - [Better Auth](https://www.better-auth.com)
- 🗺️ Maps - [mapbox](https://mapbox.com)
- 🌐 Multi-language - [next-intl](https://next-intl.dev)
- ✅ Schema Validations - [Zod](https://zod.dev)
- 🧪 Testing FrameWork - [Vitest](https://vitest.dev)
- 🔗 API Layer - [tRPC](https://trpc.io)
- 🧹 Formatter and Linter - [Biome](https://biomejs.dev)
- 🪝 Git hooks - [Lefthook](https://lefthook.dev)
- 📊 Traffic Analysis - [Umami](https://umami.is) &  [@vercel/analytics](https://vercel.com/docs/analytics/quickstart?package-manager=bun)

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
            <td align="center">
                <a href="https://github.com/SunXin121">
                    <img src="https://avatars.githubusercontent.com/u/111034439?v=4" width="100;" alt="SunXin121"/>
                    <br />
                    <sub><b>Sun Xin</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->

## 🍭 Community

- [Telegram](https://t.me/guoqisun)

## 💡 Inspired Projects

- [Camarts](https://camarts.app)
- [exif-photo-blog](https://github.com/sambecker/exif-photo-blog)
- [photography-website](https://github.com/ECarry/photography-website)
- [PicImpact](https://github.com/besscroft/PicImpact)
- [Afilmory](https://github.com/Afilmory/afilmory)
- [chronoframe](https://github.com/HoshinoSuzumi/chronoframe)
- [running_page](https://github.com/yihong0618/running_page)

## 🚀 Getting Started

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sun0225SUN/camlife)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sun0225SUN/camlife)

### Docker

1. Create a `.env` file in the root directory

2. Docker Compose

```bash
docker-compose up -d
```

> [!warning]
> Please ensure that all necessary environment variables are correctly configured before running the project.

```bash
# Database
DATABASE_URL="postgresql://postgres:password@host:port/camlife"

# Storage
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

# Auth
# You can generate a random secret using `openssl rand -base64 32`
BETTER_AUTH_SECRET="I1IA7rUTafc+feqzSE61tjlPhtzTkewhJUnp6lL9nVI="
BETTER_AUTH_URL="http://localhost:3000"

# Umami
NEXT_PUBLIC_UMAMI_ANALYTICS_ID="****-1d30-4876-8de6-****"
NEXT_PUBLIC_UMAMI_ANALYTICS_JS="https://umami.guoqi.dev/script.js"
```


> [!note]
> Variables marked with `*` are required only when `STORAGE_PROVIDER` is set to `cloudflare-r2`. For other storage providers (AWS S3, Vercel Blob), different environment variables will be required.

<details>
<summary><strong>Cloudflare R2</strong></summary>

1. Setup bucket
   - [Create R2 bucket](https://developers.cloudflare.com/r2/) with default settings
   - Setup CORS under bucket settings:
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
   - Enable public hosting by doing one of the following:
       - Select "Connect Custom Domain" and choose a Cloudflare domain
       - OR
       - Select "Allow Access" from R2.dev subdomain
   - Store public configuration:
     - `CLOUDFLARE_R2_BUCKET`: bucket name
     - `CLOUDFLARE_R2_ENDPOINT`: bucket endpoint
     - `CLOUDFLARE_R2_PUBLIC_URL`: either "your-custom-domain.com" or "pub-jf90908...s0d9f8s0s9df.r2.dev"
2. Setup private credentials
   - Create API token by selecting "Manage R2 API Tokens," and clicking "Create API Token"
   - Select "Object Read & Write," choose "Apply to specific buckets only," and select the bucket created in Step 1
   - Store credentials:
     - `CLOUDFLARE_R2_ACCESS_KEY`
     - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

</details>

<details>
<summary><strong>AWS S3</strong></summary>

1. Setup bucket
   - [Create S3 bucket](https://s3.console.aws.amazon.com/s3) with "ACLs enabled," and "Block all public access" turned off
   - Setup CORS under bucket permissions:
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
   - Store public configuration
     - `AWS_S3_BUCKET`: bucket name
     - `AWS_S3_REGION`: bucket region, e.g., "us-east-1"
2. Setup private credentials
   - [Create IAM policy](https://console.aws.amazon.com/iam/home#/policies) using JSON editor:
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
   - [Create IAM user](https://console.aws.amazon.com/iam/home#/users) by choosing "Attach policies directly," and selecting the policy created above. Create "Access key" under "Security credentials," choose "Application running outside AWS," and store credentials :
     - `AWS_S3_ACCESS_KEY`
     - `AWS_S3_SECRET_ACCESS_KEY`

</details>

<details>
<summary><strong>Vercel Blob</strong></summary>
  Todo
</details>


| Variable                          | Description                                                      | Default                 | Required |
| :-------------------------------- | :--------------------------------------------------------------- | :---------------------- | :------- |
| `DATABASE_URL`                    | PostgreSQL database connection URL                               | None                    | Yes      |
| `STORAGE_PROVIDER`                | Storage provider (cloudflare-r2, aws-s3, vercel-blob)            | cloudflare-r2           | Yes      |
| `CLOUDFLARE_R2_ENDPOINT`          | Cloudflare R2 endpoint URL                                       | None                    | Yes*     |
| `CLOUDFLARE_R2_BUCKET`            | Cloudflare R2 bucket name                                        | None                    | Yes*     |
| `CLOUDFLARE_R2_REGION`            | Cloudflare R2 region                                             | auto                    | No       |
| `CLOUDFLARE_R2_ACCESS_KEY_ID`     | Cloudflare R2 access key ID                                      | None                    | Yes*     |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret access key                                  | None                    | Yes*     |
| `CLOUDFLARE_R2_PREFIX`            | Cloudflare R2 object key prefix                                  | camlife                 | No       |
| `CLOUDFLARE_R2_PUBLIC_URL`        | Cloudflare R2 public URL for accessing files                     | None                    | Yes*     |
| `AWS_S3_BUCKET`                   | AWS S3 bucket name                                               | None                    | Yes*     |
| `AWS_S3_REGION`                   | AWS S3 region                                                    | auto                    | No       |
| `AWS_S3_ACCESS_KEY`               | AWS S3 access key                                                | None                    | Yes*     |
| `AWS_S3_SECRET_ACCESS_KEY`        | AWS S3 secret access key                                         | None                    | Yes*     |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox map service access token                                  | None                    | Yes      |
| `BETTER_AUTH_SECRET`              | Better Auth secret key (generate with `openssl rand -base64 32`) | None                    | Yes      |
| `BETTER_AUTH_URL`                 | Application base URL                                             | `http://localhost:3000` | Yes      |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_ID`  | Umami Website ID                                                 | None                    | No       |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_JS`  | Umami Custom Analysis JS URL                                     | None                    | No       |


## 💻  Local development

1. Clone the repository

```bash
git clone https://github.com/sun0225SUN/camlife.git

cd camlife
```

2. Create a .env file in the root directory, and configure the environment variables as described in the [🚀 Getting Started](#-getting-started) section.

3. Install dependencies

```bash
bun install
```

4. Set up the database

```bash
bun db:migrate
```

5. Start the development server

```bash
bun run dev
```

Open: `http://localhost:3000` to see your application.

## 📝 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## 💖 Sponsors

If you find this project helpful, please give it a ⭐️ on GitHub!

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

## 📊 Repository Status

![Alt](https://repobeats.axiom.co/api/embed/f5bb2ebee60c45f94f913acf667a4500d1f0fbfa.svg "Repobeats analytics image")

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/camlife&type=Date)](https://github.com/sun0225SUN/camlife)