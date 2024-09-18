import { getActivities } from "@/lib/strava";

export const getStaticProps = async () => {
  const activities = await getActivities();
  return {
    props: {
      activities,
    },
    revalidate: 3600,
  };
};
