import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "@/styles/globals.css";
import Image from "next/image";

const inter = Fredoka({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hike&Donate",
  description: "Track my fundraising hike where every kilometer counts. Follow the journey, view progress, and support the cause.",
  icons: '/favicon.png',
  openGraph: {
    title: "Hike&Donate",
    description: "Track my fundraising hike where every kilometer counts. Follow the journey, view progress, and support the cause.",
    images: [
      {
        url: '/preview-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hike&Donate Fundraising Preview',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

            <main
              className={`flex min-h-screen flex-col items-center p-2 global-background ${inter.className}`}
            >
              <Image
                src="/logo.png"
                alt="Hike&Donate Logo"
                width={200}
                height={200}
                priority
                style={{zIndex: "1000"}}

              />

        {children}

            </main>

  );
}
