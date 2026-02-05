import { Calendar, Scale, Shield } from "lucide-react";

export const Why = () => {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-1/2 ">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="
                text-center
                text-5xl
                font-semibold
                tracking-[-0.02em]
                bg-[linear-gradient(103.97deg,rgba(255,255,255,1)_2.99%,rgba(255,255,255,0.38)_91.33%)]
                bg-clip-text
                text-transparent
                pb-[0.13em]
                "
          >
            Why AtlasLaw?
          </h2>
          <p className="mt-4 text-lg text-card-foreground/50 max-w-lg text-balance mx-auto">
            AtlasLaw is built specifically for law firms that need clarity,
            control, and confidence in managing their legal work.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="mt-16 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 px-20">
          <div
            className="
                rounded-md
                border border-border
                bg-foreground/2
                backdrop-blur-lg
                backdrop-filter
                shadow-md
                p-4
                animate-reveal-up delay-100
                "
          >
            <h3 className="flex items-start gap-2 text-md font-medium  text-card-foreground">
              <Scale className="size-8 text-primary" />
              <span className="text-balance">Designed for legal workflows</span>
            </h3>

            <p className="mt-3 text-sm text-card-foreground/60 text-balance">
              Manage cases, procedures, hearings, and clients in one structured
              system made for real law firm operations.
            </p>
          </div>

          <div
            className="
                rounded-md
                border border-border
                bg-foreground/2
                backdrop-blur-lg
                backdrop-filter
                shadow-md
                p-4
                animate-reveal-up delay-200
                "
          >
            <h3 className="flex items-start gap-2 text-md font-medium  text-card-foreground">
              <Calendar className="size-8 text-primary" />
              <span className="text-balance">Never miss a deadline</span>
            </h3>

            <p className="mt-4 text-sm text-card-foreground/60 text-balance">
              Centralized calendars and hearing tracking help your firm stay
              ahead of critical dates.
            </p>
          </div>

          <div
            className="
                rounded-md
                border border-border
                bg-foreground/2
                backdrop-blur-lg
                backdrop-filter
                shadow-md
                p-4
                animate-reveal-up delay-300
                "
          >
            <h3 className="flex items-start gap-2 text-md font-medium  text-card-foreground">
              <Shield className="size-8 text-primary" />
              <span className="text-balance"> Secure by default</span>
            </h3>

            <p className="mt-4 text-sm text-card-foreground/60 text-balance">
              Your firm’s data is isolated, protected, and accessible only to
              authorized users.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
