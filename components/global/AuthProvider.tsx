// app/providers/AuthClient.tsx
"use client";
import { useGetmeQuery } from "@/store/api/AuthApi";

export default function AuthClient({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetmeQuery({});

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}
