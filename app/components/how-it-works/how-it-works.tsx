import React from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Route,
  ShieldCheck,
  Users,
  Truck,
} from "lucide-react";

const howItWorksContent = {
  eyebrow: "How It Works",
  title: "From setup to daily operations, KYYP keeps everything connected.",
  description:
    "See how KYYP takes your team from getting started to managing everyday transportation operations, step by step.",
  steps: [
    {
      number: "01",
      icon: Users,
      title: "Create your account",
      description:
        "Start by creating your KYYP account and signing in to get started.",
      detail: "Sign up and get started",
    },
    {
      number: "02",
      icon: Building2,
      title: "Set up your organization",
      description:
        "Create your organization and establish the foundation for your transportation operations.",
      detail: "Build your organization",
    },
    {
      number: "03",
      icon: Users,
      title: "Invite your team",
      description:
        "Bring your team into the organization by inviting the people who manage your operations.",
      detail: "Invite your members",
    },
    {
      number: "04",
      icon: ShieldCheck,
      title: "Assign roles and permissions",
      description:
        "Give each team member the right access based on their responsibilities.",
      detail: "Control team access",
    },
    {
      number: "05",
      icon: Truck,
      title: "Set up your fleet",
      description:
        "Add your vehicles and keep important fleet information organized in one place.",
      detail: "Manage your vehicles",
    },
    {
      number: "06",
      icon: Route,
      title: "Organize routes and trips",
      description:
        "Plan and manage the routes and trips your transportation team handles every day.",
      detail: "Manage your routes",
    },
    {
      number: "07",
      icon: ClipboardList,
      title: "Manage your operations",
      description:
        "Keep your transportation activities, records, and daily work organized.",
      detail: "Keep work organized",
    },
    {
      number: "08",
      icon: LayoutDashboard,
      title: "Run everything from your dashboard",
      description:
        "Bring your transportation information together and stay in control of daily operations.",
      detail: "Stay in control",
    },
  ],
};

const Howitworks: React.FC = () => {
  return (
    <main id="how-it-works">
      <section className="bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {howItWorksContent.eyebrow}
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
              {howItWorksContent.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {howItWorksContent.description}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-4 lg:gap-5">
            {howItWorksContent.steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group border border-border bg-foreground p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-foreground">
                      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <span className="font-sans text-sm font-semibold text-muted transition-colors duration-300 group-hover:text-primary">
                      {step.number}
                    </span>
                  </div>

                  <h2 className="mt-6 text-lg font-semibold tracking-tight text-text transition-colors duration-300 group-hover:text-primary sm:text-xl">
                    {step.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {step.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                    <span>{step.detail}</span>

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Everything stays connected as your operations grow.</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Howitworks;