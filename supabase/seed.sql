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
    ('CSCI 62', 'Advanced Programming', 4, 'CSCI', false, 'Advanced object-oriented programming and applications.'),
    ('CSCI 127', 'Introduction to Data Science', 5, 'CSCI', true, 'Foundations of data science and analytics.'),
    ('CSCI 146', 'Advanced Algorithms I', 5, 'CSCI', true, 'Design and analysis of advanced algorithms.'),
    ('CSCI 147', 'Advanced Algorithms II', 5, 'CSCI', true, 'Continuation of advanced algorithmic techniques.'),
    ('CSCI 161', 'Theory of Automata and Languages', 5, 'CSCI', true, 'Automata theory, formal languages, and computability.'),
    ('CSCI 162', 'Algorithms and Complexity', 5, 'CSCI', true, 'In-depth study of algorithms and computational complexity.'),
    ('CSCI 163', 'Theory of Algorithms', 5, 'CSCI', true, 'Algorithm design techniques and complexity analysis.'),
    ('CSCI 164', 'Programming Languages', 5, 'CSCI', true, 'Principles and paradigms of modern programming languages.'),
    ('CSCI 165', 'Parallel and Distributed Algorithms', 5, 'CSCI', true, 'Design of parallel and distributed algorithms.'),
    ('CSCI 166', 'Artificial Intelligence', 5, 'CSCI', true, 'Fundamentals of artificial intelligence and machine learning.'),
    ('CSCI 168', 'Software Project Management', 5, 'CSCI', true, 'Principles of managing large software projects.'),
    ('CSCI 169', 'Web Search and Information Retrieval', 5, 'CSCI', true, 'Search engine technology and information retrieval.'),
    ('CSCI 180', 'Introduction to Computer Security', 5, 'CSCI', true, 'Principles of computer and network security.'),
    ('CSCI 181', 'Cryptography and Network Security', 5, 'CSCI', true, 'Cryptographic techniques and secure communication.'),
    ('CSCI 183', 'Data Mining', 5, 'CSCI', true, 'Techniques and applications of data mining.'),
    ('CSCI 184', 'Machine Learning', 5, 'CSCI', true, 'Supervised and unsupervised machine learning algorithms.'),
    ('CSCI 185', 'Big Data Analytics', 5, 'CSCI', true, 'Systems and algorithms for big data.'),
    ('CSCI 187', 'Software Engineering', 5, 'CSCI', true, 'Advanced topics in software engineering.');

-- Add cross-listed courses
INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 21' AND c2.code = 'ELEN 21';

INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 19' AND c2.code = 'MATH 51';

INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 10' AND c2.code = 'CSCI 10';

INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 12' AND c2.code = 'CSCI 61';

INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 79' AND c2.code = 'CSCI 62';

INSERT INTO cross_listed_courses (course_id, cross_listed_course_id)
SELECT c1.id, c2.id
FROM courses c1, courses c2
WHERE c1.code = 'CSEN 179' AND c2.code = 'CSCI 163';

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

-- University Core courses
INSERT INTO courses (code, title, units, department, is_upper_division, description) VALUES
    ('CTW 1', 'Critical Thinking & Writing 1', 4, 'CTW', false, 'University core course.'),
    ('CTW 2', 'Critical Thinking & Writing 2', 4, 'CTW', false, 'University core course.'),
    ('C&I 1', 'Cultures & Ideas 1', 4, 'C&I', false, 'University core course.'),
    ('C&I 2', 'Cultures & Ideas 2', 4, 'C&I', false, 'University core course.'),
    ('C&I 3', 'Cultures & Ideas 3', 4, 'C&I', false, 'University core course.'),
    ('RTC 1', 'Religion, Theology & Culture 1', 4, 'RTC', false, 'University core course.'),
    ('RTC 2', 'Religion, Theology & Culture 2', 4, 'RTC', false, 'University core course.'),
    ('RTC 3', 'Religion, Theology & Culture 3', 4, 'RTC', false, 'University core course.'),
    ('DIV 1', 'Diversity 1', 4, 'DIV', false, 'University core course.'),
    ('ETH 1', 'Ethics 1', 4, 'ETH', false, 'University core course.'),
    ('ELSJ 1', 'Experiential Learning for Social Justice', 4, 'ELSJ', false, 'University core course.'),
    ('SOC 1', 'Social Science 1', 4, 'SOC', false, 'University core course.'),
    ('CIV 1', 'Civic Engagement 1', 4, 'CIV', false, 'University core course.'),
    ('SPAN 21A', 'Second Language Spanish 21A', 4, 'SPAN', false, 'University core course.'),
    ('ARTS 1', 'Arts 1', 4, 'ARTS', false, 'University core course.'),
    ('NATSCI 1', 'Natural Science 1', 4, 'NATSCI', false, 'University core course.'),
    ('SCIT 1', 'Science, Technology, and Society 1', 4, 'SCIT', false, 'University core course.'),
    ('ADVWR 1', 'Advanced Writing 1', 4, 'ADVWR', false, 'University core course.');

