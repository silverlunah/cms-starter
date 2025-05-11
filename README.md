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

4. For major DB changes, delete migrations then run this first before migrating:

```bash
npx prisma migrate reset
```

## Do Not Forget

1. Add your main website's URL to allowed_hosts db

## Initial Login

On first login, you can use:

- Email: admin@admin.com
- Password: test

## Production

- Remove mysql port in your production docker-compose.yml, this is so that your db is only accessible in your docker network

```bash
ports:
      - "3006:3006"
```
