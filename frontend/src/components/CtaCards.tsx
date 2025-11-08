'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import { useSupabase } from '@/components/SupabaseProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, FolderOpen, Construction } from 'lucide-react';

export default function CtaCards() {
  const supabase = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    run();
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
    });
    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const cards = [
    {
      href: isLoggedIn ? '/create' : '/login',
      title: 'Build Portfolio',
      desc: 'Create and showcase your athletic achievements.',
      icon: Construction,
      aria: isLoggedIn ? 'Go to create portfolio' : 'Login to start your portfolio',
    },
    {
      href: '/athletes',
      title: 'View Portfolios',
      desc: 'Browse athletes by sport, position, year, and location.',
      icon: FolderOpen,
      aria: 'Browse athlete portfolios',
    },
    {
      href: '/contact',
      title: 'Contact Us',
      desc: 'Questions or partnerships? We’d love to hear from you.',
      icon: Mail,
      aria: 'Contact the SportsMarkers team',
    },
  ];

  return (
    <Section>
      <div className="relative py-12 sm:py-16 lg:py-20">
        {/* soft backdrop */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-10 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {cards.map(({ href, title, desc, icon: Icon, aria }) => (
              <Link key={title} href={href} aria-label={aria} className="group block focus:outline-none">
                <Card
                  className="rounded-2xl border-slate-200 bg-white/80 shadow-sm backdrop-blur transition
                             hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5
                             focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:border-slate-800
                             dark:bg-slate-900/70"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200
                                 bg-slate-50 text-slate-700 transition group-hover:border-emerald-200
                                 group-hover:bg-emerald-50 group-hover:text-emerald-700
                                 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300
                                 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400"
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-slate-600 dark:text-slate-300">{desc}</p>

                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700
                                    opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
