# Railway Deployment Guide

## Step-by-Step Deployment

### 1. Push Code to GitHub
\`\`\`bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
\`\`\`

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select "backend" as the root directory

### 3. Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

\`\`\`env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-vercel-app.vercel.app
MAX_FILE_SIZE=5242880
\`\`\`

### 4. Get Your Railway URL
After deployment, Railway will provide a URL like:
`https://your-app-name.up.railway.app`

### 5. Update Frontend Configuration
Use this Railway URL as your `NEXT_PUBLIC_API_URL` in Vercel.

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Use as MONGODB_URI

### Option 2: Railway MongoDB
1. In Railway, add MongoDB service
2. Connect to your backend
3. Use provided connection string

## Important Notes
- Railway auto-detects Node.js projects
- No Dockerfile needed
- Automatic deployments on git push
- Built-in SSL certificates
- Environment variables are secure
