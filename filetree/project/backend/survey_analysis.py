def analyse_questions(questions):
    analysed = []
    for q in questions:
        analysed.append({
            "question": q["question"],
            "options": [{"text": opt} for opt in q["options"]]
        })
    return analysed
