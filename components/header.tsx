'use client';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">Dash-Comps</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="#projects"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Projects
          </a>
          <a
            href="#components"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Components
          </a>
          <a
            href="#contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
