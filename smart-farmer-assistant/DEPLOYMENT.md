# Deployment Guide - Smart Farmer Assistant

Complete guide for deploying Smart Farmer Assistant to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] Git repository is clean
- [ ] Documentation updated
- [ ] No console errors in dev mode

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React)                         │
│  Hosted on: Vercel / Cloudflare Pages / GitHub Pages         │
│  Domain: https://smartfarmer.example.com                     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS API Calls
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                         │
│      Hosted on: Heroku / Railway / AWS EC2 / DigitalOcean   │
│      Domain: https://api.smartfarmer.example.com             │
└────────────────────┬────────────────────────────────────────┘
                     │ Connection
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Database (MongoDB)                         │
│         Hosted on: MongoDB Atlas (Recommended)               │
│     Connection: mongodb+srv://user:pass@cluster...          │
└─────────────────────────────────────────────────────────────┘
```

## Option 1: Deploy to Vercel + Heroku (Recommended)

### Step 1: Prepare Backend for Heroku

1. **Update Scripts**
   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   }
   ```

2. **Create Procfile**
   ```bash
   cd server
   echo "web: npm start" > Procfile
   ```

3. **Ensure Node Version**
   ```bash
   echo "18.x" > .nvmrc
   ```

### Step 2: Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create smart-farmer-api

# Set environment variables
heroku config:set MONGODB_URI="your_mongo_atlas_uri"
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set OPENWEATHER_API_KEY="your_weather_key"
heroku config:set CLIENT_URL="https://smart-farmer.vercel.app"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Step 3: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Change to client directory
cd client

# Deploy
vercel

# Set environment variable
vercel env add REACT_APP_API_BASE_URL https://smart-farmer-api.herokuapp.com/api
```

### Step 4: Connect Frontend to Backend

Update `client/.env.production`:
```
VITE_API_BASE_URL=https://smart-farmer-api.herokuapp.com/api
```

## Option 2: Deploy to Railway

### Step 1: Connect GitHub

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Select your smart-farmer-assistant repository

### Step 2: Configure Backend Service

1. **Add MongoDB**
   - Add plugin → select MongoDB
   - Get connection string from Railway

2. **Set Environment Variables**
   ```
   DATABASE_URL=<from MongoDB>
   JWT_SECRET=your_secret
   NODE_ENV=production
   PORT=3000
   ```

3. **Configure Start Script**
   In server/package.json:
   ```json
   "scripts": {
     "start": "node index.js"
   }
   ```

### Step 3: Deploy Frontend

```bash
cd client
vercel --prod
```

## Option 3: Docker + AWS EC2

### Step 1: Create Dockerfile (Server)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  server:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/smartfarmer
      JWT_SECRET: ${JWT_SECRET}
      CLIENT_URL: http://localhost:3000

  client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:5000/api

volumes:
  mongo_data:
```

### Step 3: Deploy on AWS EC2

```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker & Docker Compose
sudo yum install docker
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/yourusername/smart-farmer-assistant.git
cd smart-farmer-assistant

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Option 4: DigitalOcean App Platform

### Step 1: Create app.yaml

```yaml
name: smart-farmer-assistant
services:
- name: server
  github:
    repo: yourusername/smart-farmer-assistant
    branch: main
  build_command: cd server && npm install
  run_command: npm start
  http_port: 5000
  envs:
  - key: MONGODB_URI
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}
  - key: JWT_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${JWT_SECRET}

- name: client
  github:
    repo: yourusername/smart-farmer-assistant
    branch: main
  build_command: cd client && npm install && npm run build
  http_port: 3000

databases:
- name: db
  engine: MONGODB
  version: "6"
