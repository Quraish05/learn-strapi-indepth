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
**Purpose**: Adds `X-Powered-By` header

**When it runs**: Before response is sent

**Configuration**:
```typescript
'strapi::poweredBy'  // Default: adds "Strapi" header
```

**What it does**:
- Adds `X-Powered-By: Strapi` header
- Can be disabled for security (hiding server technology)

---

### 6. `strapi::query`
**Purpose**: Parses query string parameters

**When it runs**: Before routes to parse `?key=value` params

**Configuration**:
```typescript
'strapi::query'  // Default: parses all query params
```

**What it does**:
- Parses URL query strings (`?page=1&limit=10`)
- Makes params available in `ctx.query`
- Essential for filtering, pagination, sorting

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
**Purpose**: Serves favicon.ico

**When it runs**: Before routes to serve favicon quickly

**Configuration**:
```typescript
'strapi::favicon'  // Default: serves from public/favicon.ico
```

**What it does**:
- Serves the favicon file
- Prevents 404 errors for favicon requests

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

Unlike UI or API responses that you can directly see, middlewares work "behind the scenes." However, there are several ways to verify they're working correctly.

### Method 1: Browser Developer Tools (Easiest)

The easiest way to see middlewares in action is through your browser's developer tools.

#### Step 1: Open Developer Tools
1. Open your browser (Chrome, Firefox, Edge)
2. Press `F12` or `Right-click → Inspect`
3. Go to the **Network** tab

#### Step 2: Make a Request
- Visit your Strapi API: `http://localhost:1337/api/articles`
- Or make a request from your frontend app

#### Step 3: Inspect Response Headers

Click on any request and check the **Headers** tab. You'll see middleware in action:

**Security Middleware (`strapi::security`)**:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

**CORS Middleware (`strapi::cors`)**:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Powered-By Middleware (`strapi::poweredBy`)**:
```
X-Powered-By: Strapi
```

**Example: Check CORS Headers**
```bash
# In browser console, check response headers:
fetch('http://localhost:1337/api/articles')
  .then(res => {
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': res.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.headers.get('Access-Control-Allow-Credentials'),
    });
  });
```

---

### Method 2: Command Line with cURL

Use `curl` to inspect HTTP headers and verify middleware behavior.

#### Check All Response Headers
```bash
# See all headers (including middleware-added ones)
curl -I http://localhost:1337/api/articles

# Or with verbose output
curl -v http://localhost:1337/api/articles
```

**Example Output**:
```
HTTP/1.1 200 OK
X-Powered-By: Strapi                    ← poweredBy middleware
X-Content-Type-Options: nosniff         ← security middleware
X-Frame-Options: SAMEORIGIN             ← security middleware
Access-Control-Allow-Origin: http://localhost:3000  ← CORS middleware
Content-Type: application/json
```

#### Test CORS Preflight Request
```bash
# Simulate a CORS preflight (OPTIONS request)
curl -X OPTIONS http://localhost:1337/api/articles \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected Response**:
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

#### Test Security Headers
```bash
# Check security headers
curl -I http://localhost:1337/api/articles | grep -i "x-"
```

---

### Method 3: Server Console Logs

The `strapi::logger` middleware logs every request to your console.

#### View Request Logs
When you make a request, check your Strapi server console:

```bash
# Start Strapi
npm run develop
```

**Example Console Output**:
```
[2024-01-16 10:30:45.123] http: GET /api/articles 200 in 45ms  ← logger middleware
[2024-01-16 10:30:46.456] http: POST /api/articles 201 in 123ms
[2024-01-16 10:30:47.789] http: GET /uploads/image.jpg 200 in 12ms
```

This shows:
- ✅ **Logger middleware is working** - requests are being logged
- ✅ **Timing information** - response time is recorded
- ✅ **Status codes** - HTTP status is logged

---

### Method 4: Custom Middleware for Verification

Create a simple custom middleware to see execution flow:

#### Create Verification Middleware
```typescript
// config/middlewares/request-tracker.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    const start = Date.now();
    console.log('🔵 Middleware: Request started', {
      method: ctx.request.method,
      url: ctx.request.url,
      timestamp: new Date().toISOString(),
    });
    
    await next();
    
    const duration = Date.now() - start;
    console.log('🟢 Middleware: Request completed', {
      method: ctx.request.method,
      url: ctx.request.url,
      status: ctx.response.status,
      duration: `${duration}ms`,
    });
  };
};
```

#### Add to middlewares.ts
```typescript
export default [
  'strapi::logger',
  './middlewares/request-tracker',  // Your custom tracker
  'strapi::errors',
  // ... rest
];
```

**Console Output**:
```
🔵 Middleware: Request started { method: 'GET', url: '/api/articles', ... }
[2024-01-16 10:30:45.123] http: GET /api/articles 200 in 45ms
🟢 Middleware: Request completed { method: 'GET', status: 200, duration: '45ms' }
```

---

### Method 5: Test Each Middleware Individually

#### Test Logger Middleware
```bash
# Make any request and check console
curl http://localhost:1337/api/articles
# ✅ Should see log in Strapi console
```

#### Test CORS Middleware
```bash
# Test from different origin
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:1337/api/articles -v

# ✅ Should see CORS headers in response
```

#### Test Body Parser Middleware
```bash
# Send JSON data
curl -X POST http://localhost:1337/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Body parser test"}'

