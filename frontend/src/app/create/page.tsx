// src/app/page.tsx

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 py-16 flex items-center justify-center">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome to SportsMarker
        </h1>
        <p className="mt-4 text-slate-600">
          Build athlete portfolios, showcase achievements, and connect with opportunities.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/creation_form"
            className="inline-flex items-center rounded-full px-5 py-2 text-white font-semibold shadow-md bg-gradient-to-b from-[#32D071] to-[#20B85E] hover:opacity-95 transition"
          >
            Create Portfolio
          </a>
          <a
            href="/about"
            className="inline-flex items-center rounded-full px-5 py-2 font-semibold border border-slate-300 hover:bg-slate-50 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}
