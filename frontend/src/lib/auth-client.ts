import { createAuthClient } from 'better-auth/react';

// Il client Better Auth si collega a window.location.origin in modo che le chiamate
// transitino attraverso il proxy Vite (/api) su localhost, LAN o Tailscale
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
});

export const { signIn, signUp, signOut, useSession } = authClient;
