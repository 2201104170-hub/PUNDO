# ⚡ MoneyFlow - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Prerequisites
- Node.js 16+ installed
- npm 8+ installed

### Step 1: Install Dependencies (30 seconds)
```bash
cd c:\Users\Administrator\Desktop\projects\stitch_moneyflow_financial_dashboard
npm install
```

### Step 2: Start Development Server (10 seconds)
```bash
npm run dev
```

The app will automatically open at **http://localhost:3000**

### Step 3: Explore the App
- Landing page at `/`
- Login page at `/login`
- Dashboard at `/dashboard`
- Click navigation items to explore

---

## 📝 Essential Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript errors
npm run lint         # Check code style
```

---

## 🗺️ Navigation Map

```
Home (/) 
  ↓
Login (/login)
  ↓
Dashboard (/dashboard) ← 🎯 Main App
  ├─ Transactions
  ├─ Debt Tracker
  ├─ Reports
  ├─ Analytics
  └─ Settings
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component |
| `src/routes/router.tsx` | All routes defined here |
| `src/pages/` | Page components |
| `src/components/` | Reusable components |
| `src/types/index.ts` | All TypeScript types |
| `tailwind.config.ts` | Tailwind configuration |

---

## 🎨 Key Features Working

✅ Full routing with React Router  
✅ Dark theme applied everywhere  
✅ Responsive mobile design  
✅ Fully typed TypeScript code  
✅ Reusable component library  
✅ Professional UI/UX  

---

## 🔧 Common Tasks

### Add a New Page
1. Create file in `src/pages/MyPage.tsx`
2. Add route in `src/routes/router.tsx`
3. Add navigation item in sidebar

### Add a New Component
1. Create file in `src/components/MyComponent.tsx`
2. Export in `src/components/index.ts`
3. Import and use

### Update Tailwind Colors
1. Edit `tailwind.config.ts`
2. Colors are automatically available

---

## 📚 Documentation Files

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Comprehensive setup guide
- **MIGRATION.md** - HTML to React conversion details
- **This file** - Quick start reference

---

## 🚀 Ready to Deploy?

```bash
# Build production version
npm run build

# Deploy 'dist' folder to:
# - Vercel
# - Netlify  
# - GitHub Pages
# - Traditional hosting
# - Docker
```

---

## ❓ Troubleshooting

**Port already in use?**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors?**
```bash
npm run type-check
```

---

## 📞 Need Help?

1. Check **README.md** for detailed documentation
2. Check **SETUP_GUIDE.md** for comprehensive guide
3. Check **MIGRATION.md** for conversion details
4. Review source code comments

---

**🎉 Happy coding! Your React app is ready!**
