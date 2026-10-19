import React from "react";
import { ArrowUpRight, Building2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactContent = {
  eyebrow: "Contact KYYP",
  title: "Let's build better transportation operations together.",
  description:
    "Whether you're looking to bring KYYP into your organization, explore a business opportunity, or connect with our team, we'd love to hear from you.",
  contactDetails: [
    {
      icon: Mail,
      label: "Email",
      value: "chinedu.daneil.ernest@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "09129449905",
    },
    {
      icon: Building2,
      label: "Organization",
      value: "KYYP Transportation Management",
    },
    {
      icon: MapPin,
      label: "Based in",
      value: "Nigeria",
    },
  ],
  form: {
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email address",
    companyLabel: "Company / Organization",
    companyPlaceholder: "Enter your company or organization",
    phoneLabel: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    messageLabel: "Your Message",
    messagePlaceholder:
      "Tell us about your company, business inquiry, partnership, or how you'd like to work with KYYP.",
    submitLabel: "Send Inquiry",
  },
  encouragement: {
    title: "Your next conversation could move your operations forward.",
    description:
      "Tell us where your organization is headed, and let's explore what better transportation management could look like for your team.",
  },
  map: {
    title: "KYYP in Nigeria",
    description:
      "Connect with the KYYP team from anywhere in Nigeria.",
    src: "https://www.google.com/maps?q=Nigeria&output=embed",
  },
};

const Contacts: React.FC = () => {
  return (
    <main id="contact">
      <section className="bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {contactContent.eyebrow}
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl xl:text-6xl">
              {contactContent.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {contactContent.description}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div className="flex flex-col gap-6">
              <div className="border border-border bg-text p-6 sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary-light">
                      Get in touch
                    </p>

                    <h2 className="mt-3 max-w-md text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      Start a conversation with KYYP.
                    </h2>
                  </div>

                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center border border-foreground/20 text-foreground sm:flex">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {contactContent.contactDetails.map((detail) => {
                    const Icon = detail.icon;

                    return (
                      <div
                        key={detail.label}
                        className="group flex items-start gap-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/15 bg-foreground/5 text-primary-light transition-colors duration-300 group-hover:bg-primary group-hover:text-foreground">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                            {detail.label}
                          </p>

                          <p className="mt-1 break-words text-sm leading-6 text-foreground sm:text-base">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-hidden border border-border bg-foreground">
                <div className="p-5 sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {contactContent.map.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {contactContent.map.description}
                  </p>
                </div>

                <div className="h-64 w-full sm:h-72 lg:h-80">
                  <iframe
                    src={contactContent.map.src}
                    title="KYYP location in Nigeria"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div className="border border-border bg-foreground p-6 sm:p-8 lg:p-10">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Send an inquiry
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
                  Tell us about your organization.
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                  Share a few details about yourself and your organization,
                  and tell us what you’d like to discuss with KYYP.
                </p>
              </div>

              <form className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-text"
                    >
                      {contactContent.form.nameLabel}
                    </label>

                    <Input
                      id="name"
                      type="text"
                      placeholder={contactContent.form.namePlaceholder}
                      className="mt-2 h-11 border-border bg-background font-sans text-sm text-text shadow-none placeholder:text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-text"
                    >
                      {contactContent.form.emailLabel}
                    </label>

                    <Input
                      id="email"
                      type="email"
                      placeholder={contactContent.form.emailPlaceholder}
                      className="mt-2 h-11 border-border bg-background font-sans text-sm text-text shadow-none placeholder:text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="company"
                      className="text-sm font-medium text-text"
                    >
                      {contactContent.form.companyLabel}
                    </label>

                    <Input
                      id="company"
                      type="text"
                      placeholder={contactContent.form.companyPlaceholder}
                      className="mt-2 h-11 border-border bg-background font-sans text-sm text-text shadow-none placeholder:text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-text"
                    >
                      {contactContent.form.phoneLabel}
                    </label>

                    <Input
                      id="phone"
                      type="tel"
                      placeholder={contactContent.form.phonePlaceholder}
                      className="mt-2 h-11 border-border bg-background font-sans text-sm text-text shadow-none placeholder:text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-text"
                  >
                    {contactContent.form.messageLabel}
                  </label>

                  <Textarea
                    id="message"
                    placeholder={contactContent.form.messagePlaceholder}
                    className="mt-2 min-h-40 resize-none border-border bg-background font-sans text-sm leading-6 text-text shadow-none placeholder:text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </div>

                <Button
                  type="button"
                  className="h-11 w-full bg-primary px-6 font-sans text-sm font-medium text-foreground hover:bg-primary-dark sm:w-auto"
                >
                  {contactContent.form.submitLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-12 border-t border-border pt-8">
                <h3 className="max-w-lg text-xl font-semibold tracking-tight text-text sm:text-2xl">
                  {contactContent.encouragement.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
                  {contactContent.encouragement.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contacts;
