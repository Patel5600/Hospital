# Hospital Management System - Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificates obtained
- [ ] Domain names configured
- [ ] Monitoring tools set up

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create hospital-api-production
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_strong_random_secret_here
heroku config:set JWT_EXPIRE=7d
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Initial deployment"
git push heroku main
```

6. **Verify**
```bash
heroku logs --tail
heroku open
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize Project**
```bash
cd backend
railway init
```

4. **Set Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret
railway variables set MONGODB_URI=your_mongodb_uri
```

5. **Deploy**
```bash
railway up
```

### Option 3: DigitalOcean App Platform

1. **Create Account** at digitalocean.com

2. **Create New App**
   - Connect GitHub repository
   - Select backend folder
   - Choose Node.js environment

3. **Configure Environment Variables**
   - Add all variables from .env
   - Set NODE_ENV=production

4. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

### Option 4: AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Configure security groups (ports 22, 80, 443, 5000)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

4. **Clone Repository**
```bash
git clone your-repo-url
cd hospital/backend
npm install
```

5. **Configure Environment**
```bash
nano .env
# Add production variables
```

6. **Start with PM2**
```bash
pm2 start server.js --name hospital-api
pm2 startup
pm2 save
```

7. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/hospital-api
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hospital-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Configure Environment**
```bash
cd frontend
# Create .env.production
echo "VITE_API_URL=https://your-backend-url.com/api" > .env.production
```

4. **Deploy**
```bash
vercel --prod
```

5. **Configure Domain** (in Vercel dashboard)

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
cd frontend
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

5. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add VITE_API_URL

### Option 3: AWS S3 + CloudFront

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
   - Name: hospital-frontend
   - Enable static website hosting
   - Disable "Block all public access"

3. **Upload Files**
```bash
aws s3 sync dist/ s3://hospital-frontend
```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: index.html

5. **Configure Custom Domain**
   - Add CNAME record in DNS
   - Add alternate domain in CloudFront

### Option 4: GitHub Pages

1. **Install gh-pages**
```bash
cd frontend
npm install -D gh-pages
```

2. **Update package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/hospital"
}
```

3. **Deploy**
```bash
npm run deploy
```

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Account** at mongodb.com/cloud/atlas

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to backend
   - Name: hospital-db

3. **Configure Network Access**
   - Add IP: 0.0.0.0/0 (allow from anywhere)
   - Or add specific backend server IPs

4. **Create Database User**
   - Username: hospital_admin
   - Password: strong_random_password
   - Role: Read and write to any database

5. **Get Connection String**
```
mongodb+srv://hospital_admin:password@cluster.mongodb.net/hospital_db?retryWrites=true&w=majority
```

6. **Update Backend Environment**
```bash
MONGODB_URI=mongodb+srv://hospital_admin:password@cluster.mongodb.net/hospital_db
```

7. **Seed Production Database**
```bash
cd database
# Update .env with production MongoDB URI
npm run seed
```

### AWS DocumentDB

1. **Create Cluster**
   - Instance class: db.t3.medium
   - Number of instances: 1

2. **Configure Security Group**
   - Allow port 27017 from backend

3. **Get Connection String**
```
mongodb://username:password@docdb-cluster.cluster-xxx.region.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0
```

4. **Download SSL Certificate**
```bash
wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
```

## Environment Variables

### Backend Production (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hospital_db
JWT_SECRET=super_strong_random_secret_minimum_32_characters
JWT_EXPIRE=7d
```

### Frontend Production (.env.production)
```bash
VITE_API_URL=https://api.yourdomain.com/api
```

## Post-Deployment

### 1. Verify Backend

```bash
# Health check
curl https://api.yourdomain.com/api/health

# Expected response:
# {"success":true,"message":"Hospital Management System API is running"}
```

### 2. Verify Frontend

- Open https://yourdomain.com
- Try logging in with demo accounts
- Test all major features

### 3. Monitor Logs

**Heroku:**
```bash
heroku logs --tail --app hospital-api-production
```

**Railway:**
```bash
railway logs
```

**PM2 (EC2):**
```bash
pm2 logs hospital-api
```

### 4. Set Up Monitoring

**Backend Monitoring:**
- New Relic
- Datadog
- Sentry for error tracking

**Frontend Monitoring:**
- Google Analytics
- Sentry
- LogRocket

**Database Monitoring:**
- MongoDB Atlas built-in monitoring
- CloudWatch (AWS)

### 5. Set Up Backups

**MongoDB Atlas:**
- Enable automatic backups
- Schedule: Daily
- Retention: 7 days

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/hospital_db" --out=backup-$(date +%Y%m%d)
```

### 6. Configure Alerts

- Server down alerts
- High error rate alerts
- Database connection alerts
- SSL certificate expiry alerts

## Performance Optimization

### Backend

1. **Enable Compression**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Rate Limiting**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

3. **Enable Caching**
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### Frontend

1. **Code Splitting**
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

2. **Image Optimization**
- Use WebP format
- Lazy load images
- Use CDN for assets

3. **Bundle Analysis**
```bash
npm run build -- --analyze
```

## Security Hardening

### 1. Enable HTTPS Only

**Backend:**
```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 2. Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. CORS Configuration

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### 4. Environment Secrets

- Never commit .env files
- Use secret management services
- Rotate secrets regularly

## Rollback Plan

### Backend Rollback

**Heroku:**
```bash
heroku releases
heroku rollback v123
```

**PM2:**
```bash
pm2 stop hospital-api
git checkout previous-commit
npm install
pm2 restart hospital-api
```

### Frontend Rollback

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Go to Deploys
- Click "Publish deploy" on previous version

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Review performance metrics
- Check disk space

**Monthly:**
- Update dependencies
- Review security advisories
- Database optimization
- Backup verification

**Quarterly:**
- Security audit
- Performance review
- Cost optimization
- Feature planning

### Dependency Updates

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# For major updates
npm install package@latest
```

## Troubleshooting

### Common Issues

**1. Database Connection Timeout**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

**2. CORS Errors**
- Verify backend CORS configuration
- Check frontend API URL
- Ensure HTTPS on both ends

**3. 502 Bad Gateway**
- Check if backend is running
- Verify port configuration
- Check reverse proxy settings

**4. High Memory Usage**
- Check for memory leaks
- Optimize database queries
- Increase server resources

## Support Contacts

- **Backend Issues**: backend-team@hospital.com
- **Frontend Issues**: frontend-team@hospital.com
- **Database Issues**: dba-team@hospital.com
- **DevOps**: devops-team@hospital.com

---

**Deployment Complete!** 🚀

Your Hospital Management System is now live and ready for production use.
