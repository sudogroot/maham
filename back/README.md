# Backend

This is a TypeScript backend built with [Fastify 5.2.x](https://fastify.io/), [Drizzle ORM](https://orm.drizzle.team/), [tRPC](https://trpc.io/), and PostgreSQL.

## Features

- 🚀 Fastify 5.2.x with Zod integration for validation
- 🌟 TypeScript with full type safety and generics
- 🧱 Drizzle ORM for database interactions with PostgreSQL
- 🔄 tRPC for end-to-end typesafe API
- 🐳 Docker for PostgreSQL database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL using Docker:

```bash
docker-compose up -d
```

3. Generate migrations:

```bash
npm run db:generate
```

4. Run migrations:

```bash
npm run db:migrate
```

5. Seed the database (optional):

```bash
npm run db:seed
```

## Development

Start the development server:

```bash
npm run dev
```

The server will run on port 3000 by default.

## Build and Production

Build the project:

```bash
npm run build
```

Start the server in production:

```bash
npm start
```

## API Endpoints

### REST Endpoints
- `GET /health`: Health check endpoint (native Fastify validation)
- `GET /greeting?name=John`: Example greeting endpoint (Zod validation)
- `GET /todos`: Get all todos (Zod validation)
- `GET /todos/:id`: Get a specific todo
- `POST /todos`: Create a new todo
- `PUT /todos/:id`: Update a todo
- `DELETE /todos/:id`: Delete a todo

### tRPC Endpoints
- `/trpc/hello`: Example tRPC endpoint (can be accessed via tRPC client)

## Type Safety with Zod

This backend uses Zod for schema validation and type safety. Here's how:

1. **Define Schema Once**:

```typescript
// Define schema with Zod
const GreetingQuery = z.object({
  name: z.string().optional()
});
type GreetingQueryType = z.infer<typeof GreetingQuery>;
```

2. **Use Schema for Validation**:

```typescript
// Helper function to convert Zod schema to Fastify JSON schema
function zodToJsonSchema(schema) {
  return {
    type: 'object',
    properties: Object.fromEntries(
      Object.entries(schema.shape).map(([key, value]) => {
        let type = 'string';
        if (value._def.typeName === 'ZodNumber') type = 'number';
        if (value._def.typeName === 'ZodBoolean') type = 'boolean';
        return [key, { type }];
      })
    )
  };
}

server.get<{
  Querystring: GreetingQueryType,
  Reply: { greeting: string }
}>('/greeting', {
  schema: {
    querystring: zodToJsonSchema(GreetingQuery),
    response: {
      200: {
        type: 'object',
        properties: {
          greeting: { type: 'string' }
        },
        required: ['greeting']
      }
    }
  }
}, async (request) => {
  const query = GreetingQuery.parse(request.query);
  const { name = 'world' } = query;
  return { greeting: `Hello, ${name}!` };
});
```

3. **Parse Input at Runtime**:

Zod validates your inputs at runtime:

```typescript
const query = GreetingQuery.parse(request.query);
```

This approach gives you both TypeScript type safety and runtime validation.