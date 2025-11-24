# Recap

## APIs

API is short for **Application Programming Interface**.

An API is a way for one software system (or component) to communicate with another. Instead of exposing all the internal details of how a system works, the API exposes a well-defined **interface** that other systems can use.

You can think of an API as a **contract** that says:

- What you are allowed to ask the system to do (the available operations).
- How you must ask (the exact format of the request).
- What you can expect back (the format of the response).
- What errors can happen and how they are reported.

For web APIs, this contract usually includes:

- The **protocol** used for communication (most often HTTP).
- The **endpoints** (URLs) that clients can call.
- The **HTTP methods** to use (GET, POST, PUT, DELETE, etc.).
- The **request structure** (headers, body, query parameters, path parameters).
- The **response structure** (status codes, headers, body).
- The **authentication/authorization** rules (e.g. API keys, tokens, sessions).

## What is an endpoint?

An endpoint is a specific URL and HTTP method that a client uses to talk to an API and access a resource.

For example: `GET /users`, `POST /users`, `GET /users/123`.

An endpoint is made from:

- the protocol (http or https)
- the server address (for example: `api.example.com`)
- the path (for example: `/users` or `/users/123`)
- the HTTP method (GET, POST, PUT, DELETE, etc.)

How it works technically:

1. The client sends an HTTP request to a URL (for example: `GET https://api.example.com/users`).
2. The request goes to the server and port where the API is listening.
3. The server checks the HTTP method and path and finds the matching endpoint in the code.
4. The server runs the handler function for that endpoint and sends an HTTP response back to the client. 

