App Name: PANDA Pod

Core Features:

- REST API to register new services (POST /register).
- Search service registry (GET /search?q=...).
- Update a service (PUT /register/:id) with token validation.
- Delete a service (DELETE /register/:id) with token validation.
- SQLite database for persistent storage.
- All service entries contain:
  - name
  - description
  - local_url (optional)
  - public_url (required)
  - domain (custom name like mysite.panda)
  - type (e.g., website, api, game)
  - token (for update/delete)
  - created_at timestamp

Style Guidelines:

- This is a backend service. It should:
  - Log clearly in console when API is running.
  - Return clear JSON responses with HTTP codes.
  - Use CORS headers for browser clients.
  - Include error handling with JSON messages.

Technical Notes:

- Use Express.js and SQLite3 (no ORM required).
- Body data in JSON.
- Secure endpoints for updates and deletes with token comparison.
- The service must run on `http://localhost:3000` by default.
