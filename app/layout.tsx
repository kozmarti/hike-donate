import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "@/styles/globals.css";

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
    <html lang="en">
      <body className={inter.className}>{children}
      <Analytics />
      </body>
    </html>
  );
}
