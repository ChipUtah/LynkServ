import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <span className="text-white font-bold text-lg block mb-3">
            LynkServ
          </span>
          <p className="text-sm leading-relaxed">
            Utah&apos;s local service directory.
            <br />
            Your link to trusted local services.
          </p>
        </div>

        <div>
          <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
            Homeowners
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/search" className="hover:text-white transition-colors">
                Find Services
              </Link>
            </li>
            <li>
              <Link href="/how-we-vet" className="hover:text-white transition-colors">
                How We Vet
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
            For Businesses
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/provider/signup"
                className="hover:text-white transition-colors"
              >
                List Your Business
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/provider/login"
                className="hover:text-white transition-colors"
              >
                Provider Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <span>
            © {new Date().getFullYear()} LynkServ · Utah&apos;s local service
            directory
          </span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
