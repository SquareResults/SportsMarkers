import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactDetails />
        </div>
      </div>
    </div>
  );
}
