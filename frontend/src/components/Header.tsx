"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/SupabaseProvider";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  // keep layout height on SSR to avoid hydration mismatch
  if (typeof window === "undefined") {
    return <div style={{ height: 64 }} />; // h-16
  }

  const supabase = useSupabase();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
    };
    run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/athletes", label: "Portfolios" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // --- Auth button active styles ---
  const onLogin = pathname.startsWith("/login");
  const onSignup = pathname.startsWith("/signup");
  const showingAuthPage = onLogin || onSignup;

  const pillBase = "h-11 px-6 rounded-full font-semibold transition";
  const pillActive =
    pillBase +
    " text-white shadow-lg bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-500 hover:to-green-700";
  const pillOutline =
    pillBase +
    " border border-emerald-500 text-emerald-700 hover:bg-emerald-50";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:h-20 sm:px-6">
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SportsMarkers"
            width={36}
            height={36}
          />
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            SportsMarkers
          </span>
        </Link>

        {/* Center: nav */}
        <nav className="hidden flex-1 items-center justify-center sm:flex">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    isActive(item.href)
                      ? "px-5 py-2 rounded-full font-semibold bg-[#254485] text-white shadow-md transition"
                      : "px-5 py-2 rounded-full font-semibold text-foreground hover:text-[#254485] transition"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: auth actions */}
        <div className="ml-auto hidden sm:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/create"
                className="px-4 py-2 rounded-full font-semibold text-foreground hover:text-[#254485] transition"
              >
                Profile
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-11 px-5 rounded-full font-semibold"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                className={
                  showingAuthPage
                    ? onLogin
                      ? pillActive
                      : pillOutline
                    : pillActive
                }
              >
                <Link href="/login" aria-current={onLogin ? "page" : undefined}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className={
                  showingAuthPage
                    ? onSignup
                      ? pillActive
                      : pillOutline
                    : pillActive
                }
              >
                <Link
                  href="/signup"
                  aria-current={onSignup ? "page" : undefined}
                >
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile: menu + auth */}
        <div className="ml-auto flex items-center gap-2 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-3">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive(item.href)
                        ? "rounded-full px-4 py-2 font-semibold bg-[#254485] text-white"
                        : "rounded-full px-4 py-2 font-semibold hover:bg-muted"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/create"
                      className="rounded-full px-4 py-2 font-semibold hover:bg-muted"
                    >
                      Profile
                    </Link>
                    <Button onClick={handleLogout} className="rounded-full">
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className={
                        showingAuthPage
                          ? onLogin
                            ? pillActive
                            : pillOutline
                          : pillActive
                      }
                    >
                      <Link
                        href="/login"
                        aria-current={onLogin ? "page" : undefined}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className={
                        showingAuthPage
                          ? onSignup
                            ? pillActive
                            : pillOutline
                          : pillActive
                      }
                    >
                      <Link
                        href="/signup"
                        aria-current={onSignup ? "page" : undefined}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
