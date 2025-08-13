// Types for requirements
export interface Course {
    code: string;
    title: string;
    units: number;
    prerequisites?: string[]; // course codes
    corequisites?: string[];
    offeredQuarters?: string[];
    department: string;
    isUpperDivision: boolean;
}

export interface RequirementGroup {
    name: string;
    type: "major" | "emphasis" | "core" | "university";
    coursesRequired: string[];
    chooseFrom?: {
        count: number;
        options: string[];
    };
    minUnits?: number;
    notes?: string;
}

// Computer Science Major Requirements
export const CSMajorRequirements: RequirementGroup[] = [
    // Core Requirements
    {
        name: "Mathematics Core",
        type: "core",
        coursesRequired: [
            "MATH 11",  // Calculus I
            "MATH 12",  // Calculus II
            "MATH 13",  // Calculus III
            "MATH 14",  // Calculus IV
            "MATH 51",  // Discrete Mathematics
            "MATH 53", // Linear Algebra
            "MATH 122", // Probability and Statistics
        ],
        notes: "All mathematics courses must be taken for a letter grade"
    },
    {
        name: "Computer Science Lower Division Core",
        type: "major",
        coursesRequired: [
            "CSCI 10",  // Introduction to Computer Science
            "CSCI 60",  // Object-Oriented Programming
            "CSCI 61",  // Data Structures
            "CSCI 62",  // Advanced Programming
            "CSEN 20",  // Intro to Embedded Systems
            "ELEN 21",  // Intro to Logic Design
        ]
    },
    {
        name: "Computer Science Upper Division Core",
        type: "major",
        coursesRequired: [
            "CSCI 161", // Theory of Automata and Languages 
            "CSCI 163", // Theory of Algorithms
            "CSEN 177", // Operating Systems
        ]
    }
];

// University Core Requirements

// University Core Requirements
export const UniversityCoreRequirements: RequirementGroup[] = [
    {
        name: "Critical Thinking & Writing",
        type: "university",
        coursesRequired: [
            "CTW 1",
            "CTW 2"
        ]
    },
    {
        name: "Cultures & Ideas",
        type: "university",
        coursesRequired: [
            "C&I 1",
            "C&I 2",
            "C&I 3"
        ]
    },
    {
        name: "Religion, Theology & Culture",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 3,
            options: ["RTC 1", "RTC 2", "RTC 3"]
        }
    },
    {
        name: "Diversity",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["DIV 1"]
        }
    },
    {
        name: "Ethics",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["ETH 1"]
        }
    },
    {
        name: "ELSJ",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["ELSJ 1"]
        }
    },
    {
        name: "Social Science",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["SOC 1"]
        }
    },
    {
        name: "Civic Engagement",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["CIV 1"]
        }
    },
    {
        name: "Second Language",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["SPAN 21A"]
        }
    },
    {
        name: "Arts",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["ARTS 1"]
        }
    },
    {
        name: "Natural Science",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["NATSCI 1"]
        }
    },
    {
        name: "Science, Technology, and Society",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["SCIT 1"]
        }
    },
    {
        name: "Advanced Writing",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["ADVWR 1"]
        }
    },
    {
        name: "Math",
        type: "university",
        coursesRequired: [],
        chooseFrom: {
            count: 1,
            options: ["MATH 11"]
        }
    }
]; 