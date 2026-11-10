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
    const { status, search, sortBy } = request.query;
    const tasks = taskStore.getAll({ status, query: search, sortBy });
    return reply.status(200).send(tasks);
  });

  // GET /api/tasks/stats - Statistiche dei task
  fastify.get('/tasks/stats', async (_request, reply) => {
    const stats = taskStore.getStats();
    return reply.status(200).send(stats);
  });

  // GET /api/tasks/:id - Singolo task
  fastify.get<{
    Params: { id: string };
  }>('/tasks/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    const task = taskStore.getById(id);
    if (!task) {
      return reply.status(404).send({ error: 'Task non trovato' });
    }

    return reply.status(200).send(task);
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
      const newTask = taskStore.create({ text, priority, category });
      return reply.status(201).send(newTask);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore nella creazione del task';
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

    const updated = taskStore.update(id, request.body || {});
    if (!updated) {
      return reply.status(404).send({ error: 'Task non trovato' });
    }

    return reply.status(200).send(updated);
  });

  // PATCH /api/tasks/:id/toggle - Inverte lo stato completed
  fastify.patch<{
    Params: { id: string };
  }>('/tasks/:id/toggle', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    const toggled = taskStore.toggle(id);
    if (!toggled) {
      return reply.status(404).send({ error: 'Task non trovato' });
    }

    return reply.status(200).send(toggled);
  });

  // DELETE /api/tasks/:id - Elimina un task
  fastify.delete<{
    Params: { id: string };
  }>('/tasks/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'ID non valido' });
    }

    const deleted = taskStore.delete(id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Task non trovato' });
    }

    return reply.status(200).send(deleted);
  });

  // POST /api/tasks/restore - Ripristina un task precedentemente eliminato
  fastify.post<{
    Body: { task: Task };
  }>('/tasks/restore', async (request, reply) => {
    const { task } = request.body || {};
    if (!task || !task.id || !task.text) {
      return reply.status(400).send({ error: 'Oggetto task non valido per il ripristino' });
    }

    const restored = taskStore.restore(task);
    return reply.status(200).send(restored);
  });

  // POST /api/tasks/clear-completed - Rimuove tutti i task completati
  fastify.post('/tasks/clear-completed', async (_request, reply) => {
    const result = taskStore.clearCompleted();
    return reply.status(200).send(result);
  });

  // POST /api/tasks/toggle-all - Inverte lo stato di tutti i task
  fastify.post('/tasks/toggle-all', async (_request, reply) => {
    const result = taskStore.toggleAll();
    return reply.status(200).send(result);
  });

  // POST /api/tasks/reset - Ripristina i dati demo iniziali
  fastify.post('/tasks/reset', async (_request, reply) => {
    const tasks = taskStore.reset();
    return reply.status(200).send(tasks);
  });
};
