import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          SportsMarker
        </Link>
      </div>
      <nav className="hidden md:flex gap-4">
        <Link href="/" className="text-lg">
          Home
        </Link>
        <Link href="/about" className="text-lg">
          About
        </Link>
        <Link href="/athletes" className="text-lg">
          Portfolios
        </Link>
        <Link href="/contact" className="text-lg">
          Contact
        </Link>
      </nav>
      <div className="hidden md:flex items-center gap-4">
        <Button asChild>
          <Link href="/create">Create Portfolio</Link>
        </Button>
      </div>
      <div className="md:hidden">
        {/* Mobile menu button will go here */}
        <Button size="icon" variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
