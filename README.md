# 🌍 Global IPTV - Futuristic World TV Platform

A cutting-edge, interactive global IPTV streaming platform featuring a stunning 3D globe interface, real-time channel browsing, and professional video streaming capabilities.

## ✨ Features

### 🎯 Core Features
- **Interactive 3D Globe**: Click any country to explore TV channels
- **10,000+ Channels**: From 180+ countries worldwide
- **Real-time Streaming**: HLS.js powered video player
- **Advanced Search**: Filter by country, category, and language
- **Responsive Design**: Perfect on mobile and desktop
- **Dark Mode**: Beautiful light/dark theme toggle

### 🎨 Design & UX
- **Futuristic Interface**: Neon colors and glass-morphism effects
- **Smooth Animations**: Framer Motion powered transitions
- **Professional Video Player**: Custom controls and loading states
- **Mobile Optimized**: Touch-friendly responsive design

### 🔧 Technical Features
- **Real API Integration**: IPTV-ORG API for live channel data
- **Supabase Backend**: Database and authentication
- **Admin Panel**: Complete channel management system
- **TypeScript**: Full type safety
- **Modern Stack**: React 18, Vite, Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd global-iptv
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Add your Supabase credentials (optional for demo)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

### Manual Build
```bash
npm run build
```

The `dist` folder contains the production build ready for any static hosting service.

## 📱 Usage

### For Users
1. **Explore the Globe**: Click on any country to see available channels
2. **Browse Channels**: Use the sidebar to search and filter channels
3. **Watch Live TV**: Click any channel to start streaming
4. **Save Favorites**: Heart channels to save them for later

### For Admins
1. **Access Admin Panel**: Click your profile → Admin Panel
2. **Manage Channels**: Add, edit, or remove channels
3. **Monitor Stats**: View platform statistics and analytics
4. **User Management**: Handle user accounts and permissions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Three.js** - 3D globe rendering
- **React Router** - Client-side routing

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Robust database
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates

### Video & Streaming
- **HLS.js** - HTTP Live Streaming
- **Video.js** - Professional video player
- **Multiple formats** - HLS, MP4, YouTube, Twitch

### APIs & Data
- **IPTV-ORG API** - Live channel data
- **REST APIs** - Channel management
- **Real-time sync** - Auto-updating content

## 📊 Project Structure

```
src/
├── components/          # React components
│   ├── Globe3D.tsx     # 3D globe interface
│   ├── VideoPlayer.tsx # Video streaming
│   ├── ChannelSidebar.tsx # Channel browser
│   ├── AdminPanel.tsx  # Admin interface
│   └── ...
├── services/           # API services
│   └── apiService.ts   # IPTV API integration
├── store/              # State management
│   └── useStore.ts     # Zustand store
├── types/              # TypeScript types
├── data/               # Mock data
└── lib/                # Utilities
```

## 🔐 Security Features

- **Row Level Security** - Database-level access control
- **Authentication** - Supabase Auth integration
- **Admin Protection** - Role-based access control
- **API Rate Limiting** - Prevent abuse
- **CORS Configuration** - Secure cross-origin requests

## 🎯 Performance Optimizations

- **Code Splitting** - Lazy loading components
- **Image Optimization** - WebP format support
- **Caching Strategy** - API response caching
- **Bundle Optimization** - Tree shaking and minification
- **CDN Ready** - Static asset optimization

## 🌟 Advanced Features

### 3D Globe
- Interactive country selection
- Smooth rotation and zoom
- Real-time country data
- Hover effects and tooltips

### Video Player
- HLS streaming support
- Custom controls
- Fullscreen mode
- Volume control
- Loading states

### Admin Dashboard
- Channel management
- User analytics
- System monitoring
- API configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IPTV-ORG** - For providing free IPTV channel data
- **Supabase** - For the excellent backend platform
- **Three.js** - For 3D graphics capabilities
- **Framer Motion** - For beautiful animations

## 📞 Support

For support, email support@globaliptv.com or join our Discord community.

---

**Built with ❤️ for the global streaming community**