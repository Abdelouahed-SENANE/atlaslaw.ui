import { Footer } from "@/components/ui/footer/footer";
import { Navbar } from "@/components/ui/navbar/navbar";
import { HeroSection } from "@/features/home/components/hero-section";
import { HowItWorks } from "@/features/home/components/how-it-works";
import { SecuritySection } from "@/features/home/components/security";
import { Why } from "@/features/home/components/why";

const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Why />
      <SecuritySection />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default HomePage;
