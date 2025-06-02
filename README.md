App Name: PANDA Search

Core Features:

- Input field for keyword search.
- Fetch search results via REST API: GET /search?q=...
- Display each service result with:
  - name
  - description
  - domain (displayed, not functional DNS)
  - type
  - public URL (clickable)

Style Guidelines:

- Primary color: HSL 280, 65%, 55% (#a259e4) – vibrant purple
- Background: HSL 0, 0%, 96% (#f5f5f5)
- Accent: HSL 200, 100%, 50% (#009fff)
- Font pairing:
  - Headings: 'Poppins' (sans-serif)
  - Body: 'Open Sans'
- Rounded buttons with soft shadows.
- Light card layout for search results.
- Smooth fade-in animation when results appear.
- Minimal UI to focus on simplicity and utility.

Technical Notes:

- Frontend only (no backend needed).
- Use fetch API to call http://localhost:3000/search?q=...
- Optional: show loading indicator while fetching.
- Make it responsive (mobile/tablet friendly).
