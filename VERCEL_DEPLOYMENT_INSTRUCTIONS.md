# 🚀 Vercel Deployment Instructions

## ✅ **Fixed Issues**
- Removed environment variable references from `vercel.json`
- Environment variables must be set in Vercel Dashboard, not in config file
- Fixed API rewrites to use correct environment variable names

## 📋 **Step-by-Step Vercel Deployment**

### **1. Connect Repository to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set Root Directory to `frontend`
5. Framework Preset: Next.js (auto-detected)

### **2. Configure Environment Variables**
In Vercel Dashboard → Project Settings → Environment Variables, add these:

#### **Required Environment Variables:**
```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=wATIAUyLXyDOmiwdqCBwvVnNV6NYlRwe1aSVWyw+Tg0=

# GitHub OAuth App (create at: https://github.com/settings/applications/new)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# WalletConnect (get from: https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Smart Contract (Sepolia Testnet)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC381B1dd37B82810356EdD61Cb584e3228457aC7

# Backend API URL (update after Render deployment)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Self.xyz Integration (Optional)
NEXT_PUBLIC_SELF_APP_NAME=Nexus
NEXT_PUBLIC_SELF_SCOPE=
NEXT_PUBLIC_SELF_ENDPOINT=
```

### **3. GitHub OAuth App Setup**
1. Go to: https://github.com/settings/applications/new
2. **Application name**: `Nexus Platform`
3. **Homepage URL**: `https://your-app-name.vercel.app`
4. **Authorization callback URL**: `https://your-app-name.vercel.app/api/auth/callback/github`
5. Copy the Client ID and Client Secret to Vercel environment variables

### **4. Deploy**
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

### **5. Update URLs After Deployment**
After both frontend and backend are deployed:
1. Update `NEXTAUTH_URL` in Vercel with your actual domain
2. Update `NEXT_PUBLIC_API_URL` in Vercel with your Render backend URL
3. Update GitHub OAuth app URLs with production domains

## 🔧 **Troubleshooting**

### **Common Issues:**
1. **Build Fails**: Check that Root Directory is set to `frontend`
2. **Environment Variables**: Set them in Vercel Dashboard, not in code
3. **OAuth Errors**: Ensure callback URLs match exactly
4. **API Errors**: Verify backend URL is correct and accessible

### **Build Configuration:**
- ✅ Framework: Next.js
- ✅ Root Directory: `frontend`
- ✅ Build Command: `npm run build` (auto-detected)
- ✅ Install Command: `npm install --legacy-peer-deps`

## 🎉 **Success!**
Your Nexus platform should now be deployed successfully on Vercel with proper environment variable configuration!
