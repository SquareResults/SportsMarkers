import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Section from "@/components/Section";

const faqs = [
  { question: "What is SportsMarkers?", answer: "SportsMarkers is a platform that helps athletes create professional digital portfolios to showcase their skills, achievements, and stats to recruiters and coaches." },
  { question: "How much does it cost?", answer: "We offer a one-time portfolio setup for $299. This includes design, setup, media upload, and a recruiter-ready layout. There are no subscription fees." },
  { question: "What do I get with my portfolio?", answer: "You get a shareable link to your portfolio, which includes pages for your bio, stats, highlights, and more. It's mobile-first, fast, and includes a QR code for easy sharing." },
  { question: "How long does it take to create my portfolio?", answer: "After you submit your information, our team will review it and create your portfolio. The process usually takes 5–7 business days." },
];

export default function Faq() {
  return (
    <Section>
      <div className="py-14 sm:py-18 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-600">
              Everything you need to know about getting your athlete portfolio live.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="mx-auto mt-10 w-full max-w-3xl space-y-4"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors"
              >
                {/* Hide any default chevron/svg that AccordionTrigger might render */}
                <AccordionTrigger
                  className="px-5 py-4 text-left text-base font-semibold sm:text-lg hover:no-underline [&>svg]:hidden"
                >
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5 pt-0 text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Subtle divider glow (light only) */}
          <div className="pointer-events-none mx-auto mt-12 h-10 max-w-4xl rounded-full bg-gradient-to-r from-transparent via-slate-200 to-transparent blur-2xl" />
        </div>
      </div>
    </Section>
  );
}
