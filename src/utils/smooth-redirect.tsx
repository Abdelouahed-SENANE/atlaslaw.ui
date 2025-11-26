import { useEffect } from "react";

export const Redirect = ({ to }: { to: string }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.assign(to); // smoother than href
    }, 600);

    return () => clearTimeout(timeout);
  }, [to]);

  return (
    <div className="flex h-screen w-screen items-center justify-center animate-fade">
      <span className="text-sm font-bold text-gray-500">Redirecting…</span>
    </div>
  );
};
