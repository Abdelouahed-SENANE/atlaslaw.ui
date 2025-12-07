import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate();

  console.log(
    "%c🔁 Redirect() invoked → " + to,
    "color:#ff9800; font-weight:bold"
  );

  useEffect(() => {
    console.log(
      "%c🔁 navigate() executing → " + to,
      "color:#ff5722; font-weight:bold"
    );
    navigate(to, { replace: true });
  }, [to, navigate]);

  return null;
};
