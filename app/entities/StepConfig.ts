export const stepsConfig = [
    { key: "connectStrava", label: "Connect your Strava account", icon: "🔗" },
    { key: "setGoals", label: "Set Goals for your project", icon: "🎯" },
    { key: "createFundraiser", label: "Create Fundraiser", icon: "💰" },
    { key: "hikeTrackShare", label: "Hike & Track & Share", icon: "🥾" },
  ] as const;
  
  export type StepKey = typeof stepsConfig[number]["key"];