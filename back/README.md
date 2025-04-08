# Backend

This is a TypeScript backend built with [Fastify 5.2.x](https://fastify.io/), [Drizzle ORM](https://orm.drizzle.team/), [tRPC](https://trpc.io/), and PostgreSQL.

## Features

- 🚀 Fastify 5.2.x with typed routes and native schema validation
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
- `GET /health`: Health check endpoint
- `GET /greeting?name=John`: Example greeting endpoint
- `GET /todos`: Get all todos
- `GET /todos/:id`: Get a specific todo
- `POST /todos`: Create a new todo
- `PUT /todos/:id`: Update a todo
- `DELETE /todos/:id`: Delete a todo

### tRPC Endpoints
- `/trpc/hello`: Example tRPC endpoint (can be accessed via tRPC client)

## Type Safety

The backend is built with full type safety using TypeScript generics and Fastify's native schema validation:

```typescript
// Example of a typed route with schema validation
server.get<{
  Querystring: GreetingQuerystring,
  Reply: GreetingResponse
}>('/greeting', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    },
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
}, async (request, reply) => {
  const { name = 'world' } = request.query;
  return { greeting: `Hello, ${name}!` };
}); 