-- University Core Requirements
-- Critical Thinking & Writing
WITH ctw_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Critical Thinking & Writing', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT ctw_req.id, c.id
FROM ctw_req, courses c
WHERE c.code IN ('CTW 1', 'CTW 2');

-- Cultures & Ideas
WITH ci_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Cultures & Ideas', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT ci_req.id, c.id
FROM ci_req, courses c
WHERE c.code IN ('C&I 1', 'C&I 2', 'C&I 3');

-- Religion, Theology & Culture
WITH rtc_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Religion, Theology & Culture', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT rtc_req.id, c.id
FROM rtc_req, courses c
WHERE c.code IN ('RTC 1', 'RTC 2', 'RTC 3');

-- Diversity
WITH div_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Diversity', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT div_req.id, c.id
FROM div_req, courses c
WHERE c.code = 'DIV 1';

-- Ethics
WITH eth_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Ethics', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT eth_req.id, c.id
FROM eth_req, courses c
WHERE c.code = 'ETH 1';

-- ELSJ
WITH elsj_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('ELSJ', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT elsj_req.id, c.id
FROM elsj_req, courses c
WHERE c.code = 'ELSJ 1';

-- Social Science
WITH soc_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Social Science', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT soc_req.id, c.id
FROM soc_req, courses c
WHERE c.code = 'SOC 1';

-- Civic Engagement
WITH civ_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Civic Engagement', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT civ_req.id, c.id
FROM civ_req, courses c
WHERE c.code = 'CIV 1';

-- Second Language
WITH lang_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Second Language', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT lang_req.id, c.id
FROM lang_req, courses c
WHERE c.code = 'SPAN 21A';

-- Arts
WITH arts_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Arts', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT arts_req.id, c.id
FROM arts_req, courses c
WHERE c.code = 'ARTS 1';

-- Natural Science
WITH natsci_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Natural Science', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT natsci_req.id, c.id
FROM natsci_req, courses c
WHERE c.code = 'NATSCI 1';

-- Science, Technology, and Society
WITH sts_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Science, Technology, and Society', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT sts_req.id, c.id
FROM sts_req, courses c
WHERE c.code = 'SCIT 1';

-- Advanced Writing
WITH advwr_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Advanced Writing', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT advwr_req.id, c.id
FROM advwr_req, courses c
WHERE c.code = 'ADVWR 1';

-- Math (University Core Math requirement)
WITH math_uc_req AS (
    INSERT INTO requirements (name, type)
    VALUES ('Math', 'university')
    RETURNING id
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT math_uc_req.id, c.id
FROM math_uc_req, courses c
WHERE c.code = 'MATH 11';

-- =====================================================================
-- Computer Science Emphasis Requirements
-- =====================================================================

-- ================= Algorithms and Complexity Emphasis ================
-- Required courses
WITH algo_req_required AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Algorithms and Complexity - Required Courses', 'emphasis', 'Required courses for Algorithms and Complexity emphasis')
    RETURNING id
), algo_emphasis AS (
    SELECT id FROM emphasis_areas WHERE name = 'Algorithms and Complexity'
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT algo_req_required.id, c.id
FROM algo_req_required, courses c
WHERE c.code IN ('CSCI 162', 'CSCI 164');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Algorithms and Complexity'
  AND r.name = 'Algorithms and Complexity - Required Courses';

-- Electives Group 1 (choose 2)
WITH algo_req_g1 AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Algorithms and Complexity - Electives Group 1', 'emphasis', 'Choose two courses from this list')
    RETURNING id
), algo_cf1 AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 2 FROM algo_req_g1
    RETURNING id
), algo_emphasis2 AS (
    SELECT id FROM emphasis_areas WHERE name = 'Algorithms and Complexity'
)
INSERT INTO requirement_choose_options (requirement_choose_from_id, course_id)
SELECT algo_cf1.id, c.id
FROM algo_cf1, courses c
WHERE c.code IN ('CSCI 146', 'CSCI 147', 'CSCI 165', 'CSCI 181', 'MATH 101', 'MATH 175', 'MATH 176', 'MATH 177', 'MATH 178');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Algorithms and Complexity'
  AND r.name = 'Algorithms and Complexity - Electives Group 1';

