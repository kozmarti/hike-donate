import { Step, StepKey, stepsConfig } from "@/app/entities/StepConfig";
import { create } from "zustand";

interface StepsState {
  steps: Step;
  setSteps: (steps: Step) => void;
  setStepComplete: (key: StepKey) => void;
  setStepInComplete: (key: StepKey) => void;
  resetSteps: () => void;
  firstIncompleteStep: StepKey | null;
  progress: number; 
}

const defaultSteps: Step = {
  connectStrava: false,
  createFundraiser: false,
  setGoals: false,
  hikeTrackShare: false,
};

const getFirstIncomplete = (steps: Step): StepKey | null => {
  const firstStep = stepsConfig.find((step) => !steps[step.key]);
  return firstStep?.key ?? null;
};

const calculateProgress = (steps: Step): number => {
  const completed = Object.values(steps).filter(Boolean).length;
  return (completed / stepsConfig.length) * 100;
};

export const useStepsStore = create<StepsState>((set) => ({
  steps: defaultSteps,
  setSteps: (steps: Step) =>
    set(() => ({
      steps,
      firstIncompleteStep: getFirstIncomplete(steps),
      progress: calculateProgress(steps),
    })),

  firstIncompleteStep: stepsConfig[0].key,
  progress: 0, 

  setStepComplete: (key: StepKey) =>
    set((state) => {
      const updated = { ...state.steps, [key]: true };
      return {
        steps: updated,
        firstIncompleteStep: getFirstIncomplete(updated),
        progress: calculateProgress(updated), 
      };
    }),

  setStepInComplete: (key: StepKey) =>
    set((state) => {
      const updated = { ...state.steps, [key]: false };
      return {
        steps: updated,
        firstIncompleteStep: getFirstIncomplete(updated),
        progress: calculateProgress(updated),
      };
    }),

  resetSteps: () =>
    set(() => ({
      steps: defaultSteps,
      firstIncompleteStep: stepsConfig[0].key,
      progress: 0, 
    })),
}));
