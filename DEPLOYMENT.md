# 🚀 MediConnect Deployment Guide

This guide provides step-by-step instructions for deploying the MediConnect application to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] MongoDB Atlas cluster configured
- [ ] Cloudinary account set up
- [ ] Environment variables ready
- [ ] Domain names (optional)
- [ ] SSL certificates (handled by platforms)

## 🗄️ Database Setup (Production)

### MongoDB Atlas Production Setup

1. **Upgrade to Production Cluster** (Optional)
   - Consider upgrading from M0 to M2+ for better performance
   - Enable backup and monitoring

2. **Configure Production Network Access**
   - Remove 0.0.0.0/0 access
   - Add specific IP ranges for your deployment platforms
   - Add your development IP for maintenance

3. **Create Production Database User**
   - Create a dedicated production user
   - Use strong password
   - Grant minimal required permissions

4. **Enable Advanced Security** (Recommended)
   - Enable MongoDB Atlas App Services
   - Set up IP allowlist
   - Enable audit logging

## ☁️ Cloudinary Production Setup

### 1. Upgrade Account (Optional)
- Consider paid plan for higher limits
- Enable advanced transformations
- Set up backup storage

### 2. Configure Security
- Set up upload presets
- Configure allowed file types
- Set file size limits

### 3. Optimize for Production
- Enable automatic image optimization
- Configure CDN settings
- Set up backup and recovery

## 🚀 Backend Deployment

### Option 1: Railway Deployment

#### 1. Create Railway Account
1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Create a new project

#### 2. Connect Repository
1. Click "Deploy from GitHub repo"
2. Select your MediConnect repository
3. Choose the `backend` directory

#### 3. Configure Environment Variables
Add the following variables in Railway dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediconnect
JWT_SECRET=your-very-secure-jwt-secret-key-minimum-32-characters
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 4. Deploy
1. Railway will automatically detect Node.js
2. Build command: `npm install`
3. Start command: `npm start`
4. Deploy automatically on push

#### 5. Get Production URL
- Railway will provide a URL like: `https://your-app.railway.app`
- Use this URL for frontend configuration

### Option 2: Render Deployment

#### 1. Create Render Account
1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. Create a new Web Service

#### 2. Connect Repository
1. Connect your GitHub repository
2. Select the repository
3. Configure as follows:

#### 3. Service Configuration
- **Name**: `mediconnect-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

#### 4. Environment Variables
Add the same environment variables as Railway.

#### 5. Deploy
1. Click "Create Web Service"
2. Render will build and deploy automatically
3. Get your production URL

### Option 3: Heroku Deployment

#### 1. Create Heroku Account
1. Go to [Heroku](https://heroku.com/)
2. Sign up for an account
3. Install Heroku CLI

#### 2. Deploy via CLI
```bash
cd backend
heroku create mediconnect-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
git push heroku main
```

## 🎨 Frontend Deployment

### Option 1: Vercel Deployment (Recommended)

#### 1. Create Vercel Account
1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Import your repository

#### 2. Configure Project
1. Select the `frontend` directory
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`

#### 3. Environment Variables
Add the following variables:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

#### 4. Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Get your production URL

### Option 2: Netlify Deployment

#### 1. Create Netlify Account
1. Go to [Netlify](https://netlify.com/)
2. Sign up with GitHub
3. Import your repository

#### 2. Configure Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### 3. Environment Variables
Add the same environment variables as Vercel.

#### 4. Deploy
1. Click "Deploy site"
2. Netlify will build and deploy automatically

### Option 3: GitHub Pages Deployment

#### 1. Configure Vite for GitHub Pages
Update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
})
```

#### 2. Add GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: |
        cd frontend
        npm install
        npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/dist
```

## 🔧 Production Configuration

### Backend Production Settings

#### 1. Update package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 2. Add Production Dependencies
```bash
npm install compression helmet cors
```

#### 3. Update server.js
```javascript
const compression = require('compression');
const helmet = require('helmet');

// Add security middleware
app.use(helmet());
app.use(compression());

// Configure CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend-domain.com',
  credentials: true
}));
```

### Frontend Production Settings

#### 1. Update Environment Variables
Create `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

#### 2. Optimize Build
Update `vite.config.js`:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

## 🔒 Security Configuration

### 1. Environment Variables Security
- Use strong, unique secrets
- Rotate secrets regularly
- Never commit secrets to version control

### 2. CORS Configuration
```javascript
// Backend CORS setup
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Input Validation
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... rest of the logic
});
```

## 📊 Monitoring and Analytics

### 1. Application Monitoring
- Set up error tracking (Sentry)
- Monitor performance (New Relic)
- Set up uptime monitoring (UptimeRobot)

### 2. Database Monitoring
- Enable MongoDB Atlas monitoring
- Set up alerts for performance issues
- Monitor connection usage

### 3. Logging
```javascript
// Add structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: |
        cd backend
        npm install
        npm test
    - run: |
        cd frontend
        npm install
        npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Railway
      uses: railway/deploy@v1
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🧪 Post-Deployment Testing

### 1. Health Checks
```bash
# Test backend health
curl https://your-backend-url.com/api/health

# Test frontend
curl https://your-frontend-url.com
```

### 2. Functionality Testing
- [ ] User registration
- [ ] User login
- [ ] Doctor search
- [ ] Appointment booking
- [ ] Admin functions
- [ ] File uploads
- [ ] Responsive design

### 3. Performance Testing
- [ ] Page load times
- [ ] API response times
- [ ] Database query performance
- [ ] Image optimization

## 🔧 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for syntax errors

#### 2. Environment Variable Issues
- Verify all required variables are set
- Check variable names and values
- Ensure proper formatting

#### 3. Database Connection Issues
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user permissions

#### 4. CORS Issues
- Verify frontend URL in CORS configuration
- Check for trailing slashes
- Ensure HTTPS/HTTP consistency

## 📈 Performance Optimization

### 1. Frontend Optimization
- Enable gzip compression
- Optimize images
- Implement lazy loading
- Use CDN for static assets

### 2. Backend Optimization
- Enable database indexing
- Implement caching
- Optimize API responses
- Use connection pooling

### 3. Database Optimization
- Create proper indexes
- Monitor query performance
- Optimize schema design
- Regular maintenance

## 🔄 Backup and Recovery

### 1. Database Backup
- Enable MongoDB Atlas automated backups
- Set up manual backup schedule
- Test backup restoration

### 2. Application Backup
- Version control all code changes
- Document configuration changes
- Maintain deployment scripts

### 3. Disaster Recovery Plan
- Document recovery procedures
- Test recovery processes
- Maintain contact information

---

**Your MediConnect application is now production-ready! 🚀** 