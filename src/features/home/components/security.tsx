import { History, Lock, Server, Shield } from "lucide-react";

export const SecuritySection = () => {
  const pillars = [
    {
      title: "Firm-level data isolation",
      description:
        "Each law firm operates in a fully separated environment to ensure confidentiality.",
      icon: Shield,
    },
    {
      title: "Role-based access control",
      description:
        "Users only see what they are authorized to access, based on their role.",
      icon: Lock,
    },
    {
      title: "Activity tracking and traceability",
      description:
        "Every important action is logged to maintain accountability and transparency.",
      icon: History,
    },
    {
      title: "Reliability and continuity",
      description:
        "Your data is protected with regular backups and a stable infrastructure.",
      icon: Server,
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-1/2">
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
            Security and trust, by design
          </h2>
          <p className="mt-4 text-lg text-card-foreground/50 max-w-lg text-balance mx-auto">
            Your firm’s data is handled with the care and structure it deserves.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`
                  rounded-md
                  border border-border
                  bg-foreground/2
                  backdrop-blur-lg
                  backdrop-filter
                  shadow-md
                  p-6
                  flex
                  flex-col
                  gap-4
                  animate-reveal-up
                  ${["", "delay-100", "delay-200", "delay-300"][index]}
                  `}
            >
              <pillar.icon className="size-8 text-primary" />
              <div>
                <h3 className="text-md font-medium text-card-foreground text-balance">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-card-foreground/60 text-balance leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
