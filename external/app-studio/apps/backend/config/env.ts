export const backendEnv = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  corsOriginsRaw: process.env.CORS_ORIGINS || process.env.APP_URL || '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'project-233907df-3a7c-4179-9a0',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
  courierWebhookSecret: process.env.COURIER_WEBHOOK_SECRET || '',
};

export function getConfiguredCorsOrigins(): Set<string> {
  return new Set(
    backendEnv.corsOriginsRaw
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  );
}

export function isLiveDatabaseConfigured(): boolean {
  return Boolean(backendEnv.supabaseUrl && backendEnv.supabaseServiceRoleKey);
}

export function isPersistentFinanceEnabled(): boolean {
  return Boolean(isLiveDatabaseConfigured() && backendEnv.paymentWebhookSecret);
}

export function isCourierWebhookConfigured(): boolean {
  return Boolean(backendEnv.courierWebhookSecret);
}
