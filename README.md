
<div align="center">
  <img src="./docs/images/logo.png" alt="screenshot" width="100" />
  <h1>Camlife</h1>

  English | [简体中文](/README_zh.md)

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/camlife">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/camlife?style=flat">
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/camlife?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/camlife">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/camlife">
  <img src="https://komarev.com/ghpvc/?username=camlife&label=Views&color=orange&style=flat" alt="visitors count" />&emsp;

  <p>Camlife is a website that showcases photography works for everyone who loves photography</p>
  <img src="./docs/images/preview.png" alt="screenshot" />
</div>

## ✨ Features

- [x] 🎨 Clean and minimalist design
- [x] 📱 Responsive design for all devices
- [x] 🖼️ Automatic EXIF data extraction from photos
- [x] 🔐 Secure authentication with Better Auth
- [x] ☁️ Cloud storage with Cloudflare R2
- [ ] 📡 RSS feed
- [ ] ✨ and more...

## 🎬 Showcase

- https://camlife.app

> welcome to add your website to the list ❤️

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
- 📊 Traffic Analysis - [Umami](https://umami.is)


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
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox map service access token                                  | None                    | Yes      |
| `BETTER_AUTH_SECRET`              | Better Auth secret key (generate with `openssl rand -base64 32`) | None                    | Yes      |
| `BETTER_AUTH_URL`                 | Application base URL                                             | `http://localhost:3000` | Yes      |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_ID`  | Umami Website ID                                                 | None                    | No       |
| `NEXT_PUBLIC_UMAMI_ANALYTICS_JS`  | Umami Custom Analysis JS URL                                     | None                    | No       |

> [!note]
> Variables marked with `*` are required only when `STORAGE_PROVIDER` is set to `cloudflare-r2`. For other storage providers (AWS S3, Vercel Blob), different environment variables will be required.

## 💻  Local development

1. Clone the repository

```bash
git clone https://github.com/sun0225SUN/camlife.git

cd camlife
```

2. Create a `.env` file in the root directory

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

## 💖 Support

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