
<div align="center">
  <img src="./docs/images/logo.png" alt="screenshot" width="100" />
  <h1>Camlife</h1>

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/camlife">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/camlife?style=flat">
   <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/camlife?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/camlife">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/camlife">

  <p>Camlife is a website that showcases photography works for everyone who loves photography</p>
  <img src="./docs/images/preview.png" alt="screenshot" />
</div>

## ✨ Features

- [ ] 🎨 Clean and minimalist design
- [ ] 📱 Responsive design for all devices
- [ ] 🖼️ Automatic EXIF data extraction from photos
- [ ] 🔐 Secure authentication with Better Auth
- [ ] ☁️ Cloud storage with Cloudflare R2
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
- ✅ Schema Validations - [Zod](https://zod.dev)
- 🔗 API Layer - [tRPC](https://trpc.io)
- 🧹 Formatter and Linter - [Biome](https://biomejs.dev)
- 🪝 Git hooks - [Lefthook](https://lefthook.dev)

## 👥 Contributors

<!-- readme: collaborators,contributors -start -->
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
DATABASE_URL=your_database_url

# Storage
STORAGE_PROVIDER=s3
STORAGE_PROVIDER_S3_ENDPOINT=
STORAGE_PROVIDER_S3_BUCKET=
STORAGE_PROVIDER_S3_REGION=auto
STORAGE_PROVIDER_S3_ACCESS_KEY_ID=
STORAGE_PROVIDER_S3_SECRET_ACCESS_KEY=
STORAGE_PROVIDER_S3_PREFIX=camlife

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Auth
# You can generate a random secret using `openssl rand -base64 32`
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```


| Variable                                | Description                                                      | Default                 | Required                   |
| :-------------------------------------- | :--------------------------------------------------------------- | :---------------------- | :------------------------- |
| `DATABASE_URL`                          | PostgreSQL database connection URL                               | None                    | Yes                        |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`       | Mapbox map service access token                                  | None                    | Yes                        |
| `BETTER_AUTH_SECRET`                    | Better Auth secret key (generate with `openssl rand -base64 32`) | None                    | Yes                        |
| `BETTER_AUTH_URL`                       | Application base URL                                             | `http://localhost:3000` | Yes                        |
| `STORAGE_PROVIDER`                      | Storage provider (Vercel Blob、Cloudflare R2、AWS S3)            | s3                      | Yes                        |
| `STORAGE_PROVIDER_S3_ENDPOINT`          | S3 endpoint                                                      | None                    | Required if provider is s3 |
| `STORAGE_PROVIDER_S3_BUCKET`            | S3 bucket name                                                   | None                    | Required if provider is s3 |
| `STORAGE_PROVIDER_S3_REGION`            | S3 bucket region                                                 | auto                    | Required if provider is s3 |
| `STORAGE_PROVIDER_S3_ACCESS_KEY_ID`     | S3 access key ID                                                 | None                    | Required if provider is s3 |
| `STORAGE_PROVIDER_S3_SECRET_ACCESS_KEY` | S3 secret access key                                             | None                    | Required if provider is s3 |
| `STORAGE_PROVIDER_S3_PREFIX`            | S3 object prefix                                                 | camlife                 | Required if provider is s3 |


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
bun db:push
```

5. Start the development server

```bash
bun run dev
```

Open: `http://localhost:3000` to see your application.


## 📝 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

## 💖 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## 📊 Repository Status

![Alt](https://repobeats.axiom.co/api/embed/f5bb2ebee60c45f94f913acf667a4500d1f0fbfa.svg "Repobeats analytics image")

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/camlife&type=Date)](https://github.com/sun0225SUN/camlife)