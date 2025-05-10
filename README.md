## Developing (Docker)

### Starting the project using Docker

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

## Developing (Local)

Make sure mysql is running. You can run mysql docker daemon if you want.

### Starting the backend project

```bash
npm run local:backend:up
```

### Starting the frontend project

```bash
npm run local:frontend:up
```

## Prisma

1. Modify model at `schema.prisma`
2. Update seeds if you want
3. Run:

```bash
npx prisma migrate dev --name migration-name
```

## Do Not Forget

1. Add your main website's URL to AllowedHosts db
