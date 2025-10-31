import Section from "@/components/Section";

export default function WhySportsMarkers() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">Why SportsMarkers?</h2>
          <p className="mt-4 text-lg text-center text-gray-600">
            Because talent alone isn’t enough. You need the right platform, the right exposure, and the right connections. SportsMarkers gives athletes the tools to:
          </p>
          <ul className="mt-8 space-y-4 max-w-md mx-auto">
            <li className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Get noticed faster</span>
            </li>
            <li className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Build credibility with recruiters</span>
            </li>
            <li className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Track progress and engagement</span>
            </li>
            <li className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Join a community that celebrates effort and achievement</span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
