import helmet from 'helmet';

export const helmetMiddleware = helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // AI Studio needs to inject scripts/styles in the preview
  frameguard: false, // Allows embedding in AI Studio iframe
});
