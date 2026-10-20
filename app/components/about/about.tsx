import React from "react";
import Image from "next/image";

const aboutContent = {
  eyebrow: "About KYYP",
  title: "Built to make transportation operations easier to manage.",
  description:
    "KYYP is a transportation management platform designed to help teams organize their fleets, routes, drivers, records, and daily operations from one place.",
  supportingText:
    "We bring the essential parts of transportation management together so teams can work with greater clarity, control, and efficiency.",
  image: {
    src: "/images/track.jpg",
    alt: "Transportation fleet operations",
  },
};

const storyContent = {
  eyebrow: "Why KYYP",
  title: "Transportation operations should not be harder than they need to be.",
  paragraphs: [
    "Managing transportation involves more than moving vehicles from one place to another. Teams have to coordinate fleets, drivers, routes, records, schedules, and day-to-day activities while keeping everyone aligned.",
    "KYYP brings these essential operations together in one organized platform, giving transportation teams a clearer way to manage their work and stay in control as their operations grow.",
  ],
  points: [
    "Keep transportation information organized",
    "Manage fleets, routes, and drivers from one place",
    "Give teams clearer operational visibility",
  ],
};

const About: React.FC = () => {
  return (
    <main id="about">
      <section className="bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {aboutContent.eyebrow}
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl xl:text-6xl">
              {aboutContent.title}
            </h1>

            <p className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {aboutContent.description}
            </p>

            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {aboutContent.supportingText}
            </p>
          </div>

          <div className="relative w-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={aboutContent.image.src}
                alt={aboutContent.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {storyContent.eyebrow}
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
              {storyContent.title}
            </h2>
          </div>

          <div>
            <div className="space-y-5">
              {storyContent.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 text-muted sm:text-lg sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <div className="grid gap-5 sm:grid-cols-3">
                {storyContent.points.map((point, index) => (
                  <div key={point} className="border-l-2 border-primary pl-4">
                    <span className="text-sm font-semibold text-primary">
                      0{index + 1}
                    </span>

                    <p className="mt-2 text-sm font-medium leading-6 text-text">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
