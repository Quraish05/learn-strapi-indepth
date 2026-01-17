# Middlewares Guide

This guide explains what middlewares are in Strapi, how they work, and how to configure them using `config/middlewares.ts`.

## 🔄 What is Middleware?

Middleware is software that acts as a bridge between different parts of an application. In web frameworks like Strapi, middleware functions are executed in a specific order during the request/response cycle, allowing you to:

- **Process requests** before they reach your routes
- **Modify responses** before they're sent to clients
- **Add functionality** like logging, authentication, CORS, etc.
- **Handle errors** globally
- **Transform data** (parse JSON, handle file uploads, etc.)

Think of middleware as a **pipeline** where each middleware can inspect, modify, or stop the request/response flow.

## 🎯 What Middleware Does in Strapi

In Strapi, middleware provides essential functionality that runs on **every request** to your API:

1. **Security** - Protects against common web vulnerabilities
2. **CORS** - Controls cross-origin resource sharing
3. **Request Parsing** - Parses JSON, form data, query strings
4. **Error Handling** - Catches and formats errors consistently
5. **Logging** - Records request/response information
6. **Static Files** - Serves public assets (images, files, etc.)
7. **Session Management** - Handles user sessions
8. **Authentication** - Validates tokens and permissions

## 📁 The `config/middlewares.ts` File

### Location
```
strapi-backend/config/middlewares.ts
```

### Importance

The `middlewares.ts` file is **critical** because it:

- **Defines the execution order** of all middleware (order matters!)
- **Configures built-in Strapi middleware** with custom settings
- **Enables/disables middleware** as needed
- **Allows custom middleware** to be added
- **Controls security settings** (CORS, headers, etc.)

Strapi reads this file on startup and applies the middleware in the exact order you specify.

### File Structure

```typescript
export default [
  'strapi::logger',           // String format (default config)
  'strapi::errors',
  {
    name: 'strapi::cors',     // Object format (custom config)
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:3000'],
    },
  },
  'strapi::poweredBy',
  // ... more middlewares
];
```

### Two Configuration Formats

1. **String Format** - Uses default configuration:
   ```typescript
   'strapi::logger'
   ```

2. **Object Format** - Custom configuration:
   ```typescript
   {
     name: 'strapi::cors',
     config: {
       enabled: true,
       origin: ['http://localhost:3000'],
     },
   }
   ```

## 🛠️ Built-in Strapi Middlewares

### 1. `strapi::logger`
**Purpose**: Logs all HTTP requests and responses

**When it runs**: First (typically) - logs incoming requests

**Configuration**:
```typescript
'strapi::logger'  // Default: logs to console
```

**What it does**:
- Logs request method, URL, status code
- Logs response time
- Useful for debugging and monitoring

---

### 2. `strapi::errors`
**Purpose**: Global error handler

**When it runs**: Early in the chain to catch errors

**Configuration**:
```typescript
'strapi::errors'  // Default: formats errors as JSON
```

**What it does**:
- Catches unhandled errors
- Formats error responses consistently
- Prevents stack traces from leaking in production

---

### 3. `strapi::security`
**Purpose**: Security headers and protections

**When it runs**: Early to protect all requests

**Configuration**:
```typescript
'strapi::security'  // Default: enables security headers
```

**What it does**:
- Adds security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Protects against XSS, clickjacking, MIME sniffing
- Configurable via `config/security.ts`

---

### 4. `strapi::cors`
**Purpose**: Cross-Origin Resource Sharing (CORS) configuration

**When it runs**: Before routes to handle preflight requests

**Configuration**:
```typescript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    headers: '*',  // or specific headers: ['Content-Type', 'Authorization']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,  // Allow cookies/auth headers
  },
}
```

**What it does**:
- Controls which origins can access your API
- Handles preflight OPTIONS requests
- **Critical for frontend applications** calling your API

**Common Use Cases**:
- Allow your React/Next.js frontend to call the API
- Restrict API access to specific domains
- Enable credentials (cookies, auth headers)

