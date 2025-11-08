"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/SupabaseProvider";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, Menu, User2, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Hide on scroll down, show on scroll up */
function useScrollHide({
  revealOffset = 8,
  threshold = 6,
}: { revealOffset?: number; threshold?: number } = {}) {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastY.current;
        setAtTop(y <= revealOffset);
        if (Math.abs(diff) > threshold) {
          setHidden(diff > 0 && y > revealOffset);
          lastY.current = y;
        } else {
          lastY.current = y;
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealOffset, threshold]);

  return { hidden, atTop };
}

/** Build a simple initial for the avatar */
function initialsFromUser(user: User | null) {
  const name =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.email as string) ||
    "";
  const clean = name.trim();
  if (!clean) return "U";
  const parts = clean.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  const init = (first + last).toUpperCase();
  // fallback to email first letter if needed
  return init || (clean[0] || "U").toUpperCase();
}

/** YouTube-style account menu */
function UserMenu({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    "";
  const email = user.email ?? "";
  const initials = initialsFromUser(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a8a] text-white font-semibold shadow-sm hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          aria-label="Account menu"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[320px] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header block like the screenshot */}
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#1e3a8a] text-white font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">{name || email}</div>
            {name && (
              <div className="truncate text-sm text-slate-500">{email}</div>
            )}
            <Link
              href="/create"
              className="mt-1 inline-block text-sm font-medium text-[#2563eb] hover:underline"
            >
              View your portfolio
            </Link>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Large tappable rows */}
        <DropdownMenuItem asChild>
          <Link
            href="/create"
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-3">
              <User2 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <span className="text-[15px]">Profile</span>
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        </DropdownMenuItem>


        <DropdownMenuSeparator className="my-2" />

        <button
          onClick={onLogout}
          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            <span className="text-[15px]">Sign out</span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const supabase = useSupabase();
  const pathname = usePathname();
  const { hidden, atTop } = useScrollHide();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
    };
    run();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
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
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        atTop
          ? "bg-white"
          : "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/65 shadow-sm",
      ].join(" ")}
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:h-20 sm:px-6">
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Go home">
          <Image src="/images/logo.png" alt="SportsMarkers" width={36} height={36} priority />
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            SportsMarkers
          </span>
        </Link>

        {/* Center: nav */}
        <nav className="hidden flex-1 items-center justify-center sm:flex" aria-label="Primary">
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
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: auth / account */}
        <div className="ml-auto hidden items-center gap-3 sm:flex">
          {user ? (
            // New account menu like your screenshot
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Button
                asChild
                className={
                  showingAuthPage ? (onLogin ? pillActive : pillOutline) : pillActive
                }
              >
                <Link href="/login" aria-current={onLogin ? "page" : undefined}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className={
                  showingAuthPage ? (onSignup ? pillActive : pillOutline) : pillActive
                }
              >
                <Link href="/signup" aria-current={onSignup ? "page" : undefined}>
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
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-3" aria-label="Mobile Primary">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive(item.href)
                        ? "rounded-full px-4 py-2 font-semibold bg-[#254485] text-white"
                        : "rounded-full px-4 py-2 font-semibold hover:bg-muted"
                    }
                    aria-current={isActive(item.href) ? "page" : undefined}
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
                        showingAuthPage ? (onLogin ? pillActive : pillOutline) : pillActive
                      }
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className={
                        showingAuthPage ? (onSignup ? pillActive : pillOutline) : pillActive
                      }
                    >
                      <Link href="/signup">Sign Up</Link>
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
