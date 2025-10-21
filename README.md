# Gradebook – Flask + Vanilla JS Grades Manager

A clean, minimal grades manager with a Flask REST API and a lightweight HTML/CSS/JS frontend. View all students, fetch an individual grade, create/update/delete entries, and persist data to `grades.json`.

## Features
- CRUD grades via a simple REST API (GET, POST, PUT, DELETE)
- Accessible, responsive UI with keyboard-friendly focus states
- Persistent storage using a local JSON file (`grades.json`)
- Helpful status messages and input validation
- Health check endpoint for quick service verification

## Tech Stack
- **Backend**: Flask (Python)
- **Frontend**: HTML, modern CSS, vanilla JavaScript
- **Data**: JSON file for persistence

## Quickstart
1) Create and activate a virtual environment
   - macOS/Linux:
   ```bash
   python3 -m venv .venv && source .venv/bin/activate
   ```
   - Windows (PowerShell):
   ```powershell
   py -3 -m venv .venv; .venv\\Scripts\\Activate.ps1
   ```
2) Install dependencies
```bash
pip install -r requirements.txt
```
3) Start the server
```bash
python server.py
```
4) Open `http://localhost:5000`

Data persists to `grades.json` in the project root.

## API Reference
Base URL: `http://localhost:5000`

### GET /grades
Returns all students and grades
```bash
curl http://localhost:5000/grades
```

### GET /grades/:name
Returns a single student's grade
```bash
curl http://localhost:5000/grades/Alice
```

### POST /grades
Create a new student
```bash
curl -X POST http://localhost:5000/grades \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","grade":93.5}'
```

### PUT /grades/:name
Update an existing grade
```bash
curl -X PUT http://localhost:5000/grades/Alice \
  -H "Content-Type: application/json" \
  -d '{"grade":95.0}'
```

### DELETE /grades/:name
Remove a student
```bash
curl -X DELETE http://localhost:5000/grades/Alice
```

### Health
```bash
curl http://localhost:5000/health
```

## Project Structure
```
gradebook/
  server.py            # Flask app and REST API routes
  grades.json          # Data persistence (created/updated at runtime)
  static/
    index.html         # UI layout
    app.js             # API calls + UI interactions
    styles.css         # Modern dark theme, focus states, tables
  requirements.txt     # Python dependencies
  README.md            # This file
```

## Implementation Highlights
- **Type hints & validation**: Input is validated and converted to floats; helpful error messages for bad requests.
- **Consistent JSON errors**: API returns structured JSON errors for 4xx responses.
- **Static-first UI**: No frameworks needed—just accessible HTML, CSS, and a thin JS layer.
- **Polished UX**: Clear focus states, friendly status messages, sticky table headers, and subtle motion.

## Future Improvements
- Sorting and filtering in the table
- Search-as-you-type by student name
- Import/export CSV
- Authentication (e.g., teacher-only edits)
- Deploy to a free hosting provider with a small SQLite layer
