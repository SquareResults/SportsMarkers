'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Section from "@/components/Section";
import { useSupabase } from '@/components/SupabaseProvider';
import { CheckIcon } from 'lucide-react';

export default function PricingSection() {
  const supabase = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">One-Time Portfolio Setup</h2>
              <p className="text-7xl font-bold text-blue-500 mt-4">$299</p>
              <p className="mt-2 text-lg text-gray-600">No subscription, no hidden fees.</p>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-gray-600 text-center mb-8">
                Includes design, setup, media upload, and a recruiter-ready layout. 14-day tweak guarantee.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <CheckIcon className="h-6 w-6 text-blue-500" />
                  <span className="text-lg">Highlights & stats pages</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckIcon className="h-6 w-6 text-blue-500" />
                  <span className="text-lg">Mobile-first & fast</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckIcon className="h-6 w-6 text-blue-500" />
                  <span className="text-lg">Shareable link & QR code</span>
                </li>
                <li className="flex items-center gap-4">
                  <CheckIcon className="h-6 w-6 text-blue-500" />
                  <span className="text-lg">Trust checks ready</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild size="lg" className="w-full">
                <Link href={isLoggedIn ? "/create" : "/login"}>Create Your Portfolio</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Section>
  );
}
