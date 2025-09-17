export const goalMeasureConfig = [
    { key: "km", description: "Distance (km) = €", singular: "kilometer", singular_detail: "kilometer I hike", icon: "↔️" },
    { key: "m", description: "Elevation gain (m) = €", singular: "meter", singular_detail: "meter I climb", icon: "📈" },
    { key: "h", description: "Hike Time (h) = €", singular: "hour", singular_detail: "hour I spend hiking" , icon: "⏱️" },
  ] as const;


export type GoalMeasureKey = typeof goalMeasureConfig[number]["key"];
export type GoalMeasure = typeof goalMeasureConfig[number];


export const goalMeasureKeys: GoalMeasureKey[] = goalMeasureConfig.map(item => item.key);

// build a lookup object for fast access
const goalMeasureMap: Record<GoalMeasureKey, GoalMeasure> = goalMeasureConfig.reduce(
    (acc, item) => {
      acc[item.key] = item;
      return acc;
    },
    {} as Record<GoalMeasureKey, GoalMeasure>
  );
  
  // helper method
export function getGoalMeasure(key: GoalMeasureKey): GoalMeasure {
    return goalMeasureMap[key];
  }