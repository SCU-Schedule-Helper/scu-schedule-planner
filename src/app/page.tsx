"use client";

import { usePlannerStore } from "@/hooks/usePlannerStore";
import OnboardingFlow from "@/components/Onboarding/OnboardingFlow";
import CourseCatalog from "@/components/CourseCatalog/CourseCatalog";
import RequirementsTab from "@/components/RequirementsTab";

export default function Home() {
  const { isOnboardingComplete, activeTab, setActiveTab } = usePlannerStore();

  // Show onboarding if not completed
  if (!isOnboardingComplete) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 border-b">
        <h1 className="text-3xl font-bold text-center">
          SCU Computer Science Degree Planner
        </h1>
        <nav className="flex justify-center mt-4">
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-4 py-2 rounded ${
                  activeTab === "catalog"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Course Catalog
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("planner")}
                className={`px-4 py-2 rounded ${
                  activeTab === "planner"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Quarter Planner
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("requirements")}
                className={`px-4 py-2 rounded ${
                  activeTab === "requirements"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Requirements
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded ${
                  activeTab === "dashboard"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Dashboard
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto py-8 px-4">
        {activeTab === "catalog" && <CourseCatalog />}

        {activeTab === "planner" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Quarter Planner</h2>
            <p className="text-gray-500">
              Quarter Planner component will be implemented here
            </p>
          </div>
        )}

        {activeTab === "requirements" && <RequirementsTab />}

        {activeTab === "dashboard" && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-500">
              Dashboard component will be implemented here
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
