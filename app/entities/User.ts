import { GoalMeasureKey } from "./GoalMeasureConfig";
import { Step } from "./StepConfig";

export interface User {
    email: string;
    stravaUserId: string;
    stravaClientId: string;
    stravaClientSecret: string;
    projectName: string;
    goalMeasure: GoalMeasureKey;
    fundraiserUrl: string;
    fundraiserDescription: string;
    isActive?: boolean | null;
    steps: Step
    name: string
}