---

### 5. `strapi::poweredBy`
**Purpose**: Adds `X-Powered-By: Strapi` header  
**Configuration**: `'strapi::poweredBy'`  
**Note**: Often removed in production to hide server technology

---

### 6. `strapi::query`
**Purpose**: Parses URL query strings (`?page=1&limit=10`)  
**Configuration**: `'strapi::query'`  
**What it does**: Makes query params available in `ctx.query` for filtering, pagination, sorting

---

### 7. `strapi::body`
**Purpose**: Parses request body (JSON, form data, etc.)

**When it runs**: Before routes to parse POST/PUT data

**Configuration**:
```typescript
'strapi::body'  // Default: parses JSON and form data
```

**What it does**:
- Parses JSON request bodies
- Handles form data (multipart/form-data)
- Makes data available in `ctx.request.body`
- **Required for POST/PUT/PATCH requests**

---

### 8. `strapi::session`
**Purpose**: Session management

**When it runs**: Before routes to initialize sessions

**Configuration**:
```typescript
'strapi::session'  // Default: uses memory store
```

**What it does**:
- Manages user sessions
- Stores session data
- Handles session cookies
- Configurable via `config/session.ts`

---

### 9. `strapi::favicon`
**Purpose**: Serves favicon.ico from `public/favicon.ico`  
**Configuration**: `'strapi::favicon'`  
**What it does**: Prevents 404 errors for favicon requests

---

### 10. `strapi::public`
**Purpose**: Serves static files from `public/` directory

**When it runs**: Last (typically) - serves files if route doesn't match

**Configuration**:
```typescript
'strapi::public'  // Default: serves from public/ directory
```

**What it does**:
- Serves static files (images, CSS, JS, etc.)
- Serves uploaded media files from `public/uploads/`
- **Critical for serving images and files**

## ⚙️ Configuration Examples

### Basic Configuration (Default)
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Custom CORS Configuration
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'https://myapp.com',
        'https://www.myapp.com',
      ],
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Production Configuration (Security Focused)
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://yourdomain.com'],  // Only your domain
      headers: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  },
  // Removed 'strapi::poweredBy' to hide server technology
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 🔧 Custom Middleware

You can add your own custom middleware:

### Creating Custom Middleware

1. **Create middleware file**:
   ```typescript
   // config/middlewares/custom-logger.ts
   export default (config, { strapi }) => {
     return async (ctx, next) => {
       console.log('Custom middleware:', ctx.request.url);
       await next();
     };
   };
   ```

2. **Add to middlewares.ts**:
   ```typescript
   export default [
     'strapi::logger',
     './middlewares/custom-logger',  // Your custom middleware
     'strapi::errors',
     // ... rest
   ];
   ```

### Custom Middleware Use Cases

- **Rate limiting** - Prevent API abuse
- **Request validation** - Validate data before routes
- **Custom logging** - Log to external services
- **API versioning** - Handle different API versions
- **Request transformation** - Modify requests/responses

## 📋 Execution Order

**Order matters!** Middleware executes in the order you define:

```
Request → Middleware 1 → Middleware 2 → ... → Routes → Response
```

### Recommended Order

1. **Logger** - Log requests first
2. **Errors** - Catch errors early
3. **Security** - Apply security headers early
4. **CORS** - Handle preflight requests
5. **Query/Body** - Parse request data
6. **Session** - Initialize sessions
7. **Routes** - Your API routes (handled by Strapi)
8. **Public** - Serve static files last (fallback)

## ⚠️ Common Issues & Solutions

### CORS Errors
**Problem**: Frontend can't access API
```typescript
// ❌ Wrong
origin: '*',  // Too permissive, may not work with credentials

// ✅ Correct
origin: ['http://localhost:3000'],  // Specific origins
credentials: true,  // If using cookies/auth
```

