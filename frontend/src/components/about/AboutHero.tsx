// src/components/about/AboutHero.tsx
'use client';

import Link from 'next/link';

export default function AboutHero() {
  return (
    <section
      aria-label="About SportsMarker"
      className="relative w-screen h-[86vh] min-h-[620px] overflow-hidden"
      style={{
        // full-bleed edge-to-edge even if the page uses a centered container
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        // tuck under sticky header (h-16 = 64px). Adjust if your header is taller.
        marginTop: '-64px',
      }}
    >
      {/* Background image (optional) — swap src if you prefer a photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/about/intro-1.jpg)' }}
      />

      {/* Gradient overlay (navy → teal) and a soft dim layer.
          pointer-events-none so arrows/links on top stay clickable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#123256]/70 via-[#0F2A48]/40 to-[#0e5f4f]/60" />
      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      {/* Giant watermark “SM” behind the copy */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="select-none font-extrabold leading-none text-white/10 tracking-tighter text-[16vw] md:text-[14vw]">
          SM
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-extrabold leading-[1.05] drop-shadow md:text-6xl text-5xl lg:text-7xl">
          <span className="block text-[#9BE870]">Where Talent</span>
          <span className="block text-[#72D66A]">Meets</span>
          <span className="block text-[#9BE870]">Opportunity.</span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/create"
            className="inline-flex items-center rounded-full px-6 py-3 text-base font-semibold text-white shadow-md
                       bg-gradient-to-b from-[#32D071] to-[#20B85E] hover:opacity-95 transition"
          >
            Create Your Portfolio →
          </Link>

          <Link
            href="/athletes"
            className="inline-flex items-center rounded-full px-6 py-3 text-base font-semibold text-white
                       border border-white/70 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
          >
            Browse Athletes
          </Link>
        </div>
      </div>
    </section>
  );
}
