import { useState, useEffect } from "react";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import RequirementChecklist from "./RequirementChecklist";
import {
  useMajorRequirementsQuery,
  useUniversityRequirementsQuery,
  useEmphasisRequirementsQuery,
} from "@/hooks/api/useRequirementsQuery";
import { usePlanQuery } from "@/hooks/api/usePlanQuery";

const RequirementsTab = () => {
  const { selectedEmphasisId, currentPlanId, plans, addPlan } =
    usePlannerStore();
  const [activeSection, setActiveSection] = useState<
    "major" | "emphasis" | "university"
  >("major");

  // Fetch requirements data
  const { data: majorRequirements, isLoading: isLoadingMajor } =
    useMajorRequirementsQuery();
  const { data: universityRequirements, isLoading: isLoadingUniversity } =
    useUniversityRequirementsQuery();
  const { data: emphasisRequirements, isLoading: isLoadingEmphasis } =
    useEmphasisRequirementsQuery(selectedEmphasisId || "");

  // Fetch the current plan
  const {
    data: currentPlan,
    isLoading: isLoadingPlan,
    error: planError,
  } = usePlanQuery(currentPlanId || "");

  // Check if we have a valid plan or if we need to show the empty state
  const hasPlanError = !!planError || (!isLoadingPlan && !currentPlan);
  const hasPlans = plans && plans.length > 0;

  // Inject fetched plan into zustand if not already present
  useEffect(() => {
    if (currentPlan && !plans.some((p) => p.id === currentPlan.id)) {
      addPlan(currentPlan);
    }
  }, [currentPlan, plans, addPlan]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Degree Requirements</h1>

        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveSection("major")}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              activeSection === "major"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300`}
          >
            Major
          </button>
          {selectedEmphasisId && (
            <button
              onClick={() => setActiveSection("emphasis")}
              className={`px-4 py-2 text-sm font-medium ${
                activeSection === "emphasis"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border-t border-b border-r border-gray-300`}
            >
              Emphasis
            </button>
          )}
          <button
            onClick={() => setActiveSection("university")}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              activeSection === "university"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border-t border-b border-r border-gray-300`}
          >
            University Core
          </button>
        </div>
      </div>

      {isLoadingPlan ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading your plan...</p>
        </div>
      ) : hasPlanError ? (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            No Active Plan Found
          </h3>
          <p className="text-yellow-700 mb-4">
            You need an active plan to track your requirements.
            {!hasPlans
              ? " Please create a plan first."
              : " Please select a plan from your existing plans."}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          {activeSection === "major" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Major Requirements</h2>
              {isLoadingMajor ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">
                    Loading major requirements...
                  </p>
                </div>
              ) : (
                <RequirementChecklist requirements={majorRequirements || []} />
              )}
            </section>
          )}

          {activeSection === "emphasis" && selectedEmphasisId && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Emphasis Requirements
              </h2>
              {isLoadingEmphasis ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">
                    Loading emphasis requirements...
                  </p>
                </div>
              ) : (
                <RequirementChecklist
                  requirements={emphasisRequirements || []}
                />
              )}
            </section>
          )}

          {activeSection === "university" && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                University Core Requirements
              </h2>
              {isLoadingUniversity ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">
                    Loading university requirements...
                  </p>
                </div>
              ) : (
                <RequirementChecklist
                  requirements={universityRequirements || []}
                />
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default RequirementsTab;
