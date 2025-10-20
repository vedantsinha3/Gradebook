from __future__ import annotations

import json
import os
from flask import Flask, jsonify, request, send_from_directory, abort
from werkzeug.middleware.proxy_fix import ProxyFix


APP_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(APP_DIR, 'static')
DATA_FILE = os.path.join(APP_DIR, 'grades.json')


def load_grades() -> dict[str, float]:
    if not os.path.exists(DATA_FILE):
        return {}
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            normalized = {}
            for name, grade in data.items():
                try:
                    normalized[str(name)] = float(grade)
                except (TypeError, ValueError):
                    continue
            return normalized
    except json.JSONDecodeError:
        return {}


def save_grades(grades: dict[str, float]) -> None:
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(grades, f, indent=2, sort_keys=True)


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)
    app.wsgi_app = ProxyFix(app.wsgi_app)  # type: ignore

    grades = load_grades()

    # ---------- API ROUTES ----------
    @app.get('/grades')
    def get_all_grades():
        return jsonify(grades)

    @app.get('/grades/<string:name>')
    def get_grade(name: str):
        if name in grades:
            return jsonify({name: grades[name]})
        abort(404, description=f"Student '{name}' not found")

    @app.post('/grades')
    def create_grade():
        try:
            payload = request.get_json(force=True)
        except Exception:
            abort(400, description='Invalid JSON')

        name = (payload or {}).get('name')
        grade = (payload or {}).get('grade')

        if not isinstance(name, str) or name.strip() == '':
            abort(400, description='Name is required')
        try:
            grade_value = float(grade)
        except (TypeError, ValueError):
            abort(400, description='Grade must be a number')

        if name in grades:
            abort(409, description='Student already exists')

        grades[name] = grade_value
        save_grades(grades)
        return jsonify({name: grades[name]}), 201

    @app.put('/grades/<string:name>')
    def update_grade(name: str):
        if name not in grades:
            abort(404, description=f"Student '{name}' not found")
        try:
            payload = request.get_json(force=True)
        except Exception:
            abort(400, description='Invalid JSON')

        grade = (payload or {}).get('grade')
        try:
            grade_value = float(grade)
        except (TypeError, ValueError):
            abort(400, description='Grade must be a number')

        grades[name] = grade_value
        save_grades(grades)
        return jsonify({name: grades[name]})

    @app.delete('/grades/<string:name>')
    def delete_grade(name: str):
        if name not in grades:
            abort(404, description=f"Student '{name}' not found")
        removed = grades.pop(name)
        save_grades(grades)
        return jsonify({name: removed})

    # ---------- STATIC FILES ----------
    @app.get('/')
    def index():
        return send_from_directory(STATIC_DIR, 'index.html')

    @app.get('/<path:path>')
    def static_files(path: str):
        return send_from_directory(STATIC_DIR, path)

    @app.get('/health')
    def health():
        return jsonify({'status': 'ok'})

    @app.errorhandler(400)
    @app.errorhandler(404)
    @app.errorhandler(409)
    def handle_error(err):  # type: ignore
        if request.path.startswith('/grades') or request.path.startswith('/health'):
            code = getattr(err, 'code', 500)
            return jsonify({'error': getattr(err, 'description', str(err))}), code
        return index()

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=True)


