import Link from "next/link";
import * as React from "react";

/** --- Filled SVG icons (no external deps) --- */

const PhoneSolid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M2.25 3.75A1.5 1.5 0 013.75 2.25h3A1.5 1.5 0 018.25 3.7l.39 2.6a2 2 0 01-.5 1.63l-1.3 1.46a14 14 0 006.37 6.37l1.46-1.3a2 2 0 011.63-.5l2.6.39a1.5 1.5 0 011.45 1.5v3a1.5 1.5 0 01-1.5 1.5H18a16.5 16.5 0 01-15.75-15.75v-3Z" />
  </svg>
);

const UsersSolid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M7.5 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0ZM1.5 19.5a6 6 0 0112 0v.75H1.5V19.5ZM16.09 10.5a3.38 3.38 0 100-6.75 3.38 3.38 0 000 6.75ZM15 12.75a6 6 0 016 6v1.5h-4.5V19.5a7.46 7.46 0 00-1.5-4.5V12.75Z" />
  </svg>
);

const MapPinSolid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.25a7.5 7.5 0 00-7.5 7.5c0 5.25 7.5 12 7.5 12s7.5-6.75 7.5-12A7.5 7.5 0 0012 2.25Zm0 10.125a3.375 3.375 0 110-6.75 3.375 3.375 0 010 6.75Z" />
  </svg>
);

/** --- Color helper for icon badges --- */
const badgeColors = {
  blue: "bg-blue-600 ring-blue-600/20",
  emerald: "bg-emerald-600 ring-emerald-600/20",
  purple: "bg-purple-600 ring-purple-600/20",
  rose: "bg-rose-600 ring-rose-600/20",
};

function DetailItem({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
  color?: keyof typeof badgeColors;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-4 ${badgeColors[color]}`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{value}</p>
      </div>
    </div>
  );
}

export default function ContactDetails() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold">Contact Details</h2>

      <div className="mt-6 space-y-5">
        <DetailItem
          title="Phone"
          value="(602) 418-6255"
          color="emerald"
          icon={<PhoneSolid className="h-5 w-5" />}
        />

        <DetailItem
          title="Partnerships"
          value="squareresults.wps@gmail.com"
          color="purple"
          icon={<UsersSolid className="h-5 w-5" />}
        />

        <DetailItem
          title="Address"
          value="SportsMarkers HQ, 410 N Scottsdale Rd, Tempe, AZ 85288"
          color="rose"
          icon={<MapPinSolid className="h-5 w-5" />}
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
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </aside>
  );
}
