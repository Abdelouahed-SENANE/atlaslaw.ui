import {
  Activity,
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-[#0a0a0b] text-white overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-1/2 px-20 lg:px-8 relative z-10">
        <div className=" text-center mb-16">
          <h2
            className="
                text-5xl
                font-semibold
                tracking-tight
                bg-[linear-gradient(103.97deg,rgba(255,255,255,1)_2.99%,rgba(255,255,255,0.38)_91.33%)]
                bg-clip-text
                text-transparent
                pb-2
                "
          >
            How AtlasLaw works
          </h2>
          <p className="mt-4 text-lg text-card-foreground/50 max-w-lg text-balance mx-auto">
            A simple workflow designed around the way law firms actually
            operate.
          </p>
        </div>

        {/* Steps Grid - Matching Why section card design */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mx-auto mb-32">
          {[
            {
              step: "01",
              title: "Set up your firm workspace",
              description:
                "Create your law firm environment and define users, roles, and permissions in minutes.",
              icon: Users,
            },
            {
              step: "02",
              title: "Manage cases and procedures",
              description:
                "Organize cases, clients, hearings, and documents in one structured and secure dashboard.",
              icon: LayoutDashboard,
            },
            {
              step: "03",
              title: "Track activity and stay in control",
              description:
                "Follow case progress, upcoming hearings, and team activity with full visibility and traceability.",
              icon: Activity,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`
                  group
                  relative
                  rounded-xl
                  border border-white/10
                  bg-white/3
                  backdrop-blur-xl
                  shadow-2xl
                  p-6
                  transition-all
                  hover:border-primary/30
                  hover:shadow-primary/5
                  animate-reveal-up
                  ${["", "delay-100", "delay-200"][idx]}
                  `}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground border border-[#0a0a0b]">
                    {item.step.replace(/^0/, "")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm text-card-foreground/60 leading-relaxed text-balance">
                {item.description}
              </p>

              {/* Subtle accent glow */}
              <div className="absolute -bottom-2 -right-2 h-16 w-16 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Presentation-style Dashboard Preview */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          {/* Floating UI Elements */}
          <div className="absolute -top-12 -left-8 z-20 bg-[#161617]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl animate-bounce-slow hidden lg:flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                Security Status
              </p>
              <p className="text-sm font-semibold text-white">
                Encrypted & Secure
              </p>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-12 z-20 bg-[#161617]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl animate-float hidden lg:flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                Real-time alerts
              </p>
              <p className="text-sm font-semibold text-white">
                3 new hearings scheduled
              </p>
            </div>
          </div>

          <div className="relative group perspective-2000 animate-reveal-up delay-300">
            <div className="relative transition-all duration-1000 transform-gpu group-hover:rotate-x-2 group-hover:-rotate-y-3 group-hover:scale-[1.02] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              {/* Browser Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1c1c1d] border border-white/10 rounded-t-2xl">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-black/30 rounded-full border border-white/5">
                  <LayoutDashboard className="h-3 w-3 text-gray-500" />
                  <span className="text-[10px] text-gray-500 font-medium tracking-tight">
                    app.atlaslaw.io
                  </span>
                </div>
                <div className="w-12"></div>
              </div>

              {/* Dashboard Content */}
              <div className="relative bg-[#0a0a0b] border-x border-b border-white/10 rounded-b-2xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/mocks/real-dashboard-v2.png"
                  alt="AtlasLaw Dashboard Presentation"
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-linear-to-t from-[#0a0a0b] to-transparent pointer-events-none"></div>
              </div>
            </div>

            <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full -z-10 group-hover:bg-primary/20 transition-all duration-1000"></div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
      `,
        }}
      />
    </section>
  );
};
