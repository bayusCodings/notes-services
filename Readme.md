<h1>Notes Service</h1>

## Description
The following components and tools are used in this API:

### [TypeScript](https://www.typescriptlang.org/)
- TypeScript is a statically-typed superset of JavaScript.
- It improves code readability, maintainability, and catches potential errors during development.
- TypeScript enables faster development, easier collaboration, and reduced debugging time.


### [MongoDB](https://www.mongodb.com/)
- MongoDB is a flexible, scalable, and easy-to-use NoSQL database.
- It stores data in a JSON-like document format called BSON.
- MongoDB offers horizontal scalability, query optimization, and indexing for efficient data retrieval.
- Flexible data modeling in MongoDB allows smooth evolution of database schema over time.


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
