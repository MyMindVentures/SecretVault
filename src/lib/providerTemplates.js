export const providerTemplates = {
  openai: {
    title: 'OpenAI',
    detectors: [
      /openai/i,
      /VITE?_OPENAI_API_KEY/,
      /from\s+['"]openai['"]/,
      /gpt-?\d|whisper|dall-?e/i,
    ],
    secrets: [
      { key: 'VITE_OPENAI_API_KEY', sample: 'sk-...', required: true },
    ],
    docs: 'https://platform.openai.com/api-keys',
  },
  anthropic: {
    title: 'Anthropic',
    detectors: [
      /anthropic/i,
      /VITE?_ANTHROPIC_API_KEY/,
      /from\s+['"]@anthropic-ai\//,
      /claude/i,
    ],
    secrets: [
      { key: 'VITE_ANTHROPIC_API_KEY', sample: 'sk-ant-...', required: true },
    ],
    docs: 'https://console.anthropic.com/keys',
  },
  auth0: {
    title: 'Auth0',
    detectors: [/auth0/i, /VITE?_AUTH0_/],
    secrets: [
      { key: 'VITE_AUTH0_DOMAIN', sample: 'your-tenant.auth0.com', required: true },
      { key: 'VITE_AUTH0_CLIENT_ID', sample: 'xxxxxxxx', required: true },
      { key: 'VITE_AUTH0_AUDIENCE', sample: 'https://api.example.com', required: false },
    ],
    docs: 'https://manage.auth0.com/dashboard',
  },
  stripe: {
    title: 'Stripe',
    detectors: [/stripe/i, /VITE?_STRIPE_/],
    secrets: [
      { key: 'VITE_STRIPE_PUBLISHABLE_KEY', sample: 'pk_live_...', required: true },
      { key: 'VITE_STRIPE_SECRET_KEY', sample: 'sk_live_...', required: true },
      { key: 'VITE_STRIPE_WEBHOOK_SECRET', sample: 'whsec_...', required: false },
    ],
    docs: 'https://dashboard.stripe.com/apikeys',
  },
  sentry: {
    title: 'Sentry',
    detectors: [/sentry/i, /VITE?_SENTRY_DSN/],
    secrets: [
      { key: 'VITE_SENTRY_DSN', sample: 'https://xxx@o0.ingest.sentry.io/0', required: false },
    ],
    docs: 'https://sentry.io',
  },
  ga4: {
    title: 'Google Analytics 4',
    detectors: [/google-?analytics|gtag|GA-\w+/i, /VITE?_GOOGLE_ANALYTICS_ID/],
    secrets: [
      { key: 'VITE_GOOGLE_ANALYTICS_ID', sample: 'GA-XXXXXXXXX', required: false },
    ],
    docs: 'https://analytics.google.com',
  },
};

export function listAllSecretsFor(providers) {
  const keys = new Map();
  providers.forEach((p) => {
    const tpl = providerTemplates[p];
    if (!tpl) return;
    tpl.secrets.forEach((s) => {
      if (!keys.has(s.key)) keys.set(s.key, { ...s, provider: p });
    });
  });
  return Array.from(keys.values());
}



