# VisionXaid Backend Deployment Guide

## Prerequisites
- Your backend code pushed to GitHub
- Your frontend deployed URL (e.g., https://visionxaid.vercel.app)
- Model file `v50.keras` in the `backend/models/` directory

---

## Option 1: Deploy to Render.com (Recommended - Free Tier)

### Step 1: Prepare Your Repository
1. Make sure all deployment files are committed:
   ```bash
   cd backend
   git add Dockerfile .dockerignore render.yaml
   git commit -m "Add deployment configuration"
   git push
   ```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up or log in with your GitHub account

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `VisionXaid` repository
4. Configure the service:
   - **Name**: `visionxaid-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Plan**: `Free` (or choose paid for better performance)

### Step 4: Add Environment Variables
In the "Environment" section, add:
- **Key**: `ALLOWED_ORIGINS`
- **Value**: `https://your-frontend-url.com,http://localhost:5173`
  (Replace with your actual frontend URL, keep localhost for testing)

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes for first deploy)
3. Your backend will be available at: `https://visionxaid-backend.onrender.com`

### Step 6: Update Frontend API URL
Update your frontend's API configuration to point to:
`https://visionxaid-backend.onrender.com`

---

## Option 2: Deploy to Railway.app

### Step 1: Install Railway CLI (optional)
```powershell
iwr https://railway.app/install.ps1 | iex
```

### Step 2: Deploy via Dashboard
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your VisionXaid repository
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables
- `ALLOWED_ORIGINS`: Your frontend URL
- `PORT`: `8000` (Railway will override this)

---

## Option 3: Deploy to Google Cloud Run

### Prerequisites
- Google Cloud account
- `gcloud` CLI installed

### Steps
```powershell
# Navigate to backend
cd backend

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy visionxaid-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ALLOWED_ORIGINS=https://your-frontend-url.com

```

---

## Important Notes

### Model File Size
⚠️ The `v50.keras` model file needs to be included in your deployment. If it's large:

**For Render/Railway**: 
- Ensure the file is tracked in git: `git lfs track "*.keras"`
- Or use environment variable to download from cloud storage

**For GitHub**:
```powershell
# Install Git LFS
git lfs install
git lfs track "*.keras"
git add .gitattributes backend/models/v50.keras
git commit -m "Add model with Git LFS"
git push
```

### Cold Starts
Free tiers on Render/Railway spin down after inactivity. First request may take 30-60 seconds.

### Memory Requirements
TensorFlow models require significant memory (512MB-1GB). Consider:
- Render: Use paid plan for 512MB+ RAM
- Railway: Starts with 512MB
- Cloud Run: Set memory to 1GB minimum

---

## Testing Your Deployment

After deployment, test these endpoints:

```powershell
# Health check
curl https://your-backend-url.com/health

# Root endpoint
curl https://your-backend-url.com/
```

---

## Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check browser console for exact error

### Model Loading Errors
- Verify `models/v50.keras` exists in repository
- Check deployment logs for file path errors

### Memory/Timeout Errors
- Upgrade to paid plan with more RAM
- Increase timeout settings in deployment platform

---

## Cost Estimates

- **Render Free**: $0/month (spins down after inactivity)
- **Render Starter**: $7/month (always on, 512MB RAM)
- **Railway**: ~$5/month (usage-based)
- **Cloud Run**: Pay per request (~$0.01-1/month for low traffic)

---

## Next Steps

1. Deploy backend to chosen platform
2. Note your backend URL (e.g., `https://visionxaid-backend.onrender.com`)
3. Update frontend API configuration with backend URL
4. Test the integration
5. Monitor logs for any errors

Need help with any specific step? Let me know!
