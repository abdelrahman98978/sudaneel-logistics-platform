const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redirect root to client-portal login
  if (pathname === '/' || pathname === '') {
    res.writeHead(302, { 'Location': '/features/client-portal/login.html' });
    return res.end();
  }

  // Legacy redirects mapping
  const legacyRedirects = {
    '/_21/login.html': '/features/client-portal/login.html',
    '/_21/code.html': '/features/client-portal/index.html',
    '/_12/code.html': '/features/shipment-tracking/index.html',
    '/_15/code.html': '/features/warehouse-inventory/index.html',
    '/_20/code.html': '/features/operations-control/index.html',
    '/_14/code.html': '/features/billing-documents/index.html',
    '/_8/code.html': '/features/services-catalog/index.html',
    '/_7/code.html': '/features/company-profile/index.html',
    '/_3/code.html': '/features/contact-support/index.html',
    '/_7/help.html': '/features/legal-compliance/help.html',
    '/_7/privacy.html': '/features/legal-compliance/privacy.html',
    '/_7/terms.html': '/features/legal-compliance/terms.html'
  };

  if (legacyRedirects[pathname]) {
    res.writeHead(301, { 'Location': legacyRedirects[pathname] });
    return res.end();
  }

  let filePath = path.join(ROOT, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try appending index.html if it's a directory
      let indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`<h1>404 - Not Found</h1><p>Path ${pathname} does not exist.</p><a href="/features/client-portal/login.html">Go to Client Portal</a>`);
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('500 Internal Server Error');
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Sudanil Logistics Platform running locally at: http://localhost:${PORT}`);
  console.log(`📍 Client Portal: http://localhost:${PORT}/features/client-portal/login.html`);
});
