-- Seed script for SCU Schedule Planner

-- Insert emphasis areas
INSERT INTO emphasis_areas (name, description) VALUES
    ('Algorithms and Complexity', 'Focus on algorithmic theory, computational complexity, and mathematical foundations'),
    ('Data Science', 'Focus on data analysis, machine learning, and statistical methods'),
    ('Security', 'Focus on cybersecurity, cryptography, and secure systems'),
    ('Software', 'Focus on software engineering, development methodologies, and systems'),
    ('Open Emphasis', 'Custom emphasis with advisor approval');

-- Insert all courses from courses.ts
-- Mathematics courses
INSERT INTO courses (code, title, units, department, is_upper_division, description) VALUES
    ('MATH 11', 'Calculus and Analytic Geometry I', 4, 'MATH', false, 'Limits and differentiation. Methods and applications of differentiation.'),
    ('MATH 12', 'Calculus and Analytic Geometry II', 4, 'MATH', false, 'Further applications of differentiation. Integration and the fundamental theorem of calculus.'),
    ('MATH 13', 'Calculus and Analytic Geometry III', 4, 'MATH', false, 'Taylor series, vectors, quadric surfaces, and partial derivatives.'),
    ('MATH 14', 'Calculus and Analytic Geometry IV', 4, 'MATH', false, 'Vector functions, line integrals, multiple integrals, flux, divergence theorem, and Stokes'' theorem.'),
    ('MATH 51', 'Discrete Mathematics', 4, 'MATH', false, 'Predicate logic, methods of proof, sets, functions, sequences and summations, modular arithmetic, cardinality, induction.'),
    ('MATH 53', 'Linear Algebra', 4, 'MATH', false, 'Vector spaces, linear transformations, algebra of matrices, eigenvalues and eigenvectors, and inner products.'),
    ('MATH 122', 'Probability and Statistics I', 5, 'MATH', true, 'Sample spaces, conditional probability, random variables, discrete and continuous probability distributions.'),
    ('MATH 101', 'Advanced Calculus I', 5, 'MATH', true, 'Rigorous treatment of the foundations of calculus, including continuity, differentiation, and integration.'),
    ('MATH 123', 'Probability and Statistics II', 5, 'MATH', true, 'Estimation, hypothesis testing, regression, analysis of variance, and nonparametric tests.'),
    ('MATH 175', 'Theory of Numbers', 5, 'MATH', true, 'Divisibility, congruences, Diophantine equations, quadratic residues, and continued fractions.'),
    ('MATH 176', 'Combinatorics', 5, 'MATH', true, 'Permutations, combinations, generating functions, recurrence relations, inclusion-exclusion, and Polya counting.'),
    ('MATH 177', 'Graph Theory', 5, 'MATH', true, 'Basic concepts, trees, connectivity, Euler and Hamilton circuits, matchings, colorings, planarity, and directed graphs.'),
    ('MATH 178', 'Cryptography', 5, 'MATH', true, 'Classical and modern methods of encryption, public key cryptosystems, and digital signatures.');