-- Additional Emphasis Course (choose 1)
WITH algo_req_add AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Algorithms and Complexity - Additional Course', 'emphasis', 'Choose one more course from approved list')
    RETURNING id
), algo_cf2 AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 1 FROM algo_req_add
    RETURNING id
), algo_emphasis3 AS (
    SELECT id FROM emphasis_areas WHERE name = 'Algorithms and Complexity'
)
INSERT INTO requirement_choose_options (requirement_choose_from_id, course_id)
SELECT algo_cf2.id, c.id
FROM algo_cf2, courses c
WHERE c.code IN ('CSCI 146', 'CSCI 147', 'CSCI 165', 'CSCI 181', 'MATH 101', 'MATH 175', 'MATH 176', 'MATH 177', 'MATH 178');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Algorithms and Complexity'
  AND r.name = 'Algorithms and Complexity - Additional Course';

-- ========================= Data Science Emphasis =====================
-- Required courses
WITH ds_req_required AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Data Science - Required Courses', 'emphasis', 'Required courses for Data Science emphasis')
    RETURNING id
), ds_emphasis AS (
    SELECT id FROM emphasis_areas WHERE name = 'Data Science'
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT ds_req_required.id, c.id
FROM ds_req_required, courses c
WHERE c.code IN ('CSCI 183', 'CSCI 184', 'CSCI 185');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Data Science'
  AND r.name = 'Data Science - Required Courses';

-- Electives (choose 2)
WITH ds_req_el AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Data Science - Electives', 'emphasis', 'Choose two electives for Data Science emphasis')
    RETURNING id
), ds_cf AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 2 FROM ds_req_el
    RETURNING id
), ds_emphasis2 AS (
    SELECT id FROM emphasis_areas WHERE name = 'Data Science'
)
INSERT INTO requirement_choose_options (requirement_choose_from_id, course_id)
SELECT ds_cf.id, c.id
FROM ds_cf, courses c
WHERE c.code IN ('CSCI 127', 'CSCI 146', 'CSCI 147', 'CSCI 164', 'CSCI 166', 'MATH 123', 'CSEN 166');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Data Science'
  AND r.name = 'Data Science - Electives';

-- =========================== Security Emphasis =======================
-- Required courses
WITH sec_req_required AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Security - Required Courses', 'emphasis', 'Required courses for Security emphasis')
    RETURNING id
), sec_emphasis AS (
    SELECT id FROM emphasis_areas WHERE name = 'Security'
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT sec_req_required.id, c.id
FROM sec_req_required, courses c
WHERE c.code IN ('MATH 178', 'CSCI 180', 'CSCI 181');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Security'
  AND r.name = 'Security - Required Courses';

-- Electives (choose 2)
WITH sec_req_el AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Security - Electives', 'emphasis', 'Choose two electives for Security emphasis')
    RETURNING id
), sec_cf AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 2 FROM sec_req_el
    RETURNING id
), sec_emphasis2 AS (
    SELECT id FROM emphasis_areas WHERE name = 'Security'
)
INSERT INTO requirement_choose_options (requirement_choose_from_id, course_id)
SELECT sec_cf.id, c.id
FROM sec_cf, courses c
WHERE c.code IN ('MATH 175', 'CSEN 152', 'CSEN 161', 'CSEN 146');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Security'
  AND r.name = 'Security - Electives';

