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

// Emphasis Areas
export const CSEmphasisRequirements: { [key: string]: RequirementGroup[] } = {
    "Algorithms and Complexity": [
        {
            name: "Required Emphasis Courses",
            type: "emphasis",
            coursesRequired: ["CSCI 162", "CSCI 164"],
            notes: "Required courses for Algorithms and Complexity emphasis"
        },
        {
            name: "Emphasis Electives Group 1",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 2,
                options: ["CSCI 146", "CSCI 147", "CSCI 165", "CSCI 181", "MATH 101", "MATH 175", "MATH 176", "MATH 177", "MATH 178"]
            },
            notes: "Choose two courses from this list"
        },
        {
            name: "Additional Emphasis Course",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 1,
                options: ["CSCI 146", "CSCI 147", "CSCI 165", "CSCI 181", "MATH 101", "MATH 175", "MATH 176", "MATH 177", "MATH 178"]
            },
            notes: "Choose one more course from the list above or any other additional 4-5 unit upper-division CSCI course below 190 or CSEN course below 188"
        }
    ],
    "Data Science": [
        {
            name: "Required Emphasis Courses",
            type: "emphasis",
            coursesRequired: ["CSCI 183", "CSCI 184", "CSCI 185"],
            notes: "Required courses for Data Science emphasis"
        },
        {
            name: "Emphasis Electives",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 2,
                options: ["CSCI 127", "CSCI 146", "CSCI 147", "CSCI 164", "CSCI 166", "MATH 123", "CSEN 166"]
            },
            notes: "Choose two courses from this list or any other additional 4-5 unit upper-division CSCI course below 190 or CSEN course below 188"
        }
    ],
    "Security": [
        {
            name: "Required Emphasis Courses",
            type: "emphasis",
            coursesRequired: ["MATH 178", "CSCI 180", "CSCI 181"],
            notes: "Required courses for Security emphasis"
        },
        {
            name: "Emphasis Electives",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 2,
                options: ["MATH 175", "CSEN 152", "CSEN 161", "CSEN 146"]
            },
            notes: "Choose two courses from this list (must take corresponding labs for CSEN courses) or any other additional 4-5 unit upper-division CSCI course below 190 or CSEN course below 188"
        }
    ],
    "Software": [
        {
            name: "Required Emphasis Courses",
            type: "emphasis",
            coursesRequired: ["CSCI 169", "CSCI 187", "CSEN 146"],
            notes: "Required courses for Software emphasis (must take CSEN 146L with CSEN 146)"
        },
        {
            name: "Emphasis Elective Group 1",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 1,
                options: ["CSCI 183", "CSCI 180", "CSCI 168"]
            },
            notes: "Choose one course from this list or any other additional 4-5 unit upper-division CSCI course below 190"
        },
        {
            name: "Emphasis Elective Group 2",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 1,
                options: ["CSCI 183", "CSCI 180", "CSCI 168", "CSEN 161", "CSEN 178"]
            },
            notes: "Choose one course from this list or any other additional 4-5 unit upper-division CSCI course below 190 or CSEN course below 188"
        }
    ],
    "Open Emphasis": [
        {
            name: "Open Emphasis Requirements",
            type: "emphasis",
            coursesRequired: [],
            chooseFrom: {
                count: 5,
                options: []
            },
            notes: "Open emphasis of the student's choosing. In order to pursue this emphasis the student must get their courses approved along with their advisor's signature at least three quarters before they graduate. Three of the five upper division courses must be CSCI or MATH."
        }
    ]
};

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