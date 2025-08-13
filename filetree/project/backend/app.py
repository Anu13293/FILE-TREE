from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from survey_analysis import analyse_questions
from image_generator import generate_image_for_option

app = Flask(__name__)
CORS(app)

DB_PATH = "../database/survey.db"

# ✅ Initialize DB
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS survey_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            answer TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ✅ Step 1: Receive survey form
@app.route('/submit_survey', methods=['POST'])
def submit_survey():
    data = request.json
    questions = data.get("questions", [])
    analysed_data = analyse_questions(questions)

    # Generate images for each option
    for q in analysed_data:
        for opt in q["options"]:
            opt["image_url"] = generate_image_for_option(opt["text"])

    return jsonify({"survey": analysed_data})

# ✅ Step 2: Store user answers
@app.route('/store_answers', methods=['POST'])
def store_answers():
    answers = request.json.get("answers", [])
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    for ans in answers:
        c.execute("INSERT INTO survey_answers (question, answer) VALUES (?, ?)", (ans["question"], ans["answer"]))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

# ✅ Step 3: Review stored answers
@app.route('/get_answers', methods=['GET'])
def get_answers():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT question, answer FROM survey_answers")
    rows = c.fetchall()
    conn.close()
    return jsonify({"answers": rows})

if __name__ == '__main__':
    app.run(debug=True)
