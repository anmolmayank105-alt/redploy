# Alumni Management System - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository
Make sure your repository has the following structure:
```
redploy/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root package.json
├── vercel.json      # Vercel configuration
└── .env.example     # Environment variables template
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

#### Option B: Using Vercel Website
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set the following configuration:
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install --prefix client && npm install --prefix server`

### 3. Environment Variables
Add these environment variables in Vercel dashboard:

```
MONGO_URI=mongodb+srv://starunkumarainds2024_db_user:2fgmUJliWHq9YUIl@cluster0.bc9ss4x.mongodb.net/alumni_db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random_for_production_use
JWT_EXPIRE=30d
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-vercel-app.vercel.app
```

### 4. Update CLIENT_URL
After deployment, update the `CLIENT_URL` environment variable with your actual Vercel domain.

## 🔧 Configuration Files

### vercel.json
- Configures how Vercel builds and routes your application
- Handles both frontend (static) and backend (serverless functions)

### Root package.json
- Manages dependencies for the entire project
- Provides unified scripts for development and deployment

## 🌐 API Endpoints
After deployment, your API will be available at:
- `https://your-app.vercel.app/api/*`

## 🎯 Features
- **Frontend**: React with Vite, modern login UI with animations
- **Backend**: Express.js API with MongoDB integration
- **Database**: 1,420 users with detailed alumni profiles
- **Authentication**: JWT-based login system
- **Alumni Network**: College-specific alumni browsing

## 🔑 Demo Credentials
- **Email**: testuser@example.com
- **Password**: password123

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CLIENT_URL environment variable
2. **Database Connection**: Verify MONGO_URI in environment variables
3. **Build Failures**: Ensure all dependencies are listed in package.json files
4. **API Routes Not Working**: Check vercel.json routing configuration

### Local Development:
```bash
# Install dependencies
npm run install:all

# Run development servers
npm run dev
```

## 📞 Support
For deployment issues, check:
- Vercel deployment logs
- Browser console for frontend errors
- Environment variables configuration