# 🚀 Quest Tracker Deployment Guide

## 📋 Overview

This guide walks you through deploying your Quest Tracker application to production using modern hosting platforms. The deployment is configured for **Netlify** (frontend) and **Railway** (backend) with automated CI/CD pipelines.

## 🎯 Prerequisites

- Node.js 18+ and npm 9+
- GitHub account with repository access
- Netlify account (free tier sufficient)
- Railway account (free tier sufficient)

## 📁 Project Structure

```
activity-12-deployment/
├── frontend/
│   ├── netlify.toml          # Netlify configuration
│   ├── .env.example          # Frontend environment variables
│   └── build/                # Production build output
├── backend/
│   ├── railway.toml          # Railway configuration
│   ├── .env.example          # Backend environment variables
│   └── server.js             # Express server
├── scripts/
│   ├── deploy-frontend.js    # Frontend deployment script
│   ├── deploy-backend.js     # Backend deployment script
│   └── health-check.js       # Health monitoring
├── .github/workflows/
│   └── deploy.yml            # CI/CD pipeline
└── package.json              # Deployment scripts
```

## 🏗️ Deployment Architecture

### Frontend (Netlify)
- **Static Site Hosting**: Optimized for React applications
- **Global CDN**: Automatic content delivery network
- **HTTPS**: Free SSL certificates
- **Git Integration**: Automatic deployments on push
- **Environment Variables**: Secure configuration management

### Backend (Railway)
- **Container Deployment**: Docker-based hosting
- **Auto-scaling**: Automatic resource management
- **Database Integration**: Built-in PostgreSQL support
- **Health Monitoring**: Automated health checks
- **Custom Domains**: Professional API URLs

## 📝 Step-by-Step Deployment

### TODO 1: Set Up Deployment Accounts

