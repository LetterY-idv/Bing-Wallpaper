

# 📸 bing-wallpaper-archive

This project archives Bing daily wallpaper data from 2016-03-05 to the present, and provides a Cloudflare Pages website, JSON API, direct image link interface, and batch download capabilities.

Total images: **3809**

Latest data date: **20260807**

## 🚀 Features

### Bing JSON Data

- ✅ Companion JSON data is automatically updated daily at 00:00 Beijing Time via GitHub Actions

### Batch Downloader

- ✅ Supports resolution selection: Original, 4K, 2K, 1080P, or custom dimensions
- ✅ Supports batch downloading by date range
- ✅ Organizes downloaded images by year
- ✅ Automatically skips already downloaded files to prevent duplicates
- ✅ All images are downloaded directly from official sources

Note:

- Wallpapers prior to 20190510 only provide 1080P resolution for download.
---

## 📦 Project Structure

```text
📁 Project Root
├── 20**/                           # JSON data divided by day
├── Bing_zh-CN_all.json             # All archived Bing wallpaper JSON data
├── functions/                      # Cloudflare Pages Functions (/api, /img)
├── public/                         # Cloudflare Pages static site directory
│   ├── _headers                    # Response headers and cache policies
│   ├── api-doc/                    # API documentation page
│   └── Bing_zh-CN_all.json         # Public data copy for Functions to read
├── update_bing.sh                  # Bash script: Automatically downloads and merges JSON data
├── bing-wallpaper-downloader.bat   # Windows batch script for interactive wallpaper downloading
└── .github/workflows
    └── update-bing.yml             # GitHub Actions daily auto-update workflow
```

## ⚙️ Usage

- Method 1: Download the [bing-wallpaper-downloader.bat](https://github.com/LetterY-idv/Bing-Wallpaper/releases/download/v1.3/bing-wallpaper-downloader.bat) script from the [releases](https://github.com/LetterY-idv/Bing-Wallpaper/releases/) page, run it, and follow the prompts to download images.
- Method 2: Download the `bing-wallpaper-archive-20xx.zip` archive file from the [releases](https://github.com/LetterY-idv/Bing-Wallpaper/releases) page.
- Method 3: Build your own downloader based on the project's JSON data.

## ☁️ Automatic Deployment through Cloudflare Git Integration

This project is deployed by connecting the GitHub repository in the Cloudflare dashboard. GitHub Actions does not run `wrangler deploy`, and no Cloudflare API token is required in GitHub. [Demo site](https://bw.lettery.cc.cd)

### 1. Connect the repository

- Open Cloudflare Dashboard -> `Workers & Pages` -> `Create` -> `Import a repository`.
- Connect GitHub and select the `LetterY-idv/Bing-Wallpaper` repository.
- Select `master` as the production branch.

### 2. Build and deployment settings

- `Root directory`: `/`
- `Build command`: `pnpm install --frozen-lockfile`
- `Deploy command`: use the default deployment configuration Cloudflare derives from `wrangler.jsonc`
- Worker name: `bing-wallpaper`

The repository's `wrangler.jsonc` defines the Worker entry point at `src/index.js`, the `public` static asset directory, and the API routes that run through the Worker first. Cloudflare reads this configuration when building the connected repository.

### 3. Automatic deployment flow

1. The `update-bing.yml` GitHub Actions workflow updates the Bing dataset every day at 00:00 Beijing time.
2. It synchronizes `Bing_zh-CN_all.json` to `public/Bing_zh-CN_all.json`.
3. When data changes, the workflow commits and pushes the update to `master`.
4. Cloudflare detects the repository commit and automatically builds and deploys it.

GitHub Actions only updates the dataset. It does not invoke Wrangler or the Cloudflare API. If deployment fails, review the build logs in the Cloudflare project.

### 4. Post-deployment verification

- Home page: `https://<your-domain>/`
- API documentation: `https://<your-domain>/api-doc/`
- Latest JSON record: `https://<your-domain>/api/latest`
- Latest N JSON records: `https://<your-domain>/api/latest/10`
- Latest image endpoint: `https://<your-domain>/img/latest?res=hd`

## 🧪 Local Preview (Cloudflare Pages)

You can preview the project locally, closely matching the online Cloudflare Pages environment (including `functions/` routing).

### 1. Prerequisites

- Node.js 18+ (with pnpm installed)

### 2. Start Local Server

Run the following in the repository root directory:

```bash
pnpm dev --port 8788
```

### 3. Local Access URLs

- Homepage: `http://127.0.0.1:8788/`
- API Documentation: `http://127.0.0.1:8788/api-doc/`
- Example Endpoint: `http://127.0.0.1:8788/api/latest/1`

To stop the server: `Ctrl + C`

## 📥 Data Access

**GitHub:**

```
# Full dataset
https://raw.githubusercontent.com/LetterY-idv/Bing-Wallpaper/master/Bing_zh-CN_all.json

# Data for specific date
https://raw.githubusercontent.com/LetterY-idv/Bing-Wallpaper/master/2025/12/20.json
# Data for specific month
https://raw.githubusercontent.com/LetterY-idv/Bing-Wallpaper/master/2025/12/all.json
# Data for specific year
https://raw.githubusercontent.com/LetterY-idv/Bing-Wallpaper/master/2025/all.json
```

**jsDelivr:**

```
# Full dataset (CDN accelerated)
https://cdn.jsdelivr.net/gh/LetterY-idv/Bing-Wallpaper/Bing_zh-CN_all.json
# If CDN is not up-to-date, use the link below to purge/reset
https://purge.jsdelivr.net/gh/LetterY-idv/Bing-Wallpaper/Bing_zh-CN_all.json

# Data for specific date (CDN accelerated)
https://cdn.jsdelivr.net/gh/LetterY-idv/Bing-Wallpaper/2025/12/20.json
# Data for specific month (CDN accelerated)
https://cdn.jsdelivr.net/gh/LetterY-idv/Bing-Wallpaper/2025/12/all.json
# Data for specific year (CDN accelerated)
https://cdn.jsdelivr.net/gh/LetterY-idv/Bing-Wallpaper/2025/all.json
```

**Cloudflare API:**

```
https://<your-domain>/api-doc/
```

## ⚠️ Notes

- Some images may fail to download. Please test accordingly.
- BAT files downloaded via Git might have `LF` line endings, which may require manual adjustment. Alternatively, download directly from the project's releases.

## 💖 Acknowledgments

The initial dataset for this project was sourced from [flow2000/bing-wallpaper-api](https://github.com/flow2000/bing-wallpaper-api).