-- ============================ Software Emphasis ======================
-- Required courses
WITH sw_req_required AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Software - Required Courses', 'emphasis', 'Required courses for Software emphasis')
    RETURNING id
), sw_emphasis AS (
    SELECT id FROM emphasis_areas WHERE name = 'Software'
)
INSERT INTO requirement_courses (requirement_id, course_id)
SELECT sw_req_required.id, c.id
FROM sw_req_required, courses c
WHERE c.code IN ('CSCI 169', 'CSCI 187', 'CSEN 146');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Software'
  AND r.name = 'Software - Required Courses';

-- Elective Group 1 (choose 1)
WITH sw_req_g1 AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Software - Elective Group 1', 'emphasis', 'Choose one elective from list')
    RETURNING id
), sw_cf1 AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 1 FROM sw_req_g1
    RETURNING id
), sw_emphasis2 AS (
    SELECT id FROM emphasis_areas WHERE name = 'Software'
)
INSERT INTO requirement_choose_options (requirement_choose_from_id, course_id)
SELECT sw_cf1.id, c.id
FROM sw_cf1, courses c
WHERE c.code IN ('CSCI 183', 'CSCI 180', 'CSCI 168');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Software'
  AND r.name = 'Software - Elective Group 1';

-- Elective Group 2 (choose 1)
WITH sw_req_g2 AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Software - Elective Group 2', 'emphasis', 'Choose one additional elective')
    RETURNING id
), sw_cf2 AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 1 FROM sw_req_g2
    RETURNING id
), sw_emphasis3 AS (
    SELECT id FROM emphasis_areas WHERE name = 'Software'
)
INSERT INTO requirement_choose_options (requirement_choose_from_id, course_id)
SELECT sw_cf2.id, c.id
FROM sw_cf2, courses c
WHERE c.code IN ('CSCI 183', 'CSCI 180', 'CSCI 168', 'CSEN 161', 'CSEN 178');

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Software'
  AND r.name = 'Software - Elective Group 2';

-- ============================ Open Emphasis ==========================
-- Open Emphasis Requirements (choose 5, advisor approved)
WITH open_req AS (
    INSERT INTO requirements (name, type, notes)
    VALUES ('Open Emphasis - Approved Courses', 'emphasis', 'Open emphasis approved courses list; three of five must be CSCI or MATH')
    RETURNING id
), open_cf AS (
    INSERT INTO requirement_choose_from (requirement_id, count)
    SELECT id, 5 FROM open_req
    RETURNING id
), open_emphasis AS (
    SELECT id FROM emphasis_areas WHERE name = 'Open Emphasis'
)
-- No predefined options for open emphasis; advisor approval needed

INSERT INTO emphasis_requirements (emphasis_id, requirement_id)
SELECT e.id, r.id
FROM emphasis_areas e, requirements r
WHERE e.name = 'Open Emphasis'
  AND r.name = 'Open Emphasis - Approved Courses';

-- CSCI 127 requires CSCI 10
WITH prereq_csci_127 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 127'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_127.id, courses.id
FROM prereq_csci_127, courses
WHERE courses.code = 'CSCI 10';

-- CSCI 146 requires CSCI 10, MATH 14, and MATH 53
WITH prereq_csci_146 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 146'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_146.id, c.id
FROM prereq_csci_146, courses c
WHERE c.code IN ('CSCI 10', 'MATH 14', 'MATH 53');

-- CSCI 147 requires MATH 122 and CSCI 146
WITH prereq_csci_147 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 147'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_147.id, c.id
FROM prereq_csci_147, courses c
WHERE c.code IN ('MATH 122', 'CSCI 146');

-- CSCI 162 requires MATH 51
WITH prereq_csci_162 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 162'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_162.id, courses.id
FROM prereq_csci_162, courses
WHERE courses.code = 'MATH 51';

-- CSCI 163 requires MATH 51 and (CSCI 61 or CSEN 79)
-- Required: MATH 51
WITH prereq_csci_163_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 163'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_163_req.id, courses.id
FROM prereq_csci_163_req, courses
WHERE courses.code = 'MATH 51';
-- OR group: CSCI 61 or CSEN 79
WITH prereq_csci_163_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 163'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_163_or.id, c.id
FROM prereq_csci_163_or, courses c
WHERE c.code IN ('CSCI 61', 'CSEN 79');

