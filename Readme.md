<h1>Notes Service</h1>

## Description
The following components and tools are used in this API:

- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)

## Pre-requisites
The following is required to run the service locally:

- Docker

## Start up
copy .env.example into .env

Run the following commands to start the service locally

```bash
docker-compose build
docker-compose up
```

API docs
http://localhost:3201/api-docs

## Testing 
Run the following command to test

```bash
npm run test
```