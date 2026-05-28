export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-[#1B4FD8] font-bold text-xl tracking-tight">
          LynkServ
        </span>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#111827]">
          <a href="#" className="hover:text-[#1B4FD8] transition-colors">Find Services</a>
          <a href="#" className="hover:text-[#1B4FD8] transition-colors">Pricing</a>
          <a href="#" className="hover:text-[#1B4FD8] transition-colors">About</a>
        </nav>
        <a
          href="#"
          className="bg-[#1B4FD8] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          List your business
        </a>
      </header>

      {/* Hero */}
      <section className="bg-[#1B4FD8] text-white px-6 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
          Your Link to Trusted<br />Local Services
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-10">
          Vetted businesses. Real reviews. First-time offers.
        </p>
        <div className="max-w-xl mx-auto bg-white rounded-xl overflow-hidden flex shadow-lg">
          <input
            type="text"
            placeholder="What do you need? (e.g. plumber, lawn care)"
            className="flex-1 px-5 py-4 text-[#111827] text-sm outline-none"
          />
          <button className="bg-[#F59E0B] text-[#111827] font-semibold px-6 py-4 text-sm hover:bg-amber-400 transition-colors whitespace-nowrap">
            Search
          </button>
        </div>
      </section>

      {/* Categories placeholder */}
      <section className="bg-[#F8F9FA] px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#111827] mb-2">Browse by Category</h2>
        <p className="text-gray-500 text-sm">12 categories — coming in Phase 2</p>
      </section>

      {/* Provider CTA */}
      <section className="bg-white border-t border-gray-100 px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">
          Are you a local service provider?
        </h2>
        <p className="text-gray-500 mb-8">
          Get found by Utah homeowners. 30 days free. No credit card required.
        </p>
        <a
          href="#"
          className="inline-block bg-[#1B4FD8] text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          List your business free →
        </a>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#111827] text-gray-400 text-sm px-6 py-8 text-center">
        © {new Date().getFullYear()} LynkServ · Utah&apos;s local service directory
      </footer>
    </main>
  );
}
