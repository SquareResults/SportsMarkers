import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Section from "@/components/Section";

const faqs = [
  {
    question: "What is SportsMarker?",
    answer:
      "SportsMarker is a platform that helps athletes create professional digital portfolios to showcase their skills, achievements, and stats to recruiters and coaches.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We offer a one-time portfolio setup for $299. This includes design, setup, media upload, and a recruiter-ready layout. There are no subscription fees.",
  },
  {
    question: "What do I get with my portfolio?",
    answer:
      "You get a shareable link to your portfolio, which includes pages for your bio, stats, highlights, and more. It's mobile-first, fast, and includes a QR code for easy sharing.",
  },
  {
    question: "How long does it take to create my portfolio?",
    answer:
      "After you submit your information, our team will review it and create your portfolio. The process usually takes 5-7 business days.",
  },
];

export default function Faq() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full md:w-2/3 mx-auto mt-12"
          >
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Section>
  );
}
