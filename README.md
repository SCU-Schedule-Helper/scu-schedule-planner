# SCU Schedule Planner

# 1. **Data Extraction & Modeling**

### 1.1. **Extract Course and Requirement Data**

- **Manual/Automated Parsing**:
  - Parse course catalog and requirements from SCU Bulletin and checklist.
  - Extract:
    - Course code, title, units, description, prerequisites (including complex chains), corequisites, quarters offered, department, upper/lower division status.
    - Requirement groupings (core, major, emphasis, university/college core), "choose X of Y" rules, minimum units, allowed substitutions, notes.
- **Edge Cases**:
  - Cross-listed courses (e.g., CSCI/CSEN).
  - Prerequisites that are "one of" a set (e.g., "MATH 9 or Calculus Readiness Exam").
  - Co-requisites (must be taken together).
  - Courses not offered every quarter/year.
  - Requirements that allow "any upper-division elective" or "advisor-approved course."
  - Double-counting: courses that fulfill multiple requirements.

### 1.2. **Normalize to Structured Data**

- **Course Example**:

```json
{
  "code": "CSCI 61",
  "title": "Data Structures",
  "units": 5,
  "prerequisites": ["CSCI 60"],
  "corequisites": [],
  "offeredQuarters": ["Fall", "Winter"],
  "department": "CSCI",
  "isUpperDivision": false
}
```

- **Requirement Example**:

```json
{
  "name": "Major Core",
  "type": "major",
  "coursesRequired": ["CSCI 10", "CSCI 60", "CSCI 61", "CSCI 62"],
  "chooseFrom": [],
  "minUnits": 0,
  "notes": ""
}
```

- **"Choose X of Y" Example**:

```json
{
  "name": "Emphasis Electives",
  "type": "emphasis",
  "coursesRequired": [],
  "chooseFrom": {
    "count": 2,
    "options": ["CSCI 146", "CSCI 147", "CSCI 165", "CSCI 181"]
  },
  "minUnits": 0,
  "notes": ""
}
```

## 2. **Project Setup**

### 2.1. **Initialize Next.js Project**

- `npx create-next-app degree-planner --typescript`
- Install dependencies:
  - UI: `tailwindcss`, `shadcn-ui`
  - State: `zustand`
  - Drag-and-drop: `@hello-pangea/dnd`
  - Data fetching: `react-query`
  - Prereq graph: `react-flow-renderer`
  - PDF export: `react-pdf`
  - Date handling: `date-fns`

### 2.2. **Directory Structure**

```
/components
  /CourseCatalog
  /QuarterPlanner
  /RequirementChecklist
  /Dashboard
  /PrereqGraph
  /Onboarding
/data
  courses.json
  requirements.json
/hooks
  usePlannerStore.ts
/pages
  index.tsx
  planner.tsx
  dashboard.tsx
/utils
  validation.ts
  prerequisites.ts
```

## 3. **Data Models \& State Management**

### 3.1. **TypeScript Interfaces**

```typescript
interface Course {
  code: string;
  title: string;
  units: number;
  prerequisites: string[]; // course codes
  corequisites: string[];
  offeredQuarters: string[];
  department: string;
  isUpperDivision: boolean;
}

interface Requirement {
  name: string;
  type: "major" | "emphasis" | "core" | "university";
  coursesRequired: string[];
  chooseFrom?: { count: number; options: string[] };
  minUnits?: number;
  notes?: string;
}

interface PlannedCourse {
  courseCode: string;
  quarter: string; // e.g. "2025 Fall"
  status: "planned" | "completed";
  grade?: string;
}

interface UserPlan {
  quarters: {
    [quarter: string]: PlannedCourse[];
  };
  completedCourses: string[];
  plannedCourses: string[];
  emphasis?: string;
}
```

### 3.2. **State Management**

- Use `zustand` for global planner state (user plan, selected major/emphasis, etc.).
- Persist state to local storage and/or Supabase for user accounts.

## 4. **User Experience Flow**

### 4.1. **Onboarding**

- **Step 1:** Select major and emphasis (if applicable).
- **Step 2:** Optionally import transcript or manually mark completed courses.
- **Step 3:** Set preferences (pace per quarter, max units, summer enrollment, etc.).
- **Edge Cases**:
  - User switches major/emphasis after planning—system must recalculate requirements and validate plan.
  - User imports incomplete transcript—system must prompt for missing data.

### 4.2. **Course Catalog**

- **Features:**
  - Search/filter by code, title, department, quarter offered.
  - Click course to view details: description, prerequisites (as a graph), quarters offered, units.
  - Add course to plan directly from catalog.
- **Edge Cases**:
  - Prerequisites not yet planned—show warning.
  - Course only offered in certain quarters—disable or warn if user tries to schedule in unavailable quarter.
  - Cross-listed courses—show all aliases.