-- CSCI 164 requires (CSCI 163 or CSEN 179)
WITH prereq_csci_164_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 164'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_164_or.id, c.id
FROM prereq_csci_164_or, courses c
WHERE c.code IN ('CSCI 163', 'CSEN 179');

-- CSCI 165 requires MATH 51 and CSCI 10
WITH prereq_csci_165 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 165'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_165.id, c.id
FROM prereq_csci_165, courses c
WHERE c.code IN ('MATH 51', 'CSCI 10');

-- CSCI 166 requires CSCI 10 and MATH 53
WITH prereq_csci_166 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 166'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_166.id, c.id
FROM prereq_csci_166, courses c
WHERE c.code IN ('CSCI 10', 'MATH 53');

-- CSCI 168 requires MATH 13 and (CSCI 62 or CSEN 79)
-- Required: MATH 13
WITH prereq_csci_168_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 168'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_168_req.id, courses.id
FROM prereq_csci_168_req, courses
WHERE courses.code = 'MATH 13';
-- OR group
WITH prereq_csci_168_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 168'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_168_or.id, c.id
FROM prereq_csci_168_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79');

-- CSCI 169 requires MATH 51 and (CSCI 62 or CSEN 79)
-- Required: MATH 51
WITH prereq_csci_169_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 169'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_169_req.id, courses.id
FROM prereq_csci_169_req, courses
WHERE courses.code = 'MATH 51';
-- OR group
WITH prereq_csci_169_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 169'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_169_or.id, c.id
FROM prereq_csci_169_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79');

-- CSCI 180 requires CSEN 20 and (CSCI 62 or CSEN 79)
-- Required: CSEN 20
WITH prereq_csci_180_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 180'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_180_req.id, courses.id
FROM prereq_csci_180_req, courses
WHERE courses.code = 'CSEN 20';
-- OR group
WITH prereq_csci_180_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 180'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_180_or.id, c.id
FROM prereq_csci_180_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79');

-- CSCI 181 requires MATH 178 and (CSCI 62 or CSEN 79)
-- Required: MATH 178
WITH prereq_csci_181_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 181'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_181_req.id, courses.id
FROM prereq_csci_181_req, courses
WHERE courses.code = 'MATH 178';
-- OR group
WITH prereq_csci_181_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 181'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_181_or.id, c.id
FROM prereq_csci_181_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79');

-- CSCI 183 requires MATH 53, MATH 122 and (CSCI 62 or CSEN 79)
-- Required: MATH 53, MATH 122
WITH prereq_csci_183_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 183'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_183_req.id, c.id
FROM prereq_csci_183_req, courses c
WHERE c.code IN ('MATH 53', 'MATH 122');
-- OR group
WITH prereq_csci_183_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 183'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_183_or.id, c.id
FROM prereq_csci_183_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79');

-- CSCI 184 requires CSCI 183
WITH prereq_csci_184 AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 184'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_184.id, courses.id
FROM prereq_csci_184, courses
WHERE courses.code = 'CSCI 183';

-- CSCI 185 requires MATH 53, MATH 122 and (CSCI 62 or CSEN 79)
-- Required: MATH 53, MATH 122
WITH prereq_csci_185_req AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'required', 'C-'
    FROM courses
    WHERE code = 'CSCI 185'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_185_req.id, c.id
FROM prereq_csci_185_req, courses c
WHERE c.code IN ('MATH 53', 'MATH 122');
-- OR group
WITH prereq_csci_185_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 185'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_185_or.id, c.id
FROM prereq_csci_185_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79');

-- CSCI 187 requires (CSCI 62 or CSEN 79)
WITH prereq_csci_187_or AS (
    INSERT INTO prerequisites (course_id, prerequisite_type, min_grade)
    SELECT id, 'or', 'C-'
    FROM courses
    WHERE code = 'CSCI 187'
    RETURNING id
)
INSERT INTO prerequisite_courses (prerequisite_id, prerequisite_course_id)
SELECT prereq_csci_187_or.id, c.id
FROM prereq_csci_187_or, courses c
WHERE c.code IN ('CSCI 62', 'CSEN 79'); 