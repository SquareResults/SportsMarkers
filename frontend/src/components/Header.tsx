import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 ml-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/images/logo.svg"
              alt="SportsMarker Logo"
              width={40}
              height={40}
            />
            <span className="hidden font-bold sm:inline-block">
              SportsMarker
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/athletes">Portfolios</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="flex items-center justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button asChild>
              <Link href="/create">Create Portfolio</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