# ✅ If body parser works, data should be received
# ❌ If not working, you'll get parsing errors
```

#### Test Static File Middleware
```bash
# Try to access a static file
curl -I http://localhost:1337/uploads/some-image.jpg

# ✅ Should return 200 with file headers
# ❌ If middleware not working, returns 404
```

#### Test Security Middleware
```bash
# Check security headers
curl -I http://localhost:1337/api/articles | grep -E "(X-Content-Type|X-Frame|X-XSS)"

# ✅ Should see security headers
```

#### Test Error Middleware
```bash
# Make a request that will fail
curl http://localhost:1337/api/nonexistent

# ✅ Should get formatted error response (not raw error)
# Response should be JSON: {"error": {...}}
```

---

### Method 6: Browser Network Tab - Detailed Inspection

#### Step-by-Step Verification

1. **Open Network Tab** in browser DevTools
2. **Make a Request** to your Strapi API
3. **Click on the Request** to see details
4. **Check These Tabs**:

**Headers Tab**:
- **Request Headers**: See what your browser sent
- **Response Headers**: See what Strapi sent (middleware-added headers)

**Preview/Response Tab**:
- See the actual response body
- Verify error formatting (error middleware)

**Timing Tab**:
- See request/response timing
- Verify logger middleware timing matches

**Example: Verify CORS is Working**
```
Request URL: http://localhost:1337/api/articles
Request Method: GET
Status Code: 200 OK

Response Headers:
  Access-Control-Allow-Origin: http://localhost:3000  ← CORS working!
  Access-Control-Allow-Credentials: true
  X-Content-Type-Options: nosniff  ← Security working!
  X-Powered-By: Strapi  ← PoweredBy working!
```

---

### Method 7: Test with Postman or Insomnia

API testing tools show all headers clearly:

#### Using Postman
1. Create a new request to `http://localhost:1337/api/articles`
2. Send the request
3. Check the **Headers** tab in the response
4. Look for middleware-added headers

#### Using Insomnia
1. Create a request
2. Send it
3. Expand **Response → Headers**
4. Verify middleware headers are present

---

### Method 8: Verify Middleware Order

Create a middleware that logs its position:

```typescript
// config/middlewares/middleware-1.ts
export default () => {
  return async (ctx, next) => {
    console.log('1️⃣ First middleware');
    await next();
  };
};

// config/middlewares/middleware-2.ts
export default () => {
  return async (ctx, next) => {
    console.log('2️⃣ Second middleware');
    await next();
  };
};
```

```typescript
// config/middlewares.ts
export default [
  './middlewares/middleware-1',
  './middlewares/middleware-2',
  'strapi::logger',
  // ...
];
```

**Console Output** (shows execution order):
```
1️⃣ First middleware
2️⃣ Second middleware
[2024-01-16 10:30:45.123] http: GET /api/articles 200 in 45ms
```

---

### Quick Verification Checklist

Run these commands to verify all middlewares:

```bash
# 1. Check logger (should see logs in console)
curl http://localhost:1337/api/articles

# 2. Check security headers
curl -I http://localhost:1337/api/articles | grep -i "x-content-type\|x-frame\|x-xss"

# 3. Check CORS
curl -I -H "Origin: http://localhost:3000" http://localhost:1337/api/articles | grep -i "access-control"

# 4. Check powered-by
curl -I http://localhost:1337/api/articles | grep -i "x-powered-by"

# 5. Check static files
curl -I http://localhost:1337/uploads/test.jpg

# 6. Check body parser (POST with JSON)
curl -X POST http://localhost:1337/api/articles \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# 7. Check error handling
curl http://localhost:1337/api/nonexistent
```

---

### Visual Indicators That Middlewares Are Working

✅ **Logger Middleware Working**:
- See request logs in Strapi console
- Logs show method, URL, status, and timing

✅ **Security Middleware Working**:
- Response headers include `X-Content-Type-Options`, `X-Frame-Options`
- No security warnings in browser console

✅ **CORS Middleware Working**:
- Frontend can make requests without CORS errors
- Response includes `Access-Control-Allow-Origin` header
- Preflight OPTIONS requests return 204

✅ **Body Parser Working**:
- POST/PUT requests with JSON body work correctly
- `ctx.request.body` contains parsed data
- No parsing errors in console

✅ **Static File Middleware Working**:
- Images/files are accessible via URL
- Files in `public/uploads/` are served
- No 404 errors for static assets

✅ **Error Middleware Working**:
- Errors return formatted JSON responses
- No raw stack traces exposed
- Consistent error format

---

## 🔍 Debugging Middleware

### Check Middleware Order
```typescript
// Add logging to see execution order
export default [
  'strapi::logger',  // Will log first
  // ... rest
];
```

### Test CORS Configuration
```bash
# Test from browser console
fetch('http://localhost:1337/api/articles', {
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
```

### Verify Static Files
```bash
# Check if files are accessible
curl http://localhost:1337/uploads/image.jpg
```

## 📝 Summary

✅ **Middleware processes requests/responses in a pipeline**
✅ **`config/middlewares.ts` controls all middleware behavior**
✅ **Order matters - configure in the right sequence**
✅ **CORS is critical for frontend applications**
✅ **Built-in middlewares handle common needs**
✅ **Custom middleware can extend functionality**

The `middlewares.ts` file is your **control center** for how Strapi handles every request. Configure it carefully based on your application's needs!

