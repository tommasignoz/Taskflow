import type { FastifyPluginAsync } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth.js';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Endpoint protetto: GET /api/me
  // "proteggi anche l'endpoint /api/me utilizzando con lerrore 401"
  fastify.get('/me', async (request, reply) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session || !session.user) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Accesso negato. Autenticazione richiesta per accedere a /api/me.',
        });
      }

      return reply.status(200).send({
        authenticated: true,
        user: session.user,
        session: session.session,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Sessione non valida o scaduta.',
      });
    }
  });

  // Route catch-all per Better Auth (/api/auth/*)
  fastify.route({
    method: ['GET', 'POST'],
    url: '/auth/*',
    async handler(request, reply) {
      try {
        const protocol = request.protocol || 'http';
        const host = request.headers.host || 'localhost:3001';
        const url = new URL(request.url, `${protocol}://${host}`);

        const headers = fromNodeHeaders(request.headers);

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body:
            request.body && request.method !== 'GET'
              ? JSON.stringify(request.body)
              : undefined,
        });

        const response = await auth.handler(req);

        reply.status(response.status);

        // Inoltra tutti gli header della risposta
        response.headers.forEach((value: string, key: string) => {
          reply.header(key, value);
        });

        // Gestione corretta dei cookie di sessione Better Auth
        if (typeof (response.headers as any).getSetCookie === 'function') {
          const cookies = (response.headers as any).getSetCookie();
          if (cookies && cookies.length > 0) {
            reply.header('set-cookie', cookies);
          }
        }

        const responseText = await response.text();
        if (!responseText) {
          return reply.send();
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return reply.send(JSON.parse(responseText));
        }

        return reply.send(responseText);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Errore interno autenticazione' });
      }
    },
  });
};