-- CSEN courses
INSERT INTO courses (code, title, units, department, is_upper_division, description) VALUES
    ('CSEN 10', 'Introduction to Programming', 4, 'CSEN', false, 'Overview of computing. Introduction to program design and implementation in PHP and C. Program development in Linux environment.'),
    ('CSEN 11', 'Advanced Programming', 4, 'CSEN', false, 'The C Language: structure and style. Types, operators, control flow, functions, pointers, arrays, structures, and dynamic memory allocation.'),
    ('CSEN 12', 'Abstract Data Types and Data Structures', 4, 'CSEN', false, 'Data abstraction, basic data structures, stacks, queues, lists, binary trees, hashing, graphs. Implementation in C language.'),
    ('CSEN 19', 'Discrete Mathematics', 4, 'CSEN', false, 'Predicate logic, methods of proof, sets, functions, sequences and summations, modular arithmetic, cardinality, induction.'),
    ('CSEN 20', 'Introduction to Embedded Systems', 4, 'CSEN', false, 'Introduction to embedded systems and assembly language programming.'),
    ('CSEN 21', 'Introduction to Logic Design', 4, 'CSEN', false, 'Boolean functions and their minimization. Combinational circuits: arithmetic circuits, multiplexers, decoders. Sequential logic circuits: latches and flip-flops, registers, counters. Memory. Busing. Use of industry quality CAD tools for HDL in conjunction with FPGAs.'),
    ('CSEN 79', 'Object-Oriented Programming and Advanced Data Structures', 4, 'CSEN', false, 'Object-oriented programming concepts, advanced data structures implementation, software reliability and reusability.'),
    ('CSEN 120', 'Real-Time Systems', 4, 'CSEN', true, 'Real-time systems, finite state machines, robot programming, real-time programming languages and kernels.'),
    ('CSEN 122', 'Computer Architecture', 4, 'CSEN', true, 'Instruction set architecture, CPU design, memory hierarchies, pipelining, hardware description languages.'),
    ('CSEN 140', 'Machine Learning and Data Mining', 4, 'CSEN', true, 'Introduction to machine learning and data mining, main principles, algorithms, and applications.'),
    ('CSEN 143', 'Internet of Things', 4, 'CSEN', true, 'IoT systems architecture, embedded processors, sensors, wireless protocols, IP networking, cloud computing.'),
    ('CSEN 145', 'Introduction to Parallel Computing', 4, 'CSEN', true, 'Parallel architectures, parallel programming, load balancing, parallel algorithms for data analytics.'),
    ('CSEN 146', 'Computer Networks', 4, 'CSEN', true, 'Computer network architecture, protocols, and applications.'),
    ('CSEN 150', 'Introduction to Information Security', 4, 'CSEN', true, 'Security principles, operating system security, malware, network security, cryptography basics.'),
    ('CSEN 152', 'Computer Forensics', 4, 'CSEN', true, 'Digital evidence collection, analysis, and presentation.'),
    ('CSEN 161', 'Web Development', 4, 'CSEN', true, 'Web technologies, frameworks, and full-stack development.'),
    ('CSEN 164', 'Advanced Web Development', 4, 'CSEN', true, 'Web frameworks, web services, and web security management.'),
    ('CSEN 166', 'Artificial Intelligence', 4, 'CSEN', true, 'AI principles, machine learning, and neural networks.'),
    ('CSEN 169', 'Web Search and Information Retrieval', 4, 'CSEN', true, 'Search engine technology, recommender systems, web data classification and clustering.'),
    ('CSEN 171', 'Principles of Design and Implementation of Programming Languages', 4, 'CSEN', true, 'Programming language concepts, constructs, implementation trade-offs.'),
    ('CSEN 174', 'Software Engineering', 4, 'CSEN', true, 'Software development lifecycle, project management, requirements engineering, software testing.'),
    ('CSEN 177', 'Operating Systems', 4, 'CSEN', true, 'Operating system concepts and implementation.'),
    ('CSEN 178', 'Mobile Application Development', 4, 'CSEN', true, 'Mobile app development for iOS and Android platforms.'),
    ('CSEN 179', 'Theory of Algorithms', 5, 'CSEN', true, 'Algorithm analysis, design strategies, P and NP, approximation algorithms.');

-- ELEN courses
INSERT INTO courses (code, title, units, department, is_upper_division, description) VALUES
    ('ELEN 21', 'Introduction to Logic Design', 4, 'ELEN', false, 'Boolean functions and their minimization. Combinational circuits: arithmetic circuits, multiplexers, decoders. Sequential logic circuits: latches and flip-flops, registers, counters. Memory. Busing. Use of industry quality CAD tools for HDL in conjunction with FPGAs.');

-- CSCI courses
INSERT INTO courses (code, title, units, department, is_upper_division, description) VALUES
    ('CSCI 10', 'Introduction to Computer Science', 5, 'CSCI', false, 'Introduction to computer science and programming in Python.'),
    ('CSCI 60', 'Object-Oriented Programming', 5, 'CSCI', false, 'Object-oriented programming techniques using C++.'),
    ('CSCI 61', 'Data Structures', 4, 'CSCI', false, 'Specification, implementations, and analysis of basic data structures.'),
    ('CSCI 62', 'Advanced Programming', 4, 'CSCI', false, 'Advanced object-oriented programming and applications.');

