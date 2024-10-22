import Image from "next/image";
import { Inter } from "next/font/google";
import client from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import BasicArea from "@/app/components/TestChart";
import { MapComponent } from "@/app/components/MapComponent";
import { PerformanceComponent } from "@/app/components/PerformanceComponent";

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
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Image
        src="/logo.png"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
      <Image
        src="/logo.png"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
      />
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
      <PerformanceComponent title="totalDistance" quantity={100}/>
      <MapComponent />
      <BasicArea />
    </main>
  );
}
