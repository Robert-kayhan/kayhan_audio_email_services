"use client";
import { useGetmeQuery } from "@/store/api/userApiSlice";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetmeQuery({});

  // You can optionally show loading or pass user via context
  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}
