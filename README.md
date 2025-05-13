# CMS Starter

Startup your CMS using cms-starter! Includes basic auth using JWT & cookies, CRUD for users, and a setting to manage your allowed hosts (CSRF stuff). Easy to setup! After cloning the project, just run the npm commands below.

### Pre-requisite

1. Docker daemon running in background

### Pull the project

```bash
git clone https://github.com/silverlunah/cms-starter.git
```

## Development (Local)

Make sure mysql is running. You can run mysql docker daemon if you want.

### Starting the frontend and backend projects

This is using `concurrently` so you can just take down both processes using ctrl+c / cmd+c

```bash
npm run local:up
```

### Starting the backend project

```bash
npm run local:backend:up
```

### Starting the frontend project

```bash
npm run local:frontend:up
```

## Prisma

1. When you modify a model or add a new one at `schema.prisma`
2. Run:

```bash
npm run prisma:update:table
```

3. For full database reset (You will lose all data):

```bash
npm run prisma:migrate:reset
```

## Developing (Docker)

### Starting the project using Docker (Production Simulation)

This is how the project is run in production.

```bash
npm run docker:up
```

### Stopping the Docker containers

```bash
npm run docker:down
```

### Restarting the Docker containers

```bash
npm run docker:restart
```

## Do Not Forget

1. Add your main website's URL to allowed_hosts db

## Initial Login

On first login, you can use:

- Email: admin@admin.com
- Password: test

## Production Tips

1. Remove mysql port in your production docker-compose.yml, this is so that your db is only accessible in your docker network

```bash
ports:
      - "3006:3006"
```

2. You don't need to worry about prisma commands since production uses "deploy" instead of "dev"
