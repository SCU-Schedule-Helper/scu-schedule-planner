"use client";

import { useState, useEffect } from "react";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import {
  useMajorsQuery,
  useEmphasisAreasQuery,
} from "@/hooks/api/useOnboardingQuery";
import { useCreatePlanMutation } from "@/hooks/api/usePlanQuery";
import useSupabaseBrowser from "@/lib/supabase/client";

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    planName: "My Degree Plan",
    majorId: "",
    emphasisId: "",
    maxUnitsPerQuarter: 20,
    includeSummer: false,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const supabase = useSupabaseBrowser();

  // Get the user ID from Supabase or mock user
  useEffect(() => {
    const getUserId = async () => {
      // Try to get the user from Supabase
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
        return;
      }

      // For development, use a mock user ID if no session
      setUserId("mock-user-id");
    };

    getUserId();
  }, [supabase.auth]);

  const { setCurrentPlan, completeOnboarding, addPlan } = usePlannerStore();

  const { data: majors, isLoading: isLoadingMajors } = useMajorsQuery();
  const { data: emphasisAreas, isLoading: isLoadingEmphasis } =
    useEmphasisAreasQuery(formData.majorId);

  const createPlanMutation = useCreatePlanMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    try {
      // Ensure maxUnitsPerQuarter is a number
      const maxUnitsPerQuarter = Number(formData.maxUnitsPerQuarter);

      console.log("Creating plan with data:", {
        name: formData.planName,
        userId,
        majorId: formData.majorId,
        emphasisId: formData.emphasisId || undefined,
        catalogYearId: "current",
        maxUnitsPerQuarter,
        includeSummer: formData.includeSummer,
      });

      const newPlan = await createPlanMutation.mutateAsync({
        name: formData.planName,
        userId,
        majorId: formData.majorId,
        emphasisId: formData.emphasisId || undefined,
        catalogYearId: "current", // Default to current catalog year
        maxUnitsPerQuarter, // Now a number
        includeSummer: formData.includeSummer,
        quarters: [],
        completedCourses: [],
      });

      console.log("Plan created:", newPlan);

      if (newPlan.id) {
        addPlan(newPlan);
        setCurrentPlan(newPlan.id);
        completeOnboarding();
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to SCU Degree Planner
        </h1>
        <p className="text-gray-600">
          Let&apos;s set up your personalized degree plan
        </p>

        <div className="flex mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 mx-1 rounded ${
                i <= step ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Major</h2>
          <p className="mb-4 text-gray-600">
            Choose your major from the list below.
          </p>

          {isLoadingMajors ? (
            <div>Loading majors...</div>
          ) : (
            <select
              name="majorId"
              value={formData.majorId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Major</option>
              {majors?.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Select Emphasis (Optional)
          </h2>
          <p className="mb-4 text-gray-600">
            If applicable, choose an emphasis area for your major.
          </p>

          {isLoadingEmphasis ? (
            <div>Loading emphasis areas...</div>
          ) : (
            <select
              name="emphasisId"
              value={formData.emphasisId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">No Emphasis / General</option>
              {emphasisAreas?.map((emphasis) => (
                <option key={emphasis.id} value={emphasis.id}>
                  {emphasis.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <p className="mb-4 text-gray-600">
            Set your preferences for your degree plan.
          </p>

          <div className="mb-4">
            <label className="block mb-2">Plan Name</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Maximum Units per Quarter</label>
            <input
              type="number"
              name="maxUnitsPerQuarter"
              value={formData.maxUnitsPerQuarter}
              onChange={handleInputChange}
              min={12}
              max={25}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="includeSummer"
                checked={formData.includeSummer}
                onChange={handleInputChange}
                className="mr-2"
              />
              Include summer quarters in planning
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Back
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={
            (step === 1 && !formData.majorId) || createPlanMutation.isPending
          }
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {step === 3
            ? createPlanMutation.isPending
              ? "Creating..."
              : "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
