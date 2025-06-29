// Types
export interface CoursePrerequisite {
    courses: string[];  // List of course codes that must ALL be taken
    type: "required" | "or" | "recommended";  // "or" means one of the courses is required
    grade?: string;  // e.g., "C-" if a minimum grade is required
}

export interface Course {
    code: string;
    title: string;
    units: number;
    prerequisites?: CoursePrerequisite[];
    corequisites?: string[];
    offeredQuarters?: ("Fall" | "Winter" | "Spring" | "Summer")[];
    department: string;
    isUpperDivision: boolean;
    description?: string;
    crossListedAs?: string[];  // Array of course codes that this course is cross-listed with
}

// Course Definitions
export const Courses: { [key: string]: Course } = {
    // Mathematics Courses
    "MATH 11": {
        code: "MATH 11",
        title: "Calculus and Analytic Geometry I",
        units: 4,
        prerequisites: [{
            courses: ["MATH 9"],
            type: "required",
            grade: "C-"
        }],
        department: "MATH",
        isUpperDivision: false,
        description: "Limits and differentiation. Methods and applications of differentiation."
    },
    "MATH 12": {
        code: "MATH 12",
        title: "Calculus and Analytic Geometry II",
        units: 4,
        prerequisites: [{
            courses: ["MATH 11"],
            type: "required",
            grade: "C-"
        }],
        department: "MATH",
        isUpperDivision: false,
        description: "Further applications of differentiation. Integration and the fundamental theorem of calculus."
    },
    "MATH 13": {
        code: "MATH 13",
        title: "Calculus and Analytic Geometry III",
        units: 4,
        prerequisites: [{
            courses: ["MATH 12"],
            type: "required",
            grade: "C-"
        }],
        department: "MATH",
        isUpperDivision: false,
        description: "Taylor series, vectors, quadric surfaces, and partial derivatives."
    },
    "MATH 14": {
        code: "MATH 14",
        title: "Calculus and Analytic Geometry IV",
        units: 4,
        prerequisites: [{
            courses: ["MATH 13"],
            type: "required",
            grade: "C-"
        }],
        department: "MATH",
        isUpperDivision: false,
        description: "Vector functions, line integrals, multiple integrals, flux, divergence theorem, and Stokes' theorem."
    },
    "MATH 51": {
        code: "MATH 51",
        title: "Discrete Mathematics",
        units: 4,
        department: "MATH",
        isUpperDivision: false,
        description: "Predicate logic, methods of proof, sets, functions, sequences and summations, modular arithmetic, cardinality, induction."
    },
    "MATH 53": {
        code: "MATH 53",
        title: "Linear Algebra",
        units: 4,
        prerequisites: [{
            courses: ["MATH 13"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: false,
        description: "Vector spaces, linear transformations, algebra of matrices, eigenvalues and eigenvectors, and inner products."
    },
    "MATH 122": {
        code: "MATH 122",
        title: "Probability and Statistics I",
        units: 5,
        prerequisites: [{
            courses: ["MATH 14"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Sample spaces, conditional probability, random variables, discrete and continuous probability distributions."
    },
    "MATH 101": {
        code: "MATH 101",
        title: "Advanced Calculus I",
        units: 5,
        prerequisites: [{
            courses: ["MATH 14"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Rigorous treatment of the foundations of calculus, including continuity, differentiation, and integration."
    },
    "MATH 123": {
        code: "MATH 123",
        title: "Probability and Statistics II",
        units: 5,
        prerequisites: [{
            courses: ["MATH 122"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Estimation, hypothesis testing, regression, analysis of variance, and nonparametric tests."
    },
    "MATH 175": {
        code: "MATH 175",
        title: "Theory of Numbers",
        units: 5,
        prerequisites: [{
            courses: ["MATH 51"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Divisibility, congruences, Diophantine equations, quadratic residues, and continued fractions."
    },
    "MATH 176": {
        code: "MATH 176",
        title: "Combinatorics",
        units: 5,
        prerequisites: [{
            courses: ["MATH 51"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Permutations, combinations, generating functions, recurrence relations, inclusion-exclusion, and Polya counting."
    },
    "MATH 177": {
        code: "MATH 177",
        title: "Graph Theory",
        units: 5,
        prerequisites: [{
            courses: ["MATH 51"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Basic concepts, trees, connectivity, Euler and Hamilton circuits, matchings, colorings, planarity, and directed graphs."
    },
    "MATH 178": {
        code: "MATH 178",
        title: "Cryptography",
        units: 5,
        prerequisites: [{
            courses: ["MATH 175"],
            type: "required"
        }],
        department: "MATH",
        isUpperDivision: true,
        description: "Classical and modern methods of encryption, public key cryptosystems, and digital signatures."
    },

    // CSEN Lower Division Courses
    "CSEN 10": {
        code: "CSEN 10",
        title: "Introduction to Programming",
        units: 4,
        corequisites: ["CSEN 10L"],
        department: "CSEN",
        isUpperDivision: false,
        description: "Overview of computing. Introduction to program design and implementation in PHP and C. Program development in Linux environment."
    },
    "CSEN 11": {
        code: "CSEN 11",
        title: "Advanced Programming",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 10", "CSCI 10"],
            type: "or",
            grade: "C-"
        }],
        corequisites: ["CSEN 11L"],
        department: "CSEN",
        isUpperDivision: false,
        description: "The C Language: structure and style. Types, operators, control flow, functions, pointers, arrays, structures, and dynamic memory allocation."
    },
    "CSEN 12": {
        code: "CSEN 12",
        title: "Abstract Data Types and Data Structures",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 11"],
            type: "required",
            grade: "C-"
        }],
        corequisites: ["CSEN 12L"],
        department: "CSEN",
        isUpperDivision: false,
        description: "Data abstraction, basic data structures, stacks, queues, lists, binary trees, hashing, graphs. Implementation in C language."
    },
    "CSEN 19": {
        code: "CSEN 19",
        title: "Discrete Mathematics",
        units: 4,
        department: "CSEN",
        isUpperDivision: false,
        description: "Predicate logic, methods of proof, sets, functions, sequences and summations, modular arithmetic, cardinality, induction."
    },
    "CSEN 20": {
        code: "CSEN 20",
        title: "Introduction to Embedded Systems",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        department: "CSEN",
        isUpperDivision: false,
        description: "Introduction to embedded systems and assembly language programming."
    },
    "CSEN 21": {
        code: "CSEN 21",
        title: "Introduction to Logic Design",
        units: 4,
        corequisites: ["CSEN 21L"],
        department: "CSEN",
        isUpperDivision: false,
        description: "Boolean functions and their minimization. Combinational circuits: arithmetic circuits, multiplexers, decoders. Sequential logic circuits: latches and flip-flops, registers, counters. Memory. Busing. Use of industry quality CAD tools for HDL in conjunction with FPGAs."
    },
    "ELEN 21": {
        code: "ELEN 21",
        title: "Introduction to Logic Design",
        units: 4,
        corequisites: ["ELEN 21L"],
        department: "ELEN",
        isUpperDivision: false,
        description: "Boolean functions and their minimization. Combinational circuits: arithmetic circuits, multiplexers, decoders. Sequential logic circuits: latches and flip-flops, registers, counters. Memory. Busing. Use of industry quality CAD tools for HDL in conjunction with FPGAs.",
        crossListedAs: ["CSEN 21"]  // Indicating this course is cross-listed with CSEN 21
    },
    "CSEN 79": {
        code: "CSEN 79",
        title: "Object-Oriented Programming and Advanced Data Structures",
        units: 4,
        prerequisites: [
            {
                courses: ["CSEN 12", "CSCI 61"],
                type: "or",
                grade: "C-"
            },
            {
                courses: ["CSEN 19", "MATH 51"],
                type: "or",
                grade: "C-"
            }
        ],
        corequisites: ["CSEN 79L"],
        department: "CSEN",
        isUpperDivision: false,
        description: "Object-oriented programming concepts, advanced data structures implementation, software reliability and reusability."
    },

    // CSCI Core and Elective Courses
    "CSCI 10": {
        code: "CSCI 10",
        title: "Introduction to Computer Science",
        units: 5,
        department: "CSCI",
        isUpperDivision: false,
        description: "Introduction to computer science and programming in Python."
    },
    "CSCI 60": {
        code: "CSCI 60",
        title: "Object-Oriented Programming",
        units: 5,
        prerequisites: [{
            courses: ["CSCI 10"],
            type: "required",
            grade: "C-"
        }],
        department: "CSCI",
        isUpperDivision: false,
        description: "Object-oriented programming techniques using C++."
    },
    "CSCI 61": {
        code: "CSCI 61",
        title: "Data Structures",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 60"],
            type: "required",
            grade: "C-"
        }],
        department: "CSCI",
        isUpperDivision: false,
        description: "Specification, implementations, and analysis of basic data structures."
    },
    "CSCI 62": {
        code: "CSCI 62",
        title: "Advanced Programming",
        units: 4,
        prerequisites: [
            {
                courses: ["CSCI 60"],
                type: "required",
                grade: "C-"
            },
            {
                courses: ["CSCI 61"],
                type: "required",
                grade: "C-"
            }
        ],
        department: "CSCI",
        isUpperDivision: false,
        description: "Advanced object-oriented programming and applications."
    },

    // CSEN Upper Division Courses
    "CSEN 120": {
        code: "CSEN 120",
        title: "Real-Time Systems",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 12", "CSCI 61"],
            type: "or",
            grade: "C-"
        }],
        corequisites: ["CSEN 120L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Real-time systems, finite state machines, robot programming, real-time programming languages and kernels."
    },
    "CSEN 122": {
        code: "CSEN 122",
        title: "Computer Architecture",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 20", "CSEN 21"],
            type: "required",
            grade: "C-"
        }],
        corequisites: ["CSEN 122L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Instruction set architecture, CPU design, memory hierarchies, pipelining, hardware description languages."
    },
    "CSEN 140": {
        code: "CSEN 140",
        title: "Machine Learning and Data Mining",
        units: 4,
        prerequisites: [
            {
                courses: ["AMTH 108"],
                type: "required",
                grade: "C-"
            },
            {
                courses: ["MATH 53"],
                type: "required",
                grade: "C-"
            },
            {
                courses: ["CSEN 12", "CSCI 61"],
                type: "or",
                grade: "C-"
            }
        ],
        corequisites: ["CSEN 140L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Introduction to machine learning and data mining, main principles, algorithms, and applications."
    },
    "CSEN 143": {
        code: "CSEN 143",
        title: "Internet of Things",
        units: 4,
        prerequisites: [
            {
                courses: ["CSEN 146"],
                type: "required",
                grade: "C-"
            },
            {
                courses: ["CSEN 177"],
                type: "required",
                grade: "C-"
            }
        ],
        corequisites: ["CSEN 143L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "IoT systems architecture, embedded processors, sensors, wireless protocols, IP networking, cloud computing."
    },
    "CSEN 145": {
        code: "CSEN 145",
        title: "Introduction to Parallel Computing",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 12", "CSCI 61"],
            type: "or",
            grade: "C-"
        }],
        corequisites: ["CSEN 145L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Parallel architectures, parallel programming, load balancing, parallel algorithms for data analytics."
    },
    "CSEN 146": {
        code: "CSEN 146",
        title: "Computer Networks",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        corequisites: ["CSEN 146L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Computer network architecture, protocols, and applications."
    },
    "CSEN 150": {
        code: "CSEN 150",
        title: "Introduction to Information Security",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 146"],
            type: "required",
            grade: "C-"
        }],
        corequisites: ["CSEN 150L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Security principles, operating system security, malware, network security, cryptography basics."
    },
    "CSEN 161": {
        code: "CSEN 161",
        title: "Web Development",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        corequisites: ["CSEN 161L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Web technologies, frameworks, and full-stack development."
    },
    "CSEN 164": {
        code: "CSEN 164",
        title: "Advanced Web Development",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 161"],
            type: "required",
            grade: "C-"
        }],
        corequisites: ["CSEN 164L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Web frameworks, web services, and web security management."
    },
    "CSEN 166": {
        code: "CSEN 166",
        title: "Artificial Intelligence",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        department: "CSEN",
        isUpperDivision: true,
        description: "AI principles, machine learning, and neural networks."
    },
    "CSEN 169": {
        code: "CSEN 169",
        title: "Web Search and Information Retrieval",
        units: 4,
        prerequisites: [
            {
                courses: ["AMTH 108", "MATH 122"],
                type: "or",
                grade: "C-"
            },
            {
                courses: ["CSEN 12", "CSCI 61"],
                type: "or",
                grade: "C-"
            }
        ],
        corequisites: ["CSEN 169L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Search engine technology, recommender systems, web data classification and clustering."
    },
    "CSEN 171": {
        code: "CSEN 171",
        title: "Principles of Design and Implementation of Programming Languages",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 79"],
            type: "required",
            grade: "C-"
        }],
        department: "CSEN",
        isUpperDivision: true,
        description: "Programming language concepts, constructs, implementation trade-offs."
    },
    "CSEN 174": {
        code: "CSEN 174",
        title: "Software Engineering",
        units: 4,
        prerequisites: [{
            courses: ["CSEN 79", "CSEN 161"],
            type: "or",
            grade: "C-"
        }],
        corequisites: ["CSEN 174L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Software development lifecycle, project management, requirements engineering, software testing."
    },
    "CSEN 177": {
        code: "CSEN 177",
        title: "Operating Systems",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        department: "CSEN",
        isUpperDivision: true,
        description: "Operating system concepts and implementation."
    },
    "CSEN 178": {
        code: "CSEN 178",
        title: "Mobile Application Development",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        department: "CSEN",
        isUpperDivision: true,
        description: "Mobile app development for iOS and Android platforms."
    },
    "CSEN 179": {
        code: "CSEN 179",
        title: "Theory of Algorithms",
        units: 5,
        prerequisites: [
            {
                courses: ["CSEN 12", "CSCI 61"],
                type: "or",
                grade: "C-"
            },
            {
                courses: ["CSEN 19", "MATH 51"],
                type: "or",
                grade: "C-"
            }
        ],
        department: "CSEN",
        isUpperDivision: true,
        description: "Algorithm analysis, design strategies, P and NP, approximation algorithms."
    },
    "CSEN 152": {
        code: "CSEN 152",
        title: "Computer Forensics",
        units: 4,
        prerequisites: [{
            courses: ["CSCI 61"],
            type: "required"
        }],
        corequisites: ["CSEN 152L"],
        department: "CSEN",
        isUpperDivision: true,
        description: "Digital evidence collection, analysis, and presentation."
    }
};

// Helper function to get prerequisites for a course
export function getCoursePrerequisites(courseCode: string): string[] {
    const course = Courses[courseCode];
    if (!course || !course.prerequisites) return [];

    return course.prerequisites.reduce((allPrereqs: string[], prereq) => {
        return [...allPrereqs, ...prereq.courses];
    }, []);
}

// Helper function to check if a course has all prerequisites satisfied
export function hasPrerequisitesSatisfied(courseCode: string, completedCourses: string[]): boolean {
    const course = Courses[courseCode];
    if (!course || !course.prerequisites) return true;

    return course.prerequisites.every(prereq => {
        if (prereq.type === "or") {
            return prereq.courses.some(code => completedCourses.includes(code));
        }
        return prereq.courses.every(code => completedCourses.includes(code));
    });
} 