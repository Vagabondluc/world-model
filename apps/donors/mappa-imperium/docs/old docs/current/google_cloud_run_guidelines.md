# Google Cloud Run Development Guidelines

> **Note**: This document describes the constraints and best practices for the **deployment target** (Google Cloud Run). The application's architecture has also been heavily influenced by the limitations of its primary **development environment** (Google AI Studio), which has a read-only file system. Many of the build-less patterns described here are workarounds for the development environment that also happen to be compatible with the stateless nature of the deployment environment. For more details, see the "Development Environment Constraints" section in the [Current Architecture Overview](./current_architecture_overview.md).

## Core Architecture Constraints

### Container-Based Deployment
- **MUST**: Package your application as a Docker container
- **MUST**: Application must listen on the port defined by `$PORT` environment variable
- **DEFAULT PORT**: If `$PORT` is not set, use port 8080
- **CANNOT**: Assume specific port numbers - always use the `$PORT` variable

### Stateless Application Requirements
- **MUST**: Design application to be completely stateless
- **CANNOT**: Store data in local filesystem (except `/tmp`)
- **CANNOT**: Rely on in-memory state between requests
- **MUST**: Use external storage for persistent data (Cloud Storage, databases)
- **CANNOT**: Write to any directory except `/tmp` (which is ephemeral)

### Request Handling Constraints
- **TIMEOUT**: Maximum request timeout is 60 minutes
- **CONCURRENCY**: Default 1000 concurrent requests per instance
- **COLD STARTS**: Application must handle cold start delays gracefully
- **MUST**: Respond to health checks on all paths
- **SHOULD**: Optimize for fast startup times (< 10 seconds ideal)

## Static File Serving Limitations

### File System Access
- **CANNOT**: Serve files from `/public` directory automatically
- **CANNOT**: Use traditional static file hosting patterns
- **MUST**: Bundle static assets or serve them programmatically
- **OPTION 1**: Include static files in your application bundle
- **OPTION 2**: Serve files through your application code
- **OPTION 3**: Use Cloud Storage + CDN for static assets

### Recommended Static File Strategies
```javascript
// GOOD: Bundle content in your application
import staticContent from './bundled-content.js';

// GOOD: Serve through your app
app.get('/static/*', (req, res) => {
  // Serve bundled or fetched content
});

// BAD: Expecting automatic static file serving
// This won't work: expecting /public/file.html to be automatically served
```

## Environment and Runtime

### Resource Limits
- **CPU**: 0.08 to 8 vCPUs
- **MEMORY**: 128 MiB to 32 GiB
- **DISK**: Ephemeral storage only, up to 32 GiB in `/tmp`
- **CANNOT**: Use local disk for persistent storage

### Environment Variables
- **MUST**: Use environment variables for configuration
- **AVAILABLE**: `PORT`, `K_SERVICE`, `K_REVISION`, `K_CONFIGURATION`
- **SHOULD**: Set custom environment variables for app configuration
- **CANNOT**: Rely on `.env` files - use Cloud Run environment configuration

### Network and Security
- **HTTPS**: All traffic is automatically HTTPS
- **CANNOT**: Handle raw TCP connections
- **MUST**: Use HTTP/HTTP2 protocols only
- **AUTHENTICATION**: Can integrate with Cloud IAM
- **CANNOT**: Open arbitrary network ports

## Development Best Practices

### Application Structure
```dockerfile
# REQUIRED: Dockerfile structure
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

### Code Patterns for Cloud Run

#### Static Content Handling
```javascript
// RECOMMENDED: Bundle static content
const staticContent = {
  '/rules/era-1.html': '<html>...</html>',
  '/rules/era-2.html': '<html>...</html>'
};

app.get('/rules/:file', (req, res) => {
  const content = staticContent[`/rules/${req.params.file}`];
  if (content) {
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } else {
    res.status(404).send('Not found');
  }
});
```

#### Port Configuration
```javascript
// REQUIRED: Use PORT environment variable
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Health Check Support
```javascript
// RECOMMENDED: Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('OK');
});
```

## Deployment Constraints

### Build Process
- **MUST**: Include build step in Dockerfile if needed
- **CANNOT**: Rely on local build artifacts
- **MUST**: Install dependencies within container
- **SHOULD**: Use multi-stage builds for optimization

### Configuration Management
- **MUST**: Use Cloud Run environment variables for config
- **CANNOT**: Mount config files from host system
- **SHOULD**: Use Cloud Secret Manager for sensitive data
- **MUST**: Make configuration discoverable at runtime

### Scaling Behavior
- **AUTO-SCALING**: Instances automatically scale to zero
- **COLD STARTS**: First request after scale-to-zero will be slower
- **MUST**: Handle concurrent requests safely
- **CANNOT**: Assume single-instance deployment

## Common Anti-Patterns to Avoid

### File System Misuse
```javascript
// BAD: Expecting static files to be served automatically
// This will result in 404 errors:
fetch('/public/rules/era-1.html') // Won't work!

// GOOD: Serve content through your application
fetch('/api/rules/era-1') // Route handled by your app
```

### State Management
```javascript
// BAD: Storing state in memory
let userSessions = {}; // Lost on instance restart

// GOOD: Use external storage
const sessions = new CloudFirestore();
```

### Port Hardcoding
```javascript
// BAD: Hardcoded port
app.listen(3000); // Will fail in Cloud Run

// GOOD: Use environment variable
app.listen(process.env.PORT || 8080);
```

## Testing and Development

### Local Development
- **USE**: `gcloud run deploy` for testing
- **USE**: Docker locally to simulate Cloud Run environment
- **TEST**: Cold start behavior
- **VERIFY**: All static content loads correctly

### Debugging
- **USE**: Cloud Run logs for debugging
- **SET**: Appropriate logging levels
- **MONITOR**: Request latency and cold starts
- **TEST**: Application behavior under concurrent load

## Migration Strategies

### From Traditional Static Hosting
1. **Bundle Strategy**: Include static files in application bundle
2. **API Strategy**: Create endpoints to serve static content
3. **Hybrid Strategy**: Use Cloud Storage for assets, Cloud Run for application

### From Local Development
1. **Environment Parity**: Ensure local Docker matches Cloud Run behavior
2. **Static Content**: Test static content serving in containerized environment
3. **Configuration**: Move all config to environment variables
4. **Dependencies**: Ensure all dependencies are explicitly declared

## Performance Optimization

### Cold Start Minimization
- **MINIMIZE**: Application startup time
- **OPTIMIZE**: Container image size
- **CACHE**: Dependencies appropriately
- **AVOID**: Heavy initialization in startup

### Resource Efficiency
- **SET**: Appropriate CPU/memory limits
- **MONITOR**: Resource usage patterns
- **OPTIMIZE**: For your specific traffic patterns
- **CONSIDER**: Minimum instances for high-traffic applications