### 4.3. **Quarterly Planner**

- **Features:**
  - Grid view: columns = quarters, rows = planned courses.
  - Drag-and-drop to move courses between quarters.
  - Visual cues:
    - Red: prerequisites unmet.
    - Yellow: corequisites not scheduled together.
    - Gray: course not offered this quarter.
    - Green: all requirements met for this course.
  - Max units per quarter enforced; warn if exceeded.
  - Allow custom notes per quarter.
- **Edge Cases**:
  - User tries to schedule two courses with time conflicts (future: allow time input).
  - User exceeds max units—option to override with advisor approval.
  - Schedule gap (e.g., missing a required sequence course, delaying graduation).
  - Prerequisite chains across multiple years.

### 4.4. **Requirement Checklist**

- **Features:**
  - Grouped by type (major, emphasis, university core, etc.).
  - For each requirement:
    - List required courses, status (planned/completed/missing).
    - For "choose X of Y," show progress (e.g., "1 of 2 selected").
    - Show double-counted courses with an asterisk or note.
  - Click to see which planned/taken courses fulfill each requirement.
- **Edge Cases**:
  - Course fulfills multiple requirements—handle double-counting rules.
  - User satisfies a requirement with an advisor-approved substitution—allow manual override with note.

### 4.5. **Prerequisite Graph**

- **Features:**
  - Visualize all prerequisites for a course as a directed graph.
  - Highlight missing prerequisites in red.
  - Allow user to click nodes for course details.
- **Edge Cases**:
  - Circular prerequisites (should not happen, but system should detect and warn).
  - Deep prerequisite chains (e.g., 4+ levels)—auto-collapse or scroll.

### 4.6. **Progress Dashboard**

- **Features:**
  - Progress bars for each requirement group.
  - Total units, upper-division units, GPA (if grades entered).
  - Estimated graduation quarter.
  - List of unmet or at-risk requirements (e.g., "CSCI 161 not scheduled, required before senior year").
  - Export plan as PDF or shareable link.
- **Edge Cases**:
  - User plans a course sequence that delays graduation (e.g., missing a prerequisite for a spring-only course).

## 5. **Validation \& Logic**

### 5.1. **Plan Validation**

- **On every change**:
  - Check all planned courses for prerequisite/corequisite satisfaction.
  - Validate that each requirement (including "choose X of Y") is satisfied by planned/completed courses.
  - Enforce max units per quarter (unless overridden).
  - Warn if a course is scheduled in a quarter it's not offered.
  - Detect and warn about scheduling conflicts, gaps in sequences, or missing requirements.

### 5.2. **Edge Case Handling**

- **Double-counting**: Track which requirements each course fulfills; warn if double-counting is not allowed.
- **Substitutions**: Allow user to manually mark a course as fulfilling a requirement with advisor note.
- **Electives**: For "any upper-division elective," allow user to select from eligible courses.
- **Transfer/AP credit**: Allow user to mark courses as satisfied via transfer/AP.

## 6. **Extensibility \& Modularity**

### 6.1. **Data-Driven Design**

- All requirements and courses are defined in JSON or a database.
- To add a new major or school, import new data—no code changes needed.
- UI components render dynamically based on data.

### 6.2. **Customizable Logic**

- Plugin system for custom requirement logic (e.g., "must take at least 3 courses from list A and 2 from list B").
- Configurable validation rules per major/catalog.

## 7. **User Experience (UX) Considerations**

- **Responsive design** for desktop and mobile.
- **Undo/redo** for planning actions.
- **Autosave** and persistent storage.
- **Accessibility**: Keyboard navigation, ARIA labels.
- **Tooltips** and contextual help.
- **Warnings** and suggestions for common mistakes (e.g., "You have not scheduled CSCI 161, which is a prerequisite for several senior courses").
- **Advisor mode**: Allow advisors to review and comment on plans.

## 8. **Testing \& Quality Assurance**

- **Unit tests** for validation logic and edge cases.
- **Integration tests** for drag-and-drop, prerequisite checking, and requirement satisfaction.
- **User testing** with real students and advisors for usability feedback.

## 9. **Example User Flow**

1. **User logs in, selects Computer Science major (2024-25) and "Algorithms" emphasis.**
2. **Imports transcript**: CSCI 10, MATH 11 marked as completed.
3. **Planner auto-populates**: Shows which requirements are already satisfied.
4. **User drags courses into future quarters**; system validates prerequisites and warns about scheduling conflicts.
5. **User sees progress dashboard**: 30% major complete, missing 2 university core requirements.
6. **User exports plan as PDF for advisor review.**

## 10. **Future Enhancements**

- **API integration** with university systems for real-time course offerings and transcript import.
- **Schedule optimizer**: Suggests best course sequences based on user constraints.
- **Peer plan sharing**: Compare plans with classmates.
- **Mobile app**: React Native or PWA.