-- Add cross-listed courses
INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 21' AND c2.code = 'ELEN 21';

-- Add prerequisites for courses
-- MATH 12 requires MATH 11
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'MATH 12'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 11';

-- MATH 13 requires MATH 12
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'MATH 13'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 12';

-- MATH 14 requires MATH 13
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'MATH 14'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 13';

-- MATH 53 requires MATH 13
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 53'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 13';

-- MATH 122 requires MATH 14
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 122'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 14';

-- MATH 101 requires MATH 14
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 101'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 14';

-- MATH 123 requires MATH 122
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 123'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 122';

-- MATH 175, 176, 177 require MATH 51
WITH prereq_175 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 175'
    RETURNING id
),
prereq_176 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 176'
    RETURNING id
),
prereq_177 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 177'
    RETURNING id
),
math_51 AS (
    SELECT id FROM courses WHERE code = 'MATH 51'
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, math_51.id
FROM (
    SELECT id FROM prereq_175
    UNION ALL
    SELECT id FROM prereq_176
    UNION ALL
    SELECT id FROM prereq_177
) AS prereq, math_51;

-- MATH 178 requires MATH 175
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'MATH 178'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'MATH 175';

-- CSEN 11 requires CSEN 10 or CSCI 10
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSEN 11'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, c.id
FROM prereq, courses c
WHERE c.code IN ('CSEN 10', 'CSCI 10');

-- CSEN 12 requires CSEN 11
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSEN 12'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSEN 11';

-- CSEN 20 requires CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'CSEN 20'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 61';

-- CSEN 79 requires CSEN 12 or CSCI 61 AND CSEN 19 or MATH 51
WITH prereq1 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSEN 79'
    RETURNING id
),
prereq2 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSEN 79'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT 
    CASE 
        WHEN c.code IN ('CSEN 12', 'CSCI 61') THEN (SELECT id FROM prereq1)
        ELSE (SELECT id FROM prereq2)
    END,
    c.id
FROM courses c
WHERE c.code IN ('CSEN 12', 'CSCI 61', 'CSEN 19', 'MATH 51');

-- CSCI 60 requires CSCI 10
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 60'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 10';

-- CSCI 61 requires CSCI 60
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 61'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 60';

-- CSCI 62 requires CSCI 60 and CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 62'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, c.id
FROM prereq, courses c
WHERE c.code IN ('CSCI 60', 'CSCI 61');

-- CSEN 120 requires CSEN 12 or CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSEN 120'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, c.id
FROM prereq, courses c
WHERE c.code IN ('CSEN 12', 'CSCI 61');

-- CSEN 122 requires CSEN 20 and CSEN 21
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSEN 122'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, c.id
FROM prereq, courses c
WHERE c.code IN ('CSEN 20', 'CSEN 21');

-- CSEN 146 requires CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'CSEN 146'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 61';

-- CSEN 150 requires CSEN 146
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSEN 150'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSEN 146';

-- CSEN 161 requires CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'CSEN 161'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 61';

-- CSEN 164 requires CSEN 161
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSEN 164'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSEN 161';

-- CSEN 166 requires CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'CSEN 166'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 61';

-- CSEN 171 requires CSEN 79
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSEN 171'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSEN 79';

-- CSEN 177 requires CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'CSEN 177'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 61';

-- CSEN 178 requires CSCI 61
WITH prereq AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', null
    FROM courses
    WHERE code = 'CSEN 178'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq.id, courses.id
FROM prereq, courses
WHERE courses.code = 'CSCI 61';

-- Insert quarters when courses are offered
INSERT INTO course_quarters (course_id, quarter)
SELECT c.id, q.quarter
FROM courses c, unnest(ARRAY['Fall', 'Winter', 'Spring']::quarter_type[]) AS q(quarter)
WHERE c.code = 'MATH 11';

