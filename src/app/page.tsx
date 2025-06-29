"use client";
import RequirementChecklist from "@/components/RequirementChecklist";
import {
  CSMajorRequirements,
  UniversityCoreRequirements,
  CSEmphasisRequirements,
} from "@/data/requirements";
import { useState } from "react";

export default function Home() {
  // Example completed/planned courses - in a real app this would come from state/database
  const completedCourses = ["CSCI 10", "MATH 11", "MATH 12"];
  const plannedCourses = ["CSCI 60", "CSCI 61", "MATH 13"];

  // State for selected emphasis
  const [selectedEmphasis, setSelectedEmphasis] = useState<string>(
    "Algorithms and Complexity"
  );

  // Get the requirements for the selected emphasis
  const emphasisRequirements = CSEmphasisRequirements[selectedEmphasis] || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 border-b">
        <h1 className="text-3xl font-bold text-center">
          SCU Computer Science Degree Planner
        </h1>
      </header>

      <main className="container mx-auto py-8">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Major Requirements</h2>
            <RequirementChecklist
              requirements={CSMajorRequirements}
              completedCourses={completedCourses}
              plannedCourses={plannedCourses}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Emphasis Selection</h2>
            <div className="mb-4">
              <label
                htmlFor="emphasis-select"
                className="block text-sm font-medium mb-2"
              >
                Choose an emphasis:
              </label>
              <select
                id="emphasis-select"
                value={selectedEmphasis}
                onChange={(e) => setSelectedEmphasis(e.target.value)}
                className="w-full p-2 border rounded bg-background text-foreground"
              >
                {Object.keys(CSEmphasisRequirements).map((emphasis) => (
                  <option key={emphasis} value={emphasis}>
                    {emphasis}
                  </option>
                ))}
              </select>
            </div>
            <RequirementChecklist
              requirements={emphasisRequirements}
              completedCourses={completedCourses}
              plannedCourses={plannedCourses}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              University Core Requirements
            </h2>
            <RequirementChecklist
              requirements={UniversityCoreRequirements}
              completedCourses={completedCourses}
              plannedCourses={plannedCourses}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
