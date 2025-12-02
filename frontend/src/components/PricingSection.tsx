'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Section from '@/components/Section';
import { useSupabase } from '@/components/SupabaseProvider';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

export default function PricingSection() {
  const supabase = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) =>
        setIsLoggedIn(!!s)
      );
      unsub = () => subscription.unsubscribe();
    })();

    return () => { unsub?.(); };
  }, [supabase]);

  return (
    <Section>
      {/* subtle gradient background to make the card pop */}
      <div className="relative py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />

        <div className="container relative mx-auto px-4">
          <Card className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
            {/* Header */}
            <CardHeader className="space-y-6 p-8 pb-4 text-center sm:p-10 sm:pb-6">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                <Sparkles className="h-4 w-4" />
                One-Time Portfolio Setup
              </div>

              <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">
                Everything you need to launch a recruiter-ready profile
              </h2>

              {/* Price */}
              <div className="flex items-end justify-center gap-2">
                <span className="translate-y-2 text-3xl font-bold text-blue-500/90">$</span>
                <span className="text-7xl font-extrabold leading-none text-blue-600 sm:text-8xl">
                  199
                </span>
                <span className="pb-3 text-lg text-blue-500/80">USD</span>
              </div>

              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                No subscription, no hidden fees. Includes setup, media upload, and a recruiter-ready layout with a 14-day tweak guarantee.
              </p>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-6 pb-2 sm:px-10">
              <ul className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
                {[
                  'Highlights & stats pages',
                  'Mobile-first & fast',
                  'Shareable link & QR code',
                  'Trust checks ready',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl bg-blue-50/40 p-3 ring-1 ring-inset ring-blue-100">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure & private. We only use your media for your portfolio.</span>
              </div>
            </CardContent>

            {/* CTA */}
            <CardFooter className="px-6 pb-8 pt-2 sm:px-10">
              <Button
                asChild
                size="lg"
                className="mx-auto w-full max-w-md rounded-full bg-gradient-to-b from-[#32D071] to-[#20B85E] text-white shadow-md hover:opacity-95"
              >
                <Link href={isLoggedIn ? '/create' : '/login'}>
                  {isLoggedIn ? 'Create Your Portfolio' : 'Get Started — $299'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Section>
  );
}
