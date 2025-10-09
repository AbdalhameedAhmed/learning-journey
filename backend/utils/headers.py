def generate_question_headers(questions):
    headers = []
    for question_index, question in enumerate(questions):
        headers.append(f"السؤال {question_index + 1}")

    return headers
