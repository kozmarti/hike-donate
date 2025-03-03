import Image from "next/image";
import { Inter } from "next/font/google";
import client from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import BasicArea from "@/app/components/TestChart";
import { MapComponent } from "@/app/components/MapComponent";
import { PerformanceItemComponent } from "@/app/components/PerformanceItemComponent";

type ConnectionStatus = {
  isConnected: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await client.connect(); // `await client.connect()` will use the default database passed in the MONGODB_URI
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 global-background ${inter.className}`}
    >
       <Image
        src="/logo.png"
        alt="Vercel Logo"
        width={200}
        height={48}
        priority
      />
      <p>Would you sponsor one kilometer of my fundraising hike? 
      </p>
      <p>I am embarking on an exciting journey. The goal is simple: for every kilometer I trek, I aim to raise an equal number of euros for [Association] to [support …]. 
Whether I walk 10 kilometers or 100, every euro raised will go toward transforming lives and providing much-needed support.
</p>
<p>How far do you think I will make it ?</p>

     
      {isConnected ? (
        <h2 className="text-lg text-green-500">
          You are connected to MongoDB!
        </h2>
      ) : (
        <h2 className="text-lg text-red-500">
          You are NOT connected to MongoDB. Check the <code>README.md</code> for
          instructions.
        </h2>
      )}
      <PerformanceItemComponent title="totalDistance" quantity={100}/>
      <PerformanceItemComponent title="totalElevationGain" quantity={100}/>
      <PerformanceItemComponent title="totalElevationLoss" quantity={100}/>
      <PerformanceItemComponent title="minAltitude" quantity={100}/>

      <PerformanceItemComponent title="maxAltitude" quantity={100}/>
      <PerformanceItemComponent title="timeElapsed" quantity={100}/>



      <MapComponent />
      <BasicArea />
    </main>
  );
}
