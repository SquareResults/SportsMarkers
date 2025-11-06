import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    // removed border-t; added subtle top-only shadow and solid bg
    <footer className="bg-white py-8 md:py-12 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]">
      <div className="container grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="col-span-1 md:col-span-2 text-center md:text-left">
          <Link href="/" className="flex items-center space-x-2 mb-4 justify-center md:justify-start">
            <Image src="/images/logo.svg" alt="SportsMarker" width={32} height={32} />
            <span className="font-bold text-lg">SportsMarker</span>
          </Link>
          <p className="text-sm text-muted-foreground mb-4">
            &copy; {new Date().getFullYear()} SportsMarker. All rights reserved.
          </p>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
          </ul>
        </div>

        <div className="col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link href="/athletes" className="text-muted-foreground hover:text-foreground">Portfolios</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Support</Link></li>
          </ul>
        </div>

        <div className="col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for updates.
          </p>
          <form className="flex gap-2 justify-center md:justify-start">
            <Input type="email" placeholder="Your email" className="max-w-xs" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
