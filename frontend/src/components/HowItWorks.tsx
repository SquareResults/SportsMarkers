'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/Section";
import { Check, DollarSign, FileText, Search, Star } from "lucide-react";

const steps = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Fill the Form",
    description: "Provide your athletic and personal details through our easy-to-use form.",
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Payment",
    description: "A one-time payment for our team to create your professional portfolio.",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Team Review",
    description: "Our experts review your information to highlight your strengths.",
  },
  {
    icon: <Check className="h-6 w-6" />,
    title: "Feedback",
    description: "We provide feedback and work with you to ensure your portfolio is perfect.",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Create the Portfolio",
    description: "Your professional portfolio is created and ready to be shared with recruiters.",
  },
];

export default function HowItWorks() {
  return (
    <Section>
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-slate-600">
              A simple, transparent process from form to finished portfolio.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line on md+ */}
            <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-blue-200 via-slate-200 to-emerald-200 md:block" />

            <div className="space-y-10">
              {steps.map((step, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className="relative md:grid md:grid-cols-2 md:items-center md:gap-10"
                  >
                    {/* Step marker (number dot) */}
                    <div className="pointer-events-none absolute left-1/2 top-1 md:top-1/2 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 md:flex">
                      <span className="text-sm font-semibold text-slate-700">
                        {index + 1}
                      </span>
                    </div>

                    {/* Card (alternating) */}
                    <div
                      className={[
                        "md:col-span-1",
                        isLeft ? "md:pr-14" : "md:col-start-2 md:pl-14",
                      ].join(" ")}
                    >
                      <Card className="group rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.07)] ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-b from-emerald-400 to-green-600 text-white shadow-md ring-1 ring-emerald-500/30">
                              {step.icon}
                            </div>
                            <CardTitle className="text-xl font-bold">
                              {step.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile markers line (left edge) */}
            <div className="mt-8 block md:hidden">
              {/* Optional: subtle separator to hint progression on mobile */}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
