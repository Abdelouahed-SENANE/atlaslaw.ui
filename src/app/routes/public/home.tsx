import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/use-toast";

const HomePage: React.FC = () => {
  return (
    <div>
      Home Page
      <Button onClick={() => toast({ title: "Test" , type: "success" })}>Test</Button>
    </div>
  );
};
export default HomePage;
