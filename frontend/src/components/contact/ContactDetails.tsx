import Link from "next/link";

export default function ContactDetails() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold">Contact Details</h2>

      <div className="mt-6 space-y-4">
        <DetailItem
          title="Email"
          value="contact@squareresults.com"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          }
        />

        <DetailItem
          title="Phone"
          value="(602) 418-6255"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.45l.57 2.02a2 2 0 01-.5 1.96L8.1 10.9a16 16 0 006 6l2.46-1.18a2 2 0 011.96.5l2.02.57A2 2 0 0121 19.72V22a2 2 0 01-2 2h-1C9.163 24 0 14.837 0 3V2a2 2 0 012-2h1z" />
            </svg>
          }
        />

        <DetailItem
          title="Partnerships"
          value="squareresults.wps@gmail.com"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-5-3.87M7 20H2v-2a4 4 0 015-3.87m5-8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          }
        />

        <DetailItem
          title="Address"
          value="SportsMarkers HQ, 410 N Scottsdale Rd, Tempe, AZ 85288"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 5.25-7.5 10.5-7.5 10.5S4.5 15.75 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          }
        />
      </div>

      <div className="mt-6">
        <Link
          href="https://www.linkedin.com"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-700" />
          LinkedIn
        </Link>
      </div>

      <div className="mt-6">
        <iframe
          className="w-full h-[340px] rounded-xl border border-slate-200"
          src="https://www.google.com/maps?q=410%20N%20Scottsdale%20Rd%2C%20Tempe%2C%20AZ-85288&output=embed"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </aside>
  );
}

function DetailItem({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-slate-600 text-sm">{value}</p>
      </div>
    </div>
  );
}
