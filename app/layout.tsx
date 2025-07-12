import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "@/styles/globals.css";

const inter = Fredoka({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hike&Donate",
  description: "Track my fundraising hike where every kilometer helps raise donations for Ukraine. Follow the journey, view progress, and support the cause.",
  icons: '/favicon.png',
  openGraph: {
    title: "Hike&Donate",
    description: "Track my fundraising hike where every kilometer helps raise donations for Ukraine. Follow the journey, view progress, and support the cause.",
    images: [
      {
        url: '/bg-1.jpg',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
