from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/cursos/<path:filename>')
def cursos(filename):
    return send_from_directory('cursos', filename)

@app.route('/api/cursos')
def lista_cursos():
    arquivos = [f for f in os.listdir('cursos') if f.endswith('.json')]
    return jsonify(arquivos)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
