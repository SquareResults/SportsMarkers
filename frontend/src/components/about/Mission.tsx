import Image from "next/image";
import Section from "@/components/Section";

export default function Mission() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-600">
                To level the playing field in sports recruitment—giving every athlete a fair shot at being seen, signed, and celebrated.
              </p>
            </div>
            <div>
              <Image
                src="/images/Football.jpg"
                alt="Athlete in motion"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
