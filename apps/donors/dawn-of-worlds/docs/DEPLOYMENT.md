# Deployment

This document describes how to deploy Dawn of Worlds to production.

## Table of Contents

- [Production Setup](#production-setup)
- [Environment Variables](#environment-variables)
- [WebSocket Server Hosting](#websocket-server-hosting)
- [Scaling Considerations](#scaling-considerations)
- [Monitoring](#monitoring)
- [Security](#security)

## Production Setup

## Production Setup

### 1. Browser-Only Mode (Recommended for v1.0)
The simplest way to deploy Dawn of Worlds is as a static site. The application is designed to run entirely in the browser for single-player or local testing.

```bash
# Install dependencies
npm install

# Create optimized production build
npm run build
```

The output will be in the `dist/` directory. This folder contains everything needed to run the game.

### 2. Frontend Deployment

#### Static Hosting (Vercel, Netlify, GitHub Pages)
Since v1.0 is a client-side application, you can deploy the `dist/` folder to any static host.

```bash
# Deploy to Vercel
vercel deploy
```


The production build includes:

- Minified JavaScript
- Optimized assets
- Source maps for debugging

### Frontend Deployment

#### Static Hosting (Vercel, Netlify, GitHub Pages)

For a pure client-side deployment:

```bash
# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

#### Custom Server (Nginx, Apache)

For serving from your own server:

```nginx
# Nginx configuration
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### WebSocket Server Deployment

#### Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start server.js --name "dawnworlds-ws"

# Save process list
pm2 save

# Monitor
pm2 status
pm2 logs dawnworlds-ws
```

#### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8787

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  dawnworlds-ws:
    build: .
    ports:
      - "8787:8787"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Deploy:

```bash
docker-compose up -d
```

## Environment Variables

### Client-Side Variables

Create `.env.production`:

```env
# WebSocket server URL
VITE_WS_URL=wss://your-domain.com

# Optional: API endpoint for additional services
VITE_API_URL=https://api.your-domain.com
```

### Server-Side Variables

Set these in your deployment environment:

```env
# WebSocket port
WS_PORT=8787

# Node environment
NODE_ENV=production

# Optional: Redis URL for scaling
REDIS_URL=redis://localhost:6379

# Optional: Database URL for persistence
DATABASE_URL=postgresql://user:pass@host:5432/dawnworlds
```

### Configuration in Code

```ts
// server.js
const PORT = process.env.WS_PORT || 8787;
const IS_PROD = process.env.NODE_ENV === 'production';

// client
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';
```

## WebSocket Server Hosting

### Reverse Proxy Setup

#### Nginx

```nginx
upstream websocket {
    server localhost:8787;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /ws {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache

```apache
<VirtualHost *:443>
    ServerName your-domain.com

    # SSL configuration
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    # WebSocket proxy
    ProxyRequests on
    ProxyPass /ws ws://localhost:8787
    ProxyPassReverse on

    # Static files
    DocumentRoot /path/to/dist
</VirtualHost>
```

### Cloud Platforms

#### AWS EC2 + Nginx

1. Launch EC2 instance
2. Install Node.js, Nginx
3. Deploy code
4. Configure Nginx reverse proxy
5. Configure security groups (allow port 8787)

#### Google Cloud Platform

```bash
# Deploy to App Engine
gcloud app deploy

# Or use Cloud Run
gcloud run deploy dawnworlds-ws --platform managed
```

#### Azure App Service

```bash
# Deploy to Azure Web App
az webapp up --name dawnworlds-ws --resource-group myResourceGroup
```

## Scaling Considerations

### Vertical Scaling

Increase resources on single instance:

| Resource | Typical Values |
|----------|----------------|
| CPU | 2-4 cores |
| Memory | 2-8 GB |
| Network | 1-10 Gbps |

### Horizontal Scaling

For multiple server instances:

#### Load Balancer

Use a load balancer to distribute WebSocket connections:

```
                    ┌─────────────────┐
                    │  Load Balancer │
                    └────────┬────────┘
                             │
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼────┐    │    ┌────▼────┐
         │ Server 1 │    │    │ Server 2 │
         └───────────┘    │    └───────────┘
                             │
                    ┌────────▼────────┐
                    │  Shared Storage  │
                    └─────────────────┘
```

#### Redis for Shared State

For horizontal scaling, use Redis for room state:

```js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Store room state in Redis
async function getRoom(roomId) {
  const data = await redis.get(`room:${roomId}`);
  return data ? JSON.parse(data) : null;
}

async function setRoom(roomId, state) {
  await redis.set(`room:${roomId}`, JSON.stringify(state));
}
```

#### Sticky Sessions

Configure load balancer for sticky sessions:

- Each client connects to same server instance
- Required for in-memory room state
- Not needed with Redis-backed state

### Scaling Triggers

Consider scaling when:

- Average CPU > 70% for 5+ minutes
- Memory usage > 80%
- Concurrent connections > 1000
- Message latency > 500ms

## Monitoring

### Application Metrics

Track these metrics:

| Metric | Tool | Threshold |
|--------|-------|-----------|
| Active connections | Custom metrics | Alert > 1000 |
| Messages per second | Custom metrics | Alert > 100/s |
| Error rate | Custom metrics | Alert > 1% |
| Memory usage | Node.js process.memoryUsage() | Alert > 80% |
| CPU usage | Node.js process.cpuUsage() | Alert > 70% |

### Logging

Implement structured logging:

```js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

// Usage
logger.info('Client connected', { roomId, playerId });
logger.error('Event validation failed', { error, eventId });
```

### Health Checks

Implement health endpoint:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: Date.now(),
      connections: wss.clients.size,
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
```

Configure load balancer health checks to this endpoint.

### External Monitoring Services

| Service | Features |
|---------|----------|
| Datadog | APM, logs, metrics |
| New Relic | APM, error tracking |
| Prometheus + Grafana | Metrics dashboards |
| Sentry | Error tracking, performance |

## Security

### SSL/TLS

Always use HTTPS in production:

```nginx
# Nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256';
ssl_prefer_server_ciphers on;
```

### Rate Limiting

Implement rate limiting per client:

```js
const rateLimit = new Map();

function checkRateLimit(clientId) {
  const now = Date.now();
  const client = rateLimit.get(clientId) || { count: 0, resetAt: now };

  if (now > client.resetAt + 60000) { // 1 minute window
    client.count = 0;
    client.resetAt = now;
  }

  client.count++;

  if (client.count > 100) { // Max 100 messages per minute
    return false;
  }

  rateLimit.set(clientId, client);
  return true;
}
```

### Input Validation

Always validate incoming messages:

```js
function validateMessage(msg) {
  if (!msg || typeof msg !== 'object') {
    return false;
  }
  if (!msg.t || typeof msg.t !== 'string') {
    return false;
  }
  // Additional validation based on message type
  return true;
}
```

### CORS Configuration

If serving from different origin:

```js
const wss = new WebSocketServer({
  port: 8787,
  verifyClient: (info) => {
    // Validate origin
    const allowedOrigins = ['https://yourdomain.com'];
    return allowedOrigins.includes(info.origin);
  }
});
```

## Backup and Recovery

### Database Backups

If using database for persistence:

```bash
# Daily backup
0 0 * * * * pg_dump dawnworlds > backup_$(date +\%Y\%m\%d).sql

# Restore
psql dawnworlds < backup_2024_01_01.sql
```

### Event Log Export

Export event logs regularly:

```js
async function exportEventLogs() {
  for (const [roomId, room] of rooms.entries()) {
    const data = {
      roomId,
      events: room.log,
      exportedAt: Date.now(),
    };
    await fs.writeFile(
      `exports/room-${roomId}-${Date.now()}.json`,
      JSON.stringify(data)
    );
  }
}
```

Schedule with cron:

```bash
# Daily at 3 AM
0 3 * * * /path/to/export-script.js
```

## Disaster Recovery

### Recovery Checklist

1. Restore from latest backup
2. Verify event log integrity
3. Restart WebSocket server
4. Verify health endpoint
5. Monitor for errors

### Rollback Procedure

If deployment causes issues:

```bash
# Rollback to previous version
git checkout previous-release-tag
npm run build
pm2 restart dawnworlds-ws
```

## Performance Optimization

### Compression

Enable gzip compression:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
gzip_comp_level 6;
```

### Caching

Cache static assets:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Connection Pooling

For database connections:

```js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## See Also

- [GETTING_STARTED.md](GETTING_STARTED.md) — Development setup
- [SERVER_IMPLEMENTATION.md](SERVER_IMPLEMENTATION.md) — Server architecture
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Common issues
