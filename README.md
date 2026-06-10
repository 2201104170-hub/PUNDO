# MoneyFlow - React + TypeScript Financial Dashboard

A modern, production-ready financial dashboard application built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern Stack**: React 18 + TypeScript + Vite
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Financial Dashboard**: Comprehensive financial overview
- **Transaction Management**: Track all your transactions
- **Debt Tracker**: Manage and monitor outstanding debts
- **Financial Reports**: Generate detailed financial reports
- **Analytics**: Advanced spending analytics and insights
- **Settings**: User profile and preference management
- **Dark Mode**: Beautiful dark theme throughout the app
- **Type-Safe**: Fully typed TypeScript codebase
- **Component Library**: Reusable, well-structured components

## 📋 Requirements

Before you begin, ensure you have the following installed:

- Node.js 16+ (Download from [nodejs.org](https://nodejs.org/))
- npm 8+ or yarn 3+
- Git (for version control)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

### 2. Start Development Server

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will open automatically at `http://localhost:3000`.

### 3. Build for Production

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

This creates an optimized production build in the `dist` folder.

### 4. Preview Production Build

```bash
npm run preview
```

Or with yarn:

```bash
yarn preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── DashboardCard.tsx
│   └── index.ts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── DebtTracker.tsx
│   ├── Reports.tsx
│   ├── Analytics.tsx
│   ├── Settings.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   └── index.ts
├── layouts/            # Layout components
│   └── DashboardLayout.tsx
├── routes/             # Routing configuration
│   └── router.tsx
├── styles/             # Global styles
│   └── globals.css
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main App component
└── main.tsx            # Application entry point
```

## 🔀 Routes

The application includes the following routes:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Landing page with features overview |
| `/login` | Login | User login page |
| `/dashboard` | Dashboard | Main financial dashboard |
| `/transactions` | Transactions | Transaction management |
| `/debt-tracker` | Debt Tracker | Debt management interface |
| `/reports` | Reports | Financial reports |
| `/analytics` | Analytics | Advanced analytics |
| `/settings` | Settings | User settings and preferences |

## 🎨 Design System

The application uses a custom color system with Material Design 3 principles:

### Colors (Dark Theme)

- **Primary**: `#b4c5ff` - Main brand color
- **Secondary**: `#4edea3` - Accent color
- **Tertiary**: `#ffb95f` - Additional accent
- **Background**: `#11131b` - Main background
- **Surface**: `#1d1f27` - Card and container background
- **Error**: `#ffb4ab` - Error states

### Typography

- **Headlines**: Inter font family
- **Body**: Inter font family  
- **Labels**: Geist font family
- **Numeric Display**: Geist font family

### Icons

Material Symbols are used throughout the application. Icons are fetched from Google Fonts CDN.

## 💻 Development

### Running Tests

```bash
# Note: Configure your testing setup
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

### Code Style

The project uses ESLint with TypeScript support for consistent code style.

## 📦 Dependencies

### Production

- **react**: ^18.2.0 - UI library
- **react-dom**: ^18.2.0 - React DOM renderer
- **react-router-dom**: ^6.20.0 - Client-side routing

### Development

- **@vitejs/plugin-react**: ^4.2.1 - Vite React plugin
- **@typescript-eslint/eslint-plugin**: ^6.14.0 - TypeScript linting
- **tailwindcss**: ^3.4.1 - Utility-first CSS
- **typescript**: ^5.3.3 - TypeScript compiler
- **vite**: ^5.0.8 - Build tool

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.cjs` - ESLint configuration

## 🎯 Component Usage Examples

### Button Component

```typescript
import { Button } from './components';

<Button variant="primary" size="md">
  Click me
</Button>
```

### Card Component

```typescript
import { Card } from './components';

<Card title="My Card">
  <p>Card content goes here</p>
</Card>
```

### Input Component

```typescript
import { Input } from './components';

<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  onChange={(e) => setEmail(e.target.value)}
/>
```

## 🚀 Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Connect your repo to Netlify for automatic deployments
```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t moneyflow .
docker run -p 3000:3000 moneyflow
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=MoneyFlow
```

Access in your code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For support, open an issue in the repository or contact the development team.

---

**Happy Coding! 💰**
