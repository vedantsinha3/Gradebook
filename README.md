# Lab 6 - Flask Grades App

This lab serves the Lab 5 frontend using Flask and replaces the public API with your own REST API.

## Features
- GET all students and grades
- GET one student's grade by name
- POST create a new student and grade
- PUT update an existing grade
- DELETE remove a student

## Run locally
1. Create and activate a virtual environment
   - macOS/Linux:
     ```bash
     python3 -m venv .venv && source .venv/bin/activate
     ```
   - Windows (PowerShell):
     ```powershell
     py -3 -m venv .venv; .venv\\Scripts\\Activate.ps1
     ```
2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server
   ```bash
   python server.py
   ```
4. Open http://localhost:5000 in your browser.

Data persists to `grades.json` in this folder.

