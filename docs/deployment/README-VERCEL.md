# VALORANT HUB - Vercel Deployment

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Valorant-HUB)

## 📋 Deployment Steps

### 1. Prepare Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Environment Variables (Optional)
If you have any environment variables, add them in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add your variables

## 🛠️ Build Configuration

The project is configured with:
- **Vite** as build tool
- **React Router** for client-side routing
- **Material-UI** for components
- **TypeScript** for type safety

## 📁 Project Structure
```
Valorant-HUB-Final/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── MapsPage.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── VCTPage.tsx
│   │   └── ProfilePage.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── dist/ (generated)
├── vercel.json
├── vite.config.ts
└── package.json
```

## 🎮 Features

- **Interactive Maps** - Detailed VALORANT maps with callouts
- **Agent Guides** - Comprehensive agent information
- **VCT Esports** - Tournament and team information
- **Player Profile** - Stats and progress tracking
- **Responsive Design** - Works on all devices

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Responsive

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI** - Component library
- **React Router** - Client-side routing

## 🌟 Performance

- Optimized bundle size
- Lazy loading for better performance
- Cached assets for faster loading
- SEO-friendly routing

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for VALORANT players