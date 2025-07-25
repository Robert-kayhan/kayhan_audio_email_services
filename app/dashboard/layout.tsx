// app/layout.tsx
import type { Metadata } from "next";
import Navigation from "@/components/layout/Sidebar";
import AuthClient from "@/components/global/AuthProvider"; // ✅ this is the correct client-side wrapper

export const metadata: Metadata = {
  title: "Mailer kayhan audio",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <AuthClient>
          <div className="pl-0 md:pl-[5rem]">{children}</div>
        </AuthClient>
      </body>
    </html>
  );
}