### Body Parser Not Working
**Problem**: `ctx.request.body` is undefined
```typescript
// ✅ Ensure 'strapi::body' is before routes
export default [
  // ... other middlewares
  'strapi::body',  // Must be before routes
  // ...
];
```

### Static Files Not Serving
**Problem**: Images/files return 404
```typescript
// ✅ Ensure 'strapi::public' is last
export default [
  // ... all other middlewares
  'strapi::public',  // Should be last
];
```

## 🎯 Best Practices

### 1. Keep Default Middlewares
Don't remove essential middlewares unless you have a specific reason:
- `strapi::errors` - Always needed
- `strapi::security` - Always needed
- `strapi::body` - Needed for POST/PUT
- `strapi::public` - Needed for media files

### 2. Configure CORS Properly
- Use specific origins, not `*`
- Enable credentials if using cookies/auth
- Test with your frontend application

### 3. Order Matters
- Logger first
- Errors early
- Security early
- Public last

### 4. Environment-Specific Config
```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000'],
    },
  },
  // ... rest
];
```

### 5. Remove Powered-By Header in Production
```typescript
// Remove 'strapi::poweredBy' for security
export default [
  // ... other middlewares
  // 'strapi::poweredBy',  // Commented out
  // ... rest
];
```

## 👀 Seeing Middlewares in Action

Unlike UI or API responses, middlewares work "behind the scenes." Here are practical ways to verify they're working:

### Method 1: Browser Developer Tools (Easiest)

1. Open DevTools (`F12`) → **Network** tab
2. Make a request to your Strapi API
3. Click the request → **Headers** tab

**Look for middleware headers**:
- **Security**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
- **CORS**: `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`
- **Powered-By**: `X-Powered-By: Strapi`

### Method 2: Command Line (cURL)

```bash
# Check all response headers
curl -I http://localhost:1337/api/articles

# Test CORS preflight
curl -X OPTIONS http://localhost:1337/api/articles \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Check security headers
curl -I http://localhost:1337/api/articles | grep -i "x-"
```

**Example Output**:
```
HTTP/1.1 200 OK
X-Powered-By: Strapi                    ← poweredBy middleware
X-Content-Type-Options: nosniff         ← security middleware
Access-Control-Allow-Origin: http://localhost:3000  ← CORS middleware
```

### Method 3: Server Console Logs

The `strapi::logger` middleware logs every request:

```bash
# Start Strapi and watch console
npm run develop
```

**Console Output**:
```
[2024-01-16 10:30:45.123] http: GET /api/articles 200 in 45ms  ← logger working
```

### Quick Verification Checklist

```bash
# 1. Logger - check console for request logs
curl http://localhost:1337/api/articles

# 2. Security headers
curl -I http://localhost:1337/api/articles | grep -i "x-content-type\|x-frame"

# 3. CORS headers
curl -I -H "Origin: http://localhost:3000" http://localhost:1337/api/articles | grep -i "access-control"

# 4. Static files
curl -I http://localhost:1337/uploads/test.jpg

# 5. Body parser (POST with JSON)
curl -X POST http://localhost:1337/api/articles \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# 6. Error handling
curl http://localhost:1337/api/nonexistent
```

### Visual Indicators

✅ **Logger**: Request logs appear in Strapi console  
✅ **Security**: Response headers include `X-Content-Type-Options`, `X-Frame-Options`  
✅ **CORS**: Frontend requests work without CORS errors, headers present  
✅ **Body Parser**: POST/PUT requests with JSON work correctly  
✅ **Static Files**: Images/files accessible via URL  
✅ **Error Handler**: Errors return formatted JSON (not raw stack traces)

## 📝 Summary

✅ **Middleware processes requests/responses in a pipeline**
✅ **`config/middlewares.ts` controls all middleware behavior**
✅ **Order matters - configure in the right sequence**
✅ **CORS is critical for frontend applications**
✅ **Built-in middlewares handle common needs**
✅ **Custom middleware can extend functionality**

The `middlewares.ts` file is your **control center** for how Strapi handles every request. Configure it carefully based on your application's needs!

