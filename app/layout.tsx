import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "@/styles/globals.css";

const inter = Fredoka({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hike&Donate",
  description: "Hike&Donate logo",
  icons: '/favicon.png',
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
