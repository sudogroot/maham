import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/client';
import { todos } from '../db/schema';
import { eq } from 'drizzle-orm';

// Zod schemas for validation with type inference
const TodoParams = z.object({
  id: z.coerce.number()
});
type TodoParamsType = z.infer<typeof TodoParams>;

const TodoBody = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  completed: z.number().int().min(0).max(1).default(0),
  userId: z.number().int().positive()
});
type TodoBodyType = z.infer<typeof TodoBody>;

const TodoQuery = z.object({
  userId: z.number().int().positive().optional()
});
type TodoQueryType = z.infer<typeof TodoQuery>;

// Response type schemas
const TodoResponse = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.number(),
  userId: z.number(),
  createdAt: z.string().or(z.date()).transform(val => 
    val instanceof Date ? val.toISOString() : val
  ),
  updatedAt: z.string().or(z.date()).transform(val => 
    val instanceof Date ? val.toISOString() : val
  )
});

const ErrorResponse = z.object({
  error: z.string()
});

// Convert Zod schema to JSON schema for Fastify
function zodToJsonSchema(schema: z.ZodObject<any>) {
  return {
    type: 'object',
    properties: Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]: [string, any]) => {
        let type = 'string';
        if (value._def.typeName === 'ZodNumber') type = 'number';
        if (value._def.typeName === 'ZodBoolean') type = 'boolean';
        return [key, { type }];
      })
    )
  };
}

// Helper function to format database records
function formatTodoRecord(record: any) {
  return {
    ...record,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
  };
}

// Export routes as a plugin
export default async function todoRoutes(fastify: FastifyInstance) {
  // Get all todos (optionally filtered by userId)
  fastify.get<{
    Querystring: TodoQueryType,
    Reply: z.infer<typeof TodoResponse>[]
  }>('/', {
    schema: {
      querystring: zodToJsonSchema(TodoQuery),
      response: {
        200: {
          type: 'array',
          items: zodToJsonSchema(TodoResponse)
        }
      }
    }
  }, async (request) => {
    const query = TodoQuery.parse(request.query);
    const { userId } = query;
    
    let result;
    if (userId) {
      result = await db.select().from(todos).where(eq(todos.userId, userId));
    } else {
      result = await db.select().from(todos);
    }
    
    // Format the dates
    return result.map(formatTodoRecord);
  });

  // Get a single todo by ID
  fastify.get<{
    Params: TodoParamsType,
    Reply: z.infer<typeof TodoResponse> | z.infer<typeof ErrorResponse>
  }>('/:id', {
    schema: {
      params: zodToJsonSchema(TodoParams),
      response: {
        200: zodToJsonSchema(TodoResponse),
        404: zodToJsonSchema(ErrorResponse)
      }
    }
  }, async (request, reply) => {
    const params = TodoParams.parse(request.params);
    const { id } = params;
    
    const result = await db.select().from(todos).where(eq(todos.id, id));
    
    if (!result.length) {
      reply.code(404);
      return { error: 'Todo not found' };
    }
    
    // Format the dates
    return formatTodoRecord(result[0]);
  });

  // Create a new todo
  fastify.post<{
    Body: TodoBodyType,
    Reply: z.infer<typeof TodoResponse>
  }>('/', {
    schema: {
      body: zodToJsonSchema(TodoBody),
      response: {
        201: zodToJsonSchema(TodoResponse)
      }
    }
  }, async (request, reply) => {
    const todo = TodoBody.parse(request.body);
    
    const result = await db.insert(todos).values(todo).returning();
    
    reply.code(201);
    // Format the dates
    return formatTodoRecord(result[0]);
  });

  // Update a todo
  fastify.put<{
    Params: TodoParamsType,
    Body: TodoBodyType,
    Reply: z.infer<typeof TodoResponse> | z.infer<typeof ErrorResponse>
  }>('/:id', {
    schema: {
      params: zodToJsonSchema(TodoParams),
      body: zodToJsonSchema(TodoBody),
      response: {
        200: zodToJsonSchema(TodoResponse),
        404: zodToJsonSchema(ErrorResponse)
      }
    }
  }, async (request, reply) => {
    const params = TodoParams.parse(request.params);
    const { id } = params;
    const todo = TodoBody.parse(request.body);
    
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
    
    // Format the dates
    return formatTodoRecord(result[0]);
  });

  // Delete a todo
  fastify.delete<{
    Params: TodoParamsType,
    Reply: { success: boolean } | z.infer<typeof ErrorResponse>
  }>('/:id', {
    schema: {
      params: zodToJsonSchema(TodoParams),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        },
        404: zodToJsonSchema(ErrorResponse)
      }
    }
  }, async (request, reply) => {
    const params = TodoParams.parse(request.params);
    const { id } = params;
    
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    
    if (!result.length) {
      reply.code(404);
      return { error: 'Todo not found' };
    }
    
    return { success: true };
  });
} 