```

### Step 2: Deploy

```bash
doctl apps create --spec app.yaml
```

## MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 Free Cluster
4. Select region closest to your users

### Step 2: Set Up Security

```
Network Access → Add IP:
- 0.0.0.0/0 (for development)
- Or specific IPs for production
```

### Step 3: Create Database User

```
Database Users → Add User:
- Username: smartfarmer_prod
- Password: generate strong password
- Database: admin
```

### Step 4: Get Connection String

```
Clusters → Connect → Connection String:
mongodb+srv://smartfarmer_prod:PASSWORD@cluster.mongodb.net/smartfarmer?retryWrites=true&w=majority
```

## SSL/HTTPS Setup

### For Vercel (Automatic)
- Vercel automatically provides SSL certificates

### For Heroku (Automatic)
- Heroku automatically provides SSL certificates

### For Custom Domain

Use **Cloudflare** (Free):
1. Add domain to Cloudflare
2. Point nameservers to Cloudflare
3. Set up DNS records:
   - `api` CNAME → your-heroku-app.herokuapp.com
   - `@` CNAME → smart-farmer.vercel.app
4. Enable "Full SSL/TLS"

## Monitoring & Logging

### Heroku Logs
```bash
heroku logs --tail -a smart-farmer-api
```

### DigitalOcean Logs
```bash
doctl apps logs APPID component-name
```

### MongoDB Logs
- Go to MongoDB Atlas dashboard
- Click on Logs in left sidebar
- View real-time activity

## Performance Optimization

### Frontend
```javascript
// Enable compression in vite.config.js
import compression from 'vite-plugin-compression'

export default {
  plugins: [
    compression(),
  ]
}
```

### Backend
```javascript
// server/index.js
import compression from 'compression'

app.use(compression())
```

### Database
- Create indexes on frequently queried fields
- Enable compression on MongoDB
- Use connection pooling

## Backup Strategy

### MongoDB Backup

```bash
# Local backup
mongodump --uri "connection_string" -o backup

# Restore
mongorestore --uri "connection_string" backup
```

### Automated MongoDB Backup
- Atlas handles daily backups automatically
- Downloadable from Atlas dashboard

## Health Checks

### Backend Health Endpoint
```javascript
// server/index.js
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date() 
  })
})
```

### Monitor Health
```bash
# Heroku
heroku config:set HEROKU_HEALTH_CHECK_URL=/health
```

## Rollback Strategy

### If Deployment Fails

**Heroku:**
```bash
heroku releases
heroku rollback v123
```

**Vercel:**
- Automatic rollback available in dashboard
- Click previous deployment to revert

## Post-Deployment Verification

1. ✅ Visit https://yourapp.vercel.app
2. ✅ Login with demo account (9876543210/123456)
3. ✅ Check all pages load correctly
4. ✅ Test voice input
5. ✅ Add test expense
6. ✅ Check weather data
7. ✅ Monitor backend logs for errors

## Scaling Guide

As your app grows:

### Increase Resources

**Vercel:**
- Automatic scaling, no config needed

**Heroku:**
```bash
heroku dyno:resize standard-2x
```

**DigitalOcean:**
```bash
doctl apps update APPID --instance-size basic-l
```

### Database Scaling

**MongoDB Atlas:**
- Upgrade to M10 tier for better performance
- Enable auto-scaling
- Use sharding for very large datasets

## Cost Estimates (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | ✓ | $20+  |
| Heroku | ✗ | $7+   |
| MongoDB Atlas | ✓ (0.5GB) | $10-100+ |
| Domain | - | $10/year |
| **Total** | - | **$25-50/month** |

## Troubleshooting

### 502 Bad Gateway
- Check backend logs: `heroku logs --tail`
- Verify MongoDB connection string
- Ensure environment variables are set

### Frontend not loading
- Clear browser cache
- Check API_BASE_URL in .env
- Verify CORS settings in backend

### Voice not working in production
- Ensure HTTPS is enabled
- Check browser permissions
- Verify microphone access

---

**📞 Support**: If you encounter issues, check [SETUP.md](SETUP.md) or create a GitHub issue.

**🎉 Congratulations**: Your Smart Farmer Assistant is now in production!
