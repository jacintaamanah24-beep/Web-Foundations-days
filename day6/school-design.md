# School Database Design

## 1. Database Tables

### Students Table
The `students` table stores information about students. It contains each student's ID, name, and email address. The ID uniquely identifies each student, and the email address must be unique.

### Courses Table
The `courses` table stores information about courses offered by the school. It contains the course ID, course name, and instructor's name.

### Enrolments Table
The `enrolments` table records which students are enrolled in which courses. It contains an enrolment ID, the student's ID, the course ID, and the student's grade. The student ID and course ID connect enrolments to the students and courses tables.

## 2. Table Relationships

### One-to-Many Relationships
A student can have many enrolments, but each enrolment belongs to one student. This creates a one-to-many relationship between the `students` and `enrolments` tables.

Similarly, one course can have many enrolments, but each enrolment belongs to one course. This creates a one-to-many relationship between the `courses` and `enrolments` tables.

### Many-to-Many Relationship
Students and courses have a many-to-many relationship because one student can take several courses, and one course can have several students.

The `enrolments` table connects students to courses. Without this table, it would be difficult to record which students take which courses and store their individual grades.

## 3. Database Index

An index will be created on the `course_id` column in the `enrolments` table. This index can help the database find enrolments for a particular course more efficiently, especially as the number of enrolments increases.

The SQL statement is:

`CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);`

## 4. Choosing SQL or NoSQL

I would choose a SQL database for this school system because the data has clear relationships between students, courses, and enrolments. SQL allows us to connect tables using primary keys and foreign keys, maintain data integrity, and retrieve information using queries. It also helps prevent duplicate enrolments and ensures that each enrolment is linked to an existing student and course. A NoSQL database can be useful for flexible or unstructured data, but SQL is a suitable choice for this structured school database.