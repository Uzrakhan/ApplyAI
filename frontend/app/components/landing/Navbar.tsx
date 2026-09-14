"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollTo(id: string) {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function goToAnalyze() {
    window.location.href = "/analyze";
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: scrolled
          ? "rgba(248, 246, 241, 0.85)"
          : "transparent",

        backdropFilter: scrolled
          ? "blur(14px)"
          : "none",

        borderBottom: scrolled
          ? "1px solid #E5DDCC"
          : "1px solid transparent",

        transition:
          "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">

        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="flex cursor-pointer items-center gap-2"
        >
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: "#1D1912",
            }}
          >
            Apply
            <span
              style={{
                fontStyle: "italic",
                color: "#FF5A1F",
              }}
            >
              AI
            </span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="cursor-pointer text-sm font-medium"
              style={{
                color: "#5F5748",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">

          <button
            onClick={goToAnalyze}
            className="btn-primary flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-sm font-semibold"
            style={{
              background: "#DC4A2A",
              color: "#fff",
              boxShadow: "0 8px 20px -10px rgba(220, 74, 42, 0.5)",
            }}
          >
            Get started

            <ArrowRight
              size={14}
              strokeWidth={2.5}
            />
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "#FAF8F3",
            borderTop: "1px solid #ECE3CD",
          }}
        >
          <div className="flex flex-col gap-1 px-6 py-4">

            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="py-2.5 text-left text-sm font-medium"
                style={{
                  color: "#1D1912",
                }}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={goToAnalyze}
              className="btn-primary mt-3 flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold"
              style={{
                background: "#FF5A1F",
                color: "#fff",
              }}
            >
              Get started

              <ArrowRight
                size={14}
                strokeWidth={2.5}
              />
            </button>

          </div>
        </div>
      )}

    </header>
  );
}