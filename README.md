# Personal Portfolio Website

A modern, fast personal portfolio built with **React**, **TypeScript**, and **Vite**. Deployed to GitHub Pages with automatic security updates via Dependabot.

## ✨ Features

- ⚡ **Lightning-fast** - Vite dev server with instant HMR
- 🎨 **Material Design UI** - Built with Material-UI
- 📱 **Fully responsive** - Mobile-first design
- 🔒 **Type-safe** - Full TypeScript support
- 🚀 **Automated deployments** - GitHub Actions CI/CD
- 📦 **Security compliant** - Automatic dependency updates

## 🚀 Quick Start

### Prerequisites
- Node 24+ (Vite requirement)
- npm 9+

### Setup & Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

## 🏗️ Tech Stack

- **React** 18.3 - UI library
- **React Router** v7 - Client-side routing
- **Material-UI** v6 - UI components (Emotion-based styling with Material Design 3)
- **TypeScript** - Type safety
- **Vite** 7.3 - Build tool & dev server
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

## 🌐 Deployment

### Automatic (via GitHub Actions)
Push to `development` branch → GitHub Actions builds → Deploys to `main` branch → Live on GitHub Pages

### Manual
```bash
npm run deploy
```

### Note on Routing
- 404.html handles SPA routing for client-side navigation
- Works seamlessly with React Router

## 📁 Project Structure

```
src/
  containers/     # Page components
  components/     # Reusable UI components
  assets/         # Images, data, theme
  main.tsx        # Entry point
public/           # Static files (icons, PDFs, manifest)
```

## 🔒 Security & Updates

This project uses **Vite** instead of Create React App, enabling:
- ✅ Automatic dependency updates via Dependabot
- ✅ Zero version conflicts
- ✅ Always-current security patches
- ✅ No blocked updates

## 🛠️ Development

### Type Checking
```bash
npx tsc --noEmit
```

## 📦 Build Output

- Output directory: `build/`
- 404.html automatically created for GitHub Pages routing
- Static assets (PDFs, icons, manifest) copied automatically

## 🔄 Recent Migrations

### MUI 5 → 6 (December 2025)
- Updated Material-UI from v5 to v6 with Material Design 3
- Replaced deprecated `react-sticky` with native CSS `position: sticky`
- Replaced `react-visibility-sensor` with Intersection Observer API
- Fixed MUI v6 compatibility issues (removed deprecated `button` prop from ListItem)
- Maintained backward compatibility with existing `makeStyles` API
- All components remain functional without breaking changes

## 🚀 Performance

- **Build time**: ~2-3 seconds (Vite is fast!)
- **Dev startup**: <2 seconds
- **Bundle size**: ~422KB (gzipped: ~130KB)

## 🐳 Docker

### Docker Compose
```bash
docker-compose up -d    # Start
docker-compose stop     # Stop
```

### Docker Image
```bash
docker build -t tsznokwonggithubio_web .
docker run -dp 3000:3000 tsznokwonggithubio_web
```
