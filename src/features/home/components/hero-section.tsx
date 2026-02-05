import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative h-screen w-full ">
      <div className="absolute h-180 w-180 top-0 right-100 z-10">
        <img src="/assets/svg/shape.svg" alt="" />
      </div>
      <div className=" z-40 space-y-4 max-w-1/2  mx-auto relative  h-[calc(100vh-var(--header-height))] w-full ">
        <h1 className="pt-30 text-6xl max-w-[900px] text-balance font-semibold tracking-tight leading-tight animate-reveal-up">
          <span
            className="                text-center
                text-6xl
                font-semibold
                tracking-[-0.02em]
                bg-[linear-gradient(103.97deg,rgba(255,255,255,1)_2.99%,rgba(255,255,255,0.38)_91.33%)]
                bg-clip-text
                text-transparent
                pb-[0.13em]"
          >
            A modern platform for legal case management.
          </span>
        </h1>
        <p className="text-lg text-foreground/50  font-medium text-balance max-w-[900px] animate-reveal-up delay-200">
          Designed to help law firms efficiently manage cases, track procedures
          and hearings, and maintain complete visibility across their legal
          operations.
        </p>
        <Button className="rounded-sm py-2 animate-reveal-up delay-300">
          Get Started
        </Button>
      </div>
      <div className="relative max-w-1/2 mx-auto -mt-90 z-50 mb-10 animate-reveal-up delay-500">
        <img
          src="/assets/mocks/test.png"
          alt=""
          className="w-full h-full rlative"
        />
      </div>
    </section>
  );
};
