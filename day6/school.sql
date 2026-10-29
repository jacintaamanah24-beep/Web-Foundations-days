-- Day 6: School Database
-- Create the students table

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
-- Create the courses table

CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    instructor TEXT NOT NULL
);
-- Create the enrolments table

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);
-- Insert sample students

INSERT INTO students (id, name, email) VALUES
(1, 'Jacinta Amana', 'jacinta@example.com'),
(2, 'Mary Wanjiku', 'mary@example.com'),
(3, 'Brian Otieno', 'brian@example.com');
-- Insert sample courses

INSERT INTO courses (id, course_name, instructor) VALUES
(1, 'Web Development', 'Mr. John'),
(2, 'Database Design', 'Ms. Mary'),
(3, 'Networking', 'Mr. Peter');
-- Insert sample enrolments

INSERT INTO enrolments (id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'A'),
(4, 2, 3, NULL),
(5, 3, 2, 'B');
-- Query 1: Find all courses for one student

SELECT students.name, courses.course_name
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.id
WHERE students.name = 'Jacinta Amana';
-- Query 2: Find all students enrolled in Web Development

SELECT students.name, courses.course_name
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.id
WHERE courses.course_name = 'Web Development';
-- Query 3: Count students per course

SELECT courses.course_name, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON courses.id = enrolments.course_id
GROUP BY courses.id, courses.course_name;
-- Query 4: Find students with no enrolments

SELECT students.name
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.student_id IS NULL;
-- Query 5: Update Jacinta's grade in Database Design

UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1 AND course_id = 2;

-- Create an index to help find enrolments by course

CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);