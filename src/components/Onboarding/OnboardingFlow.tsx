"use client";

import { useState, useEffect } from "react";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import {
  useMajorsQuery,
  useEmphasisAreasQuery,
} from "@/hooks/api/useOnboardingQuery";
import { useCreatePlanMutation } from "@/hooks/api/usePlanQuery";
import useSupabaseBrowser from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxUnitsPerQuarter" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      includeSummer: checked,
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
            <Select
              value={formData.majorId}
              onValueChange={handleSelectChange("majorId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Major" />
              </SelectTrigger>
              <SelectContent>
                {majors?.map((major) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={formData.emphasisId}
              onValueChange={handleSelectChange("emphasisId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="No Emphasis / General" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Emphasis / General</SelectItem>
                {emphasisAreas?.map((emphasis) => (
                  <SelectItem key={emphasis.id} value={emphasis.id}>
                    {emphasis.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Maximum Units per Quarter</label>
            <Input
              type="number"
              name="maxUnitsPerQuarter"
              value={formData.maxUnitsPerQuarter}
              onChange={handleInputChange}
              min={12}
              max={25}
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <Checkbox
                checked={formData.includeSummer}
                onCheckedChange={handleCheckboxChange}
                className="mr-2"
              />
              Include summer quarters in planning
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button onClick={handleBack} variant="outline">
            Back
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={
            (step === 1 && !formData.majorId) || createPlanMutation.isPending
          }
        >
          {step === 3
            ? createPlanMutation.isPending
              ? "Creating..."
              : "Finish"
            : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
