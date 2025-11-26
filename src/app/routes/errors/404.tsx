import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <h1 className="text-6xl font-bold text-primary">404</h1>

      <p className="text-lg text-muted-foreground max-w-md">
        The page you are looking for could not be found.
      </p>

      <Button className="bg-red-700 hover:bg-red-800 font-bold" onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}
