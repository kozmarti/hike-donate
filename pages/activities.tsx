import { getActivities } from "@/lib/strava";

const Activities: React.FC<any> = ({ activities }) => {
  return (
      <div>
          {activities}
      </div>
  );
};


export default Activities;

export const getStaticProps = async () => {
  const activities = await getActivities();
  return {
    props: {
      activities,
    },
    revalidate: 3600,
  };
};
