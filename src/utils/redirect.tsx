import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [to , navigate]);   // <-- important: depends on "to"

  return null;
};
