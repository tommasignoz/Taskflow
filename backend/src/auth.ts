import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index.js';
import * as schema from './db/schema.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: (request) => {
    const origin = request?.headers?.get?.('origin');
    const defaults = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://192.168.1.14:5173',
      'http://192.168.1.14:3001',
    ];
    if (origin) {
      return [...new Set([...defaults, origin])];
    }
    return defaults;
  },
  secret: process.env.BETTER_AUTH_SECRET || 'taskflow-super-secret-key-32-chars-long-minimum-needed',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
});
