import React from "react";

type Props = {
  show?: boolean;
  message?: string;
};

export default function FullPageLoader({ show = true, message }: Props) {
  if (!show) return null;

  return (
    <div
      aria-live="polite"
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-white animate-spin" />
        {message && (
          <p className="text-sm text-white/90 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