INSERT INTO course_quarters (course_id, quarter)
SELECT c.id, q.quarter
FROM courses c, unnest(ARRAY['Fall', 'Winter', 'Spring']::quarter_type[]) AS q(quarter)
WHERE c.code = 'MATH 12';

INSERT INTO course_quarters (course_id, quarter)
SELECT c.id, q.quarter
FROM courses c, unnest(ARRAY['Fall', 'Winter', 'Spring']::quarter_type[]) AS q(quarter)
WHERE c.code = 'CSCI 10';

INSERT INTO course_quarters (course_id, quarter)
SELECT c.id, q.quarter
FROM courses c, unnest(ARRAY['Fall', 'Winter']::quarter_type[]) AS q(quarter)
WHERE c.code = 'CSCI 60';

INSERT INTO course_quarters (course_id, quarter)
SELECT c.id, q.quarter
FROM courses c, unnest(ARRAY['Fall', 'Winter']::quarter_type[]) AS q(quarter)
WHERE c.code = 'CSCI 61';

INSERT INTO course_quarters (course_id, quarter)
SELECT c.id, 'Spring'
FROM courses c
WHERE c.code = 'CSCI 62';

-- Insert requirements
-- Mathematics Core
WITH math_core AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Mathematics Core', 'core', 'All mathematics courses must be taken for a letter grade')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT math_core.id, c.id
FROM math_core, courses c
WHERE c.code IN ('MATH 11', 'MATH 12', 'MATH 13', 'MATH 14', 'MATH 51', 'MATH 53', 'MATH 122');

-- Computer Science Lower Division Core
WITH cs_core AS (
    INSERT INTO requirements (name, type)
    VALUES ('Computer Science Lower Division Core', 'major')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT cs_core.id, c.id
FROM cs_core, courses c
WHERE c.code IN ('CSCI 10', 'CSCI 60', 'CSCI 61', 'CSCI 62', 'CSEN 20', 'ELEN 21');

-- Computer Science Upper Division Core
WITH cs_upper_core AS (
    INSERT INTO requirements (name, type)
    VALUES ('Computer Science Upper Division Core', 'major')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT cs_upper_core.id, c.id
FROM cs_upper_core, courses c
WHERE c.code IN ('CSCI 161', 'CSCI 163', 'CSEN 177');

-- Add corequisites
INSERT INTO corequisites (course_id, corequisite_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE (c1.code = 'CSEN 10' AND c2.code = 'CSEN 10L') OR
      (c1.code = 'CSEN 11' AND c2.code = 'CSEN 11L') OR
      (c1.code = 'CSEN 12' AND c2.code = 'CSEN 12L') OR
      (c1.code = 'CSEN 21' AND c2.code = 'CSEN 21L') OR
      (c1.code = 'ELEN 21' AND c2.code = 'ELEN 21L') OR
      (c1.code = 'CSEN 79' AND c2.code = 'CSEN 79L') OR
      (c1.code = 'CSEN 120' AND c2.code = 'CSEN 120L') OR
      (c1.code = 'CSEN 122' AND c2.code = 'CSEN 122L') OR
      (c1.code = 'CSEN 140' AND c2.code = 'CSEN 140L') OR
      (c1.code = 'CSEN 143' AND c2.code = 'CSEN 143L') OR
      (c1.code = 'CSEN 145' AND c2.code = 'CSEN 145L') OR
      (c1.code = 'CSEN 146' AND c2.code = 'CSEN 146L') OR
      (c1.code = 'CSEN 150' AND c2.code = 'CSEN 150L') OR
      (c1.code = 'CSEN 152' AND c2.code = 'CSEN 152L') OR
      (c1.code = 'CSEN 161' AND c2.code = 'CSEN 161L') OR
      (c1.code = 'CSEN 164' AND c2.code = 'CSEN 164L') OR
      (c1.code = 'CSEN 169' AND c2.code = 'CSEN 169L') OR
      (c1.code = 'CSEN 174' AND c2.code = 'CSEN 174L'); 