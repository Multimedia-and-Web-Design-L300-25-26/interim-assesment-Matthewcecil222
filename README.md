[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bMYWKvYv)
# Coinbase Clone Backend API

This repository contains the backend API for the Coinbase clone interim assessment. It uses Node.js, Express, MongoDB, Mongoose, and JWT authentication with HTTP-only cookie support.

The API now includes:

- protected profile access with JWT
- crypto listing and creation endpoints
- OpenAPI-style JSON docs at `/api/docs`
- startup environment validation for safer deployment

The repository now also contains the React frontend inside [frontend](/c:/Users/cecil/Desktop/lab/interim-assesment-Matthewcecil222/frontend).

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  seeds/
  utils/
  app.js
  server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your `.env` file from the example:

```bash
cp .env.example .env
```

3. Update the environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the app:

```bash
npm run dev
```

5. Seed sample cryptocurrencies if needed:

```bash
npm run seed
```

6. Run a simple smoke check after the server starts:

```bash
npm run smoke
```

7. Run the automated tests:

```bash
npm test
```

## Frontend Setup

The Coinbase clone frontend lives in the `frontend` folder.

1. Create `frontend/.env` from [frontend/.env.example](/c:/Users/cecil/Desktop/lab/interim-assesment-Matthewcecil222/frontend/.env.example)

```env
VITE_API_URL=http://localhost:5000
```

2. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## API Base URL

```text
http://localhost:5000/api
```

The server also exposes assignment-friendly direct routes like `/register`, `/login`, `/profile`, and `/crypto` if you prefer not to prepend `/api` in the frontend.

## Endpoints

### Health

- `GET /health`
- `GET /api/health`
- `GET /`
- `GET /api/docs`

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /register`
- `POST /login`
- `POST /logout`

Register body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

Login body:

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Protected User Route

- `GET /users/profile`
- `GET /profile`

Send the JWT using:

- the HTTP-only `token` cookie
- or `Authorization: Bearer <token>`

### Cryptocurrency Routes

- `GET /crypto`
- `GET /crypto/gainers`
- `GET /crypto/new`
- `POST /crypto`

Optional query parameter for list routes:

- `limit`

Create crypto body:

```json
{
  "name": "Bitcoin",
  "symbol": "BTC",
  "price": 64250.35,
  "image": "https://example.com/bitcoin.png",
  "change24h": 3.4
}
```

## Frontend Integration

Your Coinbase clone frontend now calls this backend with `credentials: "include"` for authenticated requests.

Login example:

```js
await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
  body: JSON.stringify({
    email,
    password
  })
});
```

Profile example:

```js
await fetch("http://localhost:5000/api/users/profile", {
  method: "GET",
  credentials: "include"
});
```

Crypto example:

```js
await fetch("http://localhost:5000/api/crypto");
```

You can also use the sample requests in [requests.http](/c:/Users/cecil/Desktop/lab/interim-assesment-Matthewcecil222/requests.http) with the REST Client extension in VS Code or any similar API tool.

For a quick machine-readable route summary, open `http://localhost:5000/api/docs` after starting the server.

Frontend routes now include:

- `/signin`
- `/signup`
- `/profile` protected dashboard
- `/explore`
- `/asset/:id`

## Deployment Notes

Recommended backend deployment: Render.

This repo includes a [render.yaml](/c:/Users/cecil/Desktop/lab/interim-assesment-Matthewcecil222/render.yaml) file to make deployment setup easier.

Set the following environment variables on the server:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `NODE_ENV=production`

After deploying the backend, update your frontend API base URL to the deployed backend URL and redeploy the frontend.

## Testing

This project includes built-in Node.js tests in [tests/app.test.js](/c:/Users/cecil/Desktop/lab/interim-assesment-Matthewcecil222/tests/app.test.js) and [tests/validateEnv.test.js](/c:/Users/cecil/Desktop/lab/interim-assesment-Matthewcecil222/tests/validateEnv.test.js).

They currently verify:

- root route response
- health routes
- docs route
- JSON 404 handling
- protected profile rejection without a token
- required environment variable validation
