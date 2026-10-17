import React from "react";
import { Gauge, Route, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

const heroContent = {
  title: "Smart Transportation Management, Built for Better Operations",
  description:
    "Manage your fleet, routes, drivers, and transportation operations from one powerful platform.",
};

const operationsSection = {
  eyebrow: "Built for Better Transportation",
  title: "Everything you need to keep transportation moving",
  description:
    "KYYP gives transportation teams the tools they need to manage daily operations with speed, reliability, security, and complete visibility.",
  features: [
    {
      icon: Gauge,
      title: "Fast & Reliable",
      description:
        "Keep transportation operations moving with fast access to the information your team needs.",
    },
    {
      icon: Route,
      title: "Smarter Route Management",
      description:
        "Plan, organize, and manage routes efficiently while keeping every trip under control.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Operations",
      description:
        "Protect your transportation data with structured access, roles, and permissions across your organization.",
    },
    {
      icon: Truck,
      title: "Fleet Visibility",
      description:
        "Stay informed about your vehicles, drivers, and transportation activities from one central platform.",
    },
  ],
};

const trustedCompaniesSection = {
  eyebrow: "Built for Transportation",
  title: "Designed for teams that keep the world moving",
  description:
    "From fleet operators and logistics providers to delivery and transportation companies, KYYP is built around the realities of modern transportation operations.",
  companies: [
    {
      name: "ZINA Transport",
      logo: "/images/zina.jpg",
    },
    {
      name: "DHL",
      logo: "/images/dhl.jpg",
    },
    {
      name: "Red Star Express",
      logo: "/images/express.jpg",
    },
    {
      name: "Gig Logistics",
      logo: "/images/gigi.jpg",
    },
    {
      name: "Cargo",
      logo: "/images/cargo.jpg",
    },
    {
      name: "CAG Logistics",
      logo: "/images/cag.jpg",
    },
    {
      name: "ARI Transport",
      logo: "/images/ari.jpg",
    },
    {
      name: "ABC Transport",
      logo: "/images/abc.jpg",
    },
  ],
};

const Home: React.FC = () => {
  const companySet = trustedCompaniesSection.companies.slice(0, 4);

  return (
    <main>
      <section className="relative flex min-h-screen items-center bg-[url('/images/truck1.jpg')] bg-cover bg-center bg-no-repeat px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="absolute inset-0 bg-text/55" />

        <div className="relative z-10 w-full max-w-xl text-left lg:max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {heroContent.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-foreground/90 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            {heroContent.description}
          </p>
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {operationsSection.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
              {operationsSection.title}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {operationsSection.description}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {operationsSection.features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="border border-border bg-foreground p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-text">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
  <div className="mx-auto w-full max-w-7xl">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        {trustedCompaniesSection.eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
        {trustedCompaniesSection.title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {trustedCompaniesSection.description}
      </p>
    </div>

    <div className="mt-12 w-full overflow-hidden sm:mt-16">
      <div className="flex w-max animate-logo-marquee">
        {[0, 1].map((set) => (
          <div
            key={set}
            className="flex items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
          >
            {companySet.map((company, index) => (
              <div
                key={`${company.name}-${set}-${index}`}
                className="flex h-28 w-40 shrink-0 items-center justify-center border border-border bg-foreground px-5 sm:h-32 sm:w-48"
              >
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={200}
                  height={100}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
    </main>
  );
};

export default Home;