#### Netlify Setup
1. **Create Account**: Visit [netlify.com](https://netlify.com) and sign up
2. **Connect GitHub**: Authorize Netlify to access your GitHub repository
3. **Install CLI** (optional):
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

#### Railway Setup
1. **Create Account**: Visit [railway.app](https://railway.app) and sign up
2. **Connect GitHub**: Authorize Railway to access your GitHub repository
3. **Install CLI** (optional):
   ```bash
   npm install -g @railway/cli
   railway login
   ```

### TODO 2: Configure Environment Variables

#### Frontend Variables (Netlify)
Set these in **Netlify Dashboard > Site settings > Build & deploy > Environment**:

```bash
# Required
REACT_APP_API_URL=https://your-api.railway.app
REACT_APP_API_KEY=your-production-api-key
REACT_APP_ENVIRONMENT=production

# Optional but recommended
REACT_APP_GOOGLE_ANALYTICS=GA-XXXXXXXXX
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### Backend Variables (Railway)
Set these in **Railway Dashboard > Variables**:

```bash
# Required
NODE_ENV=production
PORT=3000

# Security (generate secure values)
JWT_SECRET=your-super-secret-jwt-key-here
API_RATE_LIMIT=1000
SESSION_SECRET=your-session-secret-here

# Optional
DATABASE_URL=postgresql://user:pass@host:port/db
SENTRY_DSN=your-backend-sentry-dsn
```

#### Generate Secure Secrets
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### TODO 3: Deploy Backend to Railway

#### Manual Deployment
1. **Create Project**: Go to Railway dashboard → "New Project"
2. **Connect Repo**: Select "Deploy from GitHub repo"
3. **Configure Root**: Set `backend` as root directory
4. **Set Variables**: Add environment variables from above
5. **Deploy**: Railway automatically builds and deploys

#### CLI Deployment
```bash
# From project root
npm run deploy:backend
```

#### Verify Deployment
```bash
# Test health endpoint
curl https://your-api.railway.app/health

# Test API with key
curl "https://your-api.railway.app/api/quests?api_key=your-production-api-key"
```

### TODO 4: Deploy Frontend to Netlify

#### Manual Deployment
1. **Create Site**: Netlify dashboard → "Add new site" → "Import an existing project"
2. **Connect GitHub**: Select your repository
3. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
4. **Environment Variables**: Add frontend variables
5. **Deploy**: Netlify builds and deploys automatically

#### CLI Deployment
```bash
# From project root
npm run deploy:frontend
```

#### Update Netlify Configuration
Edit `frontend/netlify.toml` to point to your Railway API:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-api.railway.app/api/:splat"
  status = 200
```

### TODO 5: Set Up Health Monitoring

#### Automated Health Checks
```bash
# Run comprehensive health checks
npm run health-check

# With custom URLs
npm run health-check https://your-app.netlify.app https://your-api.railway.app
```

#### Monitor These Metrics
- **Frontend Accessibility**: Site loads without errors
- **Backend Health**: `/health` endpoint responds
- **API Endpoints**: All routes return expected data
- **Authentication**: API key validation works
- **Performance**: Response times under thresholds
- **Error Handling**: Proper 404 and error responses

#### Set Up Uptime Monitoring
1. **UptimeRobot**: Free monitoring service
   - Monitor frontend URL
   - Monitor backend `/health` endpoint
   - Set up alerts for downtime

2. **Railway Monitoring**: Built-in health checks
   - Automatic restarts on failure
   - Log aggregation
   - Performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The `.github/workflows/deploy.yml` file provides:

- **Automated Testing**: Runs tests on every push
- **Build Validation**: Creates production builds
- **Staging Deployment**: Deploy `develop` branch to staging
- **Production Deployment**: Deploy `main` branch with approval
- **Health Checks**: Automated post-deployment validation
- **Rollback Support**: Manual rollback capability

### Required GitHub Secrets
Set these in **GitHub Repository > Settings > Secrets**:

```bash
NETLIFY_AUTH_TOKEN=your-netlify-auth-token
NETLIFY_SITE_ID=your-production-site-id
NETLIFY_SITE_ID_STAGING=your-staging-site-id
RAILWAY_TOKEN=your-railway-api-token
RAILWAY_PROJECT_ID=your-production-project-id
RAILWAY_PROJECT_ID_STAGING=your-staging-project-id
SLACK_WEBHOOK=your-slack-webhook-url
LHCI_GITHUB_APP_TOKEN=your-lighthouse-ci-token
```

### Pipeline Triggers
- **Push to develop**: Automated staging deployment
- **Push to main**: Requires approval, then production deployment
- **Manual trigger**: Emergency deployments and rollbacks

## 🧪 Testing Your Deployment

### Pre-Deployment Checklist
- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] Security audit passes
- [ ] Build completes successfully
- [ ] Health endpoints work locally

### Post-Deployment Verification
- [ ] Frontend loads at production URL
- [ ] All pages navigate correctly
- [ ] API calls reach backend successfully
- [ ] Authentication flows work
- [ ] Error messages display properly
- [ ] Mobile responsiveness verified
- [ ] HTTPS shows padlock icon
- [ ] Performance is acceptable (< 3s load)

### Automated Testing Commands
```bash
# Run full test suite
npm test

# Run health checks
npm run health-check

# Test specific endpoints
curl -w "Time: %{time_total}s\n" https://your-api.railway.app/health

# Load testing
for i in {1..10}; do curl -s "https://your-api.railway.app/health" & done; wait
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
- **Node.js Version**: Ensure Node.js 18+ in both platforms
- **Dependencies**: Check `package-lock.json` consistency
- **Environment Variables**: Verify all required variables are set
- **Memory Limits**: Increase build memory if needed

#### Runtime Errors
- **CORS Issues**: Check Netlify redirects configuration
- **API Connectivity**: Verify Railway service is running
- **Database Connections**: Check database URL and credentials
- **Rate Limiting**: Monitor API rate limit settings

#### Performance Issues
- **Bundle Size**: Analyze with `npm run analyze` (if available)
- **Response Times**: Monitor API endpoint performance
- **CDN Caching**: Verify static asset caching
- **Database Queries**: Optimize slow database operations

### Debugging Commands
```bash
# Check deployment logs
netlify logs --site=your-site-id
railway logs

# Test API connectivity
curl -I https://your-api.railway.app/health

# Validate SSL certificate
openssl s_client -connect your-domain.com:443

# Check DNS propagation
nslookup your-domain.com
```

## 🎨 Advanced Features

### Custom Domains
#### Netlify Frontend
1. **Domain Settings**: Site settings → Domain management
2. **Add Domain**: Enter your custom domain
3. **DNS Configuration**:
   ```
   Type: CNAME
   Name: @
   Value: your-site.netlify.app
   ```

#### Railway Backend
1. **Networking**: Project settings → Networking
2. **Custom Domain**: Add your API domain
3. **DNS Configuration**:
   ```
   Type: CNAME
   Name: api
   Value: your-project.railway.app
   ```

### Database Integration
```bash
# Add PostgreSQL to Railway
railway add postgresql

# Update environment variables
DATABASE_URL=postgresql://user:pass@host:port/db
```

### Error Tracking
```bash
# Install Sentry for error monitoring
npm install @sentry/node @sentry/react

# Configure in both frontend and backend
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Performance Monitoring
```bash
# Install Lighthouse CI
npm install -g @lhci/cli@0.12.x

# Run performance audits
lhci autorun
```

## 📊 Success Metrics

### Key Performance Indicators
- **Uptime**: > 99.9%
- **Response Time**: < 200ms for API endpoints
- **Page Load Speed**: < 3 seconds
- **Error Rate**: < 0.1%
- **Build Success Rate**: 100%

### Monitoring Dashboard
Set up monitoring for:
- Server response times
- Error rates and exceptions
- User activity and engagement
- Database performance
- Security incidents

## 🎉 Completion Checklist

### Deployment Complete When:
- [ ] Frontend deployed to Netlify with HTTPS
- [ ] Backend deployed to Railway and responding
- [ ] Environment variables configured correctly
- [ ] Health checks passing for all endpoints
- [ ] API calls work between frontend and backend
- [ ] No console errors on production site
- [ ] Mobile responsiveness verified
- [ ] CI/CD pipeline working
- [ ] Monitoring and alerts configured
- [ ] Documentation updated

### Final Verification
```bash
# Run final health check
npm run health-check

# Test production URLs
curl https://your-app.netlify.app
curl https://your-api.railway.app/health
```

## 🆘 Support Resources

### Platform Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Community Support
- [Netlify Community](https://community.netlify.com/)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Support](https://support.github.com/)

### Platform Status
- [Netlify Status](https://www.netlifystatus.com/)
- [Railway Status](https://status.railway.app/)

---

**🎊 Congratulations!** Your Quest Tracker is now live in production with professional-grade deployment, monitoring, and CI/CD pipelines!
