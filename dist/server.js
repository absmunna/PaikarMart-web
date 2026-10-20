// Forwarder bridge for Render start commands
// Supports: node dist/server.js
import('../apps/backend/dist/server.js').catch((err) => {
  console.error('[PaikarMart Server Bridge] Fatal error loading apps/backend/dist/server.js:', err);
  process.exit(1);
});
