'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/Section";
import { Separator } from "@/components/ui/separator";
import { Check, DollarSign, FileText, Search, Star } from "lucide-react";

const steps = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Fill the Form",
    description: "Provide your athletic and personal details through our easy-to-use form.",
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Payment",
    description: "A one-time payment for our team to create your professional portfolio.",
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Team Review",
    description: "Our experts review your information to highlight your strengths.",
  },
  {
    icon: <Check className="h-8 w-8" />,
    title: "Feedback",
    description: "We provide feedback and work with you to ensure your portfolio is perfect.",
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "Create the Portfolio",
    description: "Your professional portfolio is created and ready to be shared with recruiters.",
  },
];

export default function HowItWorks() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-12">
            How It Works
          </h2>
          <div className="relative">
            <Separator orientation="vertical" className="absolute left-1/2 top-0 h-full w-0.5" />
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-8">
                  <div className="w-1/2 flex justify-end">
                    {index % 2 === 0 && (
                      <Card className="w-full max-w-md">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-500 text-white rounded-full p-3">
                              {step.icon}
                            </div>
                            <CardTitle>{step.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{step.description}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <div className="w-1/2 flex justify-start">
                    {index % 2 !== 0 && (
                      <Card className="w-full max-w-md">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-500 text-white rounded-full p-3">
                              {step.icon}
                            </div>
                            <CardTitle>{step.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{step.description}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}