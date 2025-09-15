type UserSteps = {
    connectStrava?: boolean;
    createFundraiser?: boolean;
    setGoals?: boolean;
    hikeTrackShare?: boolean;
  };
  
  export function areAllStepsComplete(steps: UserSteps): boolean {
    return (
      steps.connectStrava === true &&
      steps.createFundraiser === true &&
      steps.setGoals === true &&
      steps.hikeTrackShare === true
    );
  }