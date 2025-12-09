# 🚀 Nexus Production Deployment Guide

Complete guide to deploy Nexus on **Vercel (Frontend)** + **Render (Backend)** with proper user GitHub OAuth authentication.

## 📋 **Pre-Deployment Checklist**

### **1. GitHub OAuth App Setup**
Create a GitHub OAuth app that allows ANY user to authenticate:

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create new OAuth App:
   ```
   Application name: Nexus Platform
   Homepage URL: https://your-app-name.vercel.app
   Authorization callback URL: https://your-app-name.vercel.app/api/auth/callback/github
   Application description: Blockchain-backed platform for trustless open-source collaboration
   ```
3. **Save Client ID and Client Secret** (you'll need these for Vercel)

### **2. Get Required API Keys**
- **Google Gemini API Key**: [Get from Google AI Studio](https://makersuite.google.com/app/apikey)
- **WalletConnect Project ID**: [Get from WalletConnect Cloud](https://cloud.walletconnect.com/)
- **GitHub Personal Token** (Optional): [Generate with minimal permissions](https://github.com/settings/tokens)

---

## 🎯 **Backend Deployment (Render)**

### **Step 1: Deploy to Render**

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `adk-nexus` directory as root

2. **Configure Service**:
   ```
   Name: nexus-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: adk-nexus
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=5000
   GOOGLE_API_KEY=your_google_gemini_api_key
   GITHUB_TOKEN=your_github_token_optional
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - **Copy the backend URL** (e.g., `https://nexus-backend.onrender.com`)

### **Step 2: Verify Backend**
- Visit `https://your-backend-url.onrender.com/health`
- Should return: `{"status": "healthy", "service": "ADK-TS Nexus Repository Analysis API"}`

---

## 🌐 **Frontend Deployment (Vercel)**

### **Step 1: Deploy to Vercel**

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root

2. **Configure Project**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

### **Step 2: Set Environment Variables**

In Vercel Dashboard → Project Settings → Environment Variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_generated_secret_key

# GitHub OAuth (from Step 1)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC381B1dd37B82810356EdD61Cb584e3228457aC7

# Backend API URL (from Render deployment)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Self.xyz (Optional)
NEXT_PUBLIC_SELF_APP_NAME=Nexus
NEXT_PUBLIC_SELF_SCOPE=
NEXT_PUBLIC_SELF_ENDPOINT=
```

### **Step 3: Generate NextAuth Secret**
```bash
# Run this command to generate a secure secret
openssl rand -base64 32
```

### **Step 4: Deploy**
- Click "Deploy"
- Wait for deployment to complete
- **Copy the frontend URL** (e.g., `https://your-app-name.vercel.app`)

---

## 🔄 **Update Backend CORS**

After frontend deployment, update backend environment variables in Render:

```bash
FRONTEND_URL=https://your-app-name.vercel.app
```

Redeploy the backend service for CORS changes to take effect.

---

## ✅ **Post-Deployment Verification**

### **1. Test Backend Health**
```bash
curl https://your-backend-url.onrender.com/health
```

### **2. Test Frontend**
- Visit `https://your-app-name.vercel.app`
- Click "Connect GitHub"
- Verify OAuth flow works
- Test repository analysis

### **3. Test Full Flow**
1. User visits frontend
2. Clicks "Connect GitHub"
3. Authorizes OAuth app
4. Accesses their repositories
5. Analyzes a repository
6. Creates GitHub issues

---

## 🔧 **Environment Variables Reference**

### **Frontend (Vercel)**
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | ✅ | Your Vercel app URL |
| `NEXTAUTH_SECRET` | ✅ | Generated secret key |
| `GITHUB_CLIENT_ID` | ✅ | OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | ✅ | OAuth app client secret |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ | WalletConnect project ID |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | ✅ | Smart contract address |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL |

### **Backend (Render)**
| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ✅ | Set to `5000` |
| `GOOGLE_API_KEY` | ✅ | Google Gemini API key |
| `FRONTEND_URL` | ✅ | Your Vercel app URL |
| `GITHUB_TOKEN` | ❌ | Optional server token |

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **CORS Errors**
- Ensure `FRONTEND_URL` is set correctly in backend
- Check Render logs for CORS configuration

#### **OAuth Not Working**
- Verify GitHub OAuth app callback URL matches Vercel URL
- Check `NEXTAUTH_URL` matches your domain exactly

#### **Backend Not Responding**
- Check Render service logs
- Verify all required environment variables are set
- Test health endpoint

#### **Build Failures**
- Frontend: Use `npm install --legacy-peer-deps`
- Backend: Ensure all dependencies are in `package.json`

### **Debugging Commands**

```bash
# Check Render logs
render logs --service nexus-backend

# Test backend locally
cd adk-nexus
npm run server

# Test frontend locally
cd frontend
npm run dev
```

---

## 🔒 **Security Best Practices**

### **Environment Variables**
- ✅ Never commit secrets to repository
- ✅ Use platform environment variable systems
- ✅ Regenerate secrets if compromised

### **OAuth Security**
- ✅ Use HTTPS in production
- ✅ Verify callback URLs are correct
- ✅ Monitor OAuth app usage

### **API Security**
- ✅ Validate user tokens on backend
- ✅ Implement rate limiting
- ✅ Log security events

---

## 📊 **Monitoring & Maintenance**

### **Health Checks**
- Backend: `https://your-backend-url.onrender.com/health`
- Frontend: Monitor Vercel deployment status

### **Logs**
- **Render**: Service logs in dashboard
- **Vercel**: Function logs in dashboard

### **Updates**
- **Backend**: Auto-deploys on git push
- **Frontend**: Auto-deploys on git push

---

## 🎉 **Success!**

Your Nexus platform is now live with:
- ✅ **Frontend**: `https://your-app-name.vercel.app`
- ✅ **Backend**: `https://your-backend-url.onrender.com`
- ✅ **User GitHub OAuth**: Any user can connect their GitHub
- ✅ **Repository Analysis**: Works with any accessible repository
- ✅ **Blockchain Integration**: Connected to Sepolia testnet

Users can now visit your platform, connect their GitHub accounts, and use Nexus for trustless open-source collaboration!

---

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review platform logs (Vercel/Render dashboards)
3. Verify all environment variables are set correctly
4. Test the OAuth flow step by step
