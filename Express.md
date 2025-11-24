# Building Endpoints with Express

Express is a web framework for Node.js that helps us create backend services and APIs in a quick and simple way.

## Basic setup

```js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
```

## Adding middlewares

Middlewares are functions that run **before** your endpoint handler. They can read or change the request, or add extra behavior.

```js
// Allow requests from other origins, if they are allowed by the CORS policy
app.use(cors());

// Try to parse the request body as JSON and put it on req.body
app.use(express.json());
```

- `cors()` – CORS (Cross-Origin Resource Sharing) is a security mechanism.  
  It controls which origins (for example `https://my-frontend.com`) are allowed to send requests to your API (for example `https://api.example.com`).

- `express.json()` – tells Express to automatically read the HTTP request body  
  (if it is JSON) and put the result on `req.body`.

> Important: usually we add global middlewares **before** we define our endpoints.

## Defining endpoints (routes)

The general syntax for an endpoint in Express is:

```js
app.METHOD(PATH, (req, res) => {
  // handler code here
});
```

- `METHOD` – HTTP method: `get`, `post`, `put`, `delete`, etc.
- `PATH` – the route path, usually starting with `/`, for example: `/example`, `/users/:id`
- `req` – the request object (incoming HTTP request)
- `res` – the response object (what we send back)

### Example endpoints

```js
// GET /example
app.get('/example', (req, res) => {
  res.send('Hello from GET /example');
});

// POST /example
app.post('/example', (req, res) => {
  const body = req.body; // data sent by the client in the request body
  res.status(201).json({ message: 'Created', data: body });
});

// PUT /example/:id
app.put('/example/:id', (req, res) => {
  const id = req.params.id; // URL parameter
  const body = req.body;    // updated data
  res.json({ message: `Updated item ${id}`, data: body });
});

// DELETE /example/:id
app.delete('/example/:id', (req, res) => {
  const id = req.params.id;
  res.status(204).send(); // 204 No Content
});
```

In these examples we use:

- `req.params` – to read route parameters like `:id`
- `req.body` – to read JSON body (thanks to `express.json()` middleware)
- `res.send()` / `res.json()` – to send data back
- `res.status(code)` – to set the HTTP status code

## Starting the server

Finally, we tell Express on which port it should listen for incoming requests:

```js
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

Now your API will be available at URLs like:

- `http://localhost:3000/example`
- `http://localhost:3000/example/123`


## Extra - Router
