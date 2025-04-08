import { FastifyInstance } from 'fastify';
import { db } from '../db/client';
import { todos } from '../db/schema';
import { eq } from 'drizzle-orm';

// Todo interfaces for TypeScript
interface TodoParams {
  id: number;
}

interface TodoBody {
  title: string;
  description?: string;
  completed?: number;
  userId: number;
}

interface TodoQuerystring {
  userId?: number;
}

// Define schemas for validation
const todoParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'number' }
  }
};

const todoBodySchema = {
  type: 'object',
  required: ['title', 'userId'],
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    completed: { type: 'number', enum: [0, 1], default: 0 },
    userId: { type: 'number' }
  }
};

const todoQuerySchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' }
  }
};

const todoResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string', nullable: true },
    completed: { type: 'number' },
    userId: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

const todosResponseSchema = {
  type: 'array',
  items: todoResponseSchema
};

// Export routes as a plugin
export default async function todoRoutes(fastify: FastifyInstance) {
  // Get all todos (optionally filtered by userId)
  fastify.get<{
    Querystring: TodoQuerystring,
    Reply: any[]
  }>('/', {
    schema: {
      querystring: todoQuerySchema,
      response: {
        200: todosResponseSchema
      }
    }
  }, async (request, reply) => {
    const { userId } = request.query;
    
    if (userId) {
      return await db.select().from(todos).where(eq(todos.userId, userId));
    }
    
    return await db.select().from(todos);
  });

  // Get a single todo by ID
  fastify.get<{
    Params: TodoParams,
    Reply: any
  }>('/:id', {
    schema: {
      params: todoParamsSchema,
      response: {
        200: todoResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    
    const result = await db.select().from(todos).where(eq(todos.id, id));
    
    if (!result.length) {
      reply.code(404);
      return { error: 'Todo not found' };
    }
    
    return result[0];
  });

  // Create a new todo
  fastify.post<{
    Body: TodoBody,
    Reply: any
  }>('/', {
    schema: {
      body: todoBodySchema,
      response: {
        201: todoResponseSchema
      }
    }
  }, async (request, reply) => {
    const todo = request.body;
    
    const result = await db.insert(todos).values(todo).returning();
    
    reply.code(201);
    return result[0];
  });

  // Update a todo
  fastify.put<{
    Params: TodoParams,
    Body: TodoBody,
    Reply: any
  }>('/:id', {
    schema: {
      params: todoParamsSchema,
      body: todoBodySchema,
      response: {
        200: todoResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const todo = request.body;
    
    const result = await db.update(todos)
      .set({
        ...todo,
        updatedAt: new Date()
      })
      .where(eq(todos.id, id))
      .returning();
    
    if (!result.length) {
      reply.code(404);
      return { error: 'Todo not found' };
    }
    
    return result[0];
  });

  // Delete a todo
  fastify.delete<{
    Params: TodoParams,
    Reply: { success: boolean } | { error: string }
  }>('/:id', {
    schema: {
      params: todoParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    
    if (!result.length) {
      reply.code(404);
      return { error: 'Todo not found' };
    }
    
    return { success: true };
  });
} 