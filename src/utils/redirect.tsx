import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";

export const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  console.warn("[Redirect] to:", to);
  useLayoutEffect(() => {
    const id = setTimeout(() => {
      navigate(to, { replace: true });
    }, 0);

    return () => clearTimeout(id);
  }, [to]);

  return null;
};
