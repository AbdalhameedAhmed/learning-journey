course_content = [
    {"id": 1, "type": "lesson", "name": "الأهداف"},
    {"id": 2, "type": "lesson", "name": "الدرس الأول"},
    {"id": 19, "type": "exam", "name": "اختبر نفسك"},
    {"id": 3, "type": "lesson", "name": "الدرس الثانى"},
    {"id": 5, "type": "lesson", "name": "نشاط"},
    {"id": 4, "type": "lesson", "name": "الدرس الثالث"},
    {"id": 17, "type": "exam", "name": "اختبار الوحدة الأولى", "next_exam_index": 13},
    {"id": 11, "type": "lesson", "name": "الأهداف"},
    {"id": 12, "type": "lesson", "name": "الدرس الأول"},
    {"id": 15, "type": "lesson", "name": "نشاط"},
    {"id": 13, "type": "lesson", "name": "الدرس الثانى"},
    {"id": 20, "type": "exam", "name": "اختبر نفسك"},
    {"id": 14, "type": "lesson", "name": "الدرس الثالث"},
    {"id": 22, "type": "exam", "name": "اختبار الوحدة الثانية", "next_exam_index": 19},
    {"id": 17, "type": "lesson", "name": "الأهداف"},
    {"id": 18, "type": "lesson", "name": "الدرس الأول"},
    {"id": 19, "type": "lesson", "name": "نشاط"},
    {"id": 20, "type": "lesson", "name": "الدرس الثانى"},
    {"id": 23, "type": "exam", "name": "اختبر نفسك"},
    {"id": 24, "type": "exam", "name": "اختبار الوحدة الثالثة", "next_exam_index": 25},
    {"id": 21, "type": "lesson", "name": "الأهداف"},
    {"id": 22, "type": "lesson", "name": "الدرس الأول"},
    {"id": 23, "type": "lesson", "name": "نشاط"},
    {"id": 24, "type": "lesson", "name": "الدرس الثانى"},
    {"id": 25, "type": "lesson", "name": "نشاط"},
    {"id": 25, "type": "exam", "name": "اختبار الوحدة الرابعة"},
]


def get_next_lesson_index(id, type):
    for i in range(len(course_content)):
        if course_content[i]["id"] == id and course_content[i]["type"] == type:
            if i + 1 < len(course_content):
                return i + 1
            else:
                return None


def get_lesson_index(id, type):
    for i in range(len(course_content)):
        if course_content[i]["id"] == id and course_content[i]["type"] == type:
            return i
    return None


def get_exam_by_id(id):
    for item in course_content:
        if item["id"] == id and item["type"] == "exam":
            return item
    return None
