import type { FastifyPluginAsync } from 'fastify';
import { taskStore } from '../store/taskStore.js';
import type {
  CreateTaskInput,
  UpdateTaskInput,
  FilterStatus,
  SortByOption,
  Task,
} from '../types/task.js';

export const taskRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/tasks - Ottieni tutti i task (con filtri e ordinamento opzionali)
  fastify.get<{
    Querystring: {
      status?: FilterStatus;
      search?: string;
      sortBy?: SortByOption;
    };
  }>('/tasks', async (request, reply) => {
    try {
      const { status, search, sortBy } = request.query;
      const tasks = await taskStore.getAll({ status, query: search, sortBy });
      return reply.status(200).send(tasks);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nel recupero dei task dal database' });
    }
  });

  // GET /api/tasks/stats - Statistiche dei task
  fastify.get('/tasks/stats', async (_request, reply) => {
    try {
      const stats = await taskStore.getStats();
      return reply.status(200).send(stats);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nel calcolo delle statistiche' });
    }
  });

  // GET /api/tasks/:id - Singolo task
  fastify.get<{
    Params: { id: string };
  }>('/tasks/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    try {
      const task = await taskStore.getById(id);
      if (!task) {
        return reply.status(404).send({ error: 'Task non trovato' });
      }
      return reply.status(200).send(task);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nel recupero del task' });
    }
  });

  // POST /api/tasks - Crea un nuovo task
  fastify.post<{
    Body: CreateTaskInput;
  }>('/tasks', async (request, reply) => {
    const { text, priority, category } = request.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return reply.status(400).send({ error: 'Il campo "text" è obbligatorio e non può essere vuoto' });
    }

    try {
      const newTask = await taskStore.create({ text, priority, category });
      return reply.status(201).send(newTask);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore nella creazione del task';
      fastify.log.error(err);
      return reply.status(400).send({ error: message });
    }
  });

  // PUT /api/tasks/:id - Aggiorna un task
  fastify.put<{
    Params: { id: string };
    Body: UpdateTaskInput;
  }>('/tasks/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    try {
      const updated = await taskStore.update(id, request.body || {});
      if (!updated) {
        return reply.status(404).send({ error: 'Task non trovato' });
      }
      return reply.status(200).send(updated);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nell\'aggiornamento del task' });
    }
  });

  // PATCH /api/tasks/:id/toggle - Inverte lo stato completed
  fastify.patch<{
    Params: { id: string };
  }>('/tasks/:id/toggle', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    try {
      const toggled = await taskStore.toggle(id);
      if (!toggled) {
        return reply.status(404).send({ error: 'Task non trovato' });
      }
      return reply.status(200).send(toggled);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nella modifica dello stato del task' });
    }
  });

  // DELETE /api/tasks/:id - Elimina un task
  fastify.delete<{
    Params: { id: string };
  }>('/tasks/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    try {
      const deleted = await taskStore.delete(id);
      if (!deleted) {
        return reply.status(404).send({ error: 'Task non trovato' });
      }
      return reply.status(200).send(deleted);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nella cancellazione del task' });
    }
  });

  // POST /api/tasks/restore - Ripristina un task precedentemente eliminato
  fastify.post<{
    Body: { task: Task };
  }>('/tasks/restore', async (request, reply) => {
    const { task } = request.body || {};
    if (!task || !task.id || !task.text) {
      return reply.status(400).send({ error: 'Oggetto task non valido per il ripristino' });
    }

    try {
      const restored = await taskStore.restore(task);
      return reply.status(200).send(restored);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nel ripristino del task' });
    }
  });

  // POST /api/tasks/clear-completed - Rimuove tutti i task completati
  fastify.post('/tasks/clear-completed', async (_request, reply) => {
    try {
      const result = await taskStore.clearCompleted();
      return reply.status(200).send(result);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nella cancellazione dei task completati' });
    }
  });

  // POST /api/tasks/toggle-all - Inverte lo stato di tutti i task
  fastify.post('/tasks/toggle-all', async (_request, reply) => {
    try {
      const result = await taskStore.toggleAll();
      return reply.status(200).send(result);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nell\'inversione dello stato dei task' });
    }
  });

  // POST /api/tasks/reset - Ripristina i dati demo iniziali
  fastify.post('/tasks/reset', async (_request, reply) => {
    try {
      const tasks = await taskStore.reset();
      return reply.status(200).send(tasks);
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore nel reset dei dati demo' });
    }
  });
};
