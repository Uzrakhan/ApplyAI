"use client";

import { SiGithub, SiLinkerd, SiX } from "react-icons/si"; 


const PRODUCT_LINKS = [
  {
    label: "Resume match score",
    href: "/analyze",
  },
  {
    label: "Resume optimizer",
    href: "/analyze",
  },
  {
    label: "Cover letter generator",
    href: "/analyze",
  },
  {
    label: "Job preferences",
    href: "/job-search",
  },
];

const COMPANY_LINKS = [
  {
    label: "How it works",
    id: "how-it-works",
  },
  {
    label: "FAQ",
    id: "faq",
  },
];

const LEGAL_LINKS = [
  {
    label: "Privacy policy",
    href: "/privacy",
  },
  {
    label: "Terms of service",
    href: "/terms",
  },
];

export default function Footer() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <footer
      className="px-6 pb-10 pt-16"
      style={{
        background: "#FBF8F0",
        borderTop: "1px solid #ECE3CD",
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Main footer */}
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <a
              href="/"
              className="inline-block"
              style={{
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily:
                    "'Fraunces', Georgia, serif",
                  fontWeight: 600,
                  fontSize: 22,
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

            <p
              className="mt-3 max-w-xs text-sm leading-6"
              style={{
                color: "#8A7F63",
              }}
            >
              AI-powered resume intelligence for smarter,
              faster job applications.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">

              <a
                href="#"
                aria-label="X / Twitter"
                className="btn-ghost flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  border: "1px solid #ECE3CD",
                  color: "#5F5748",
                }}
              >
                <SiX size={15} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="btn-ghost flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  border: "1px solid #ECE3CD",
                  color: "#5F5748",
                }}
              >
                <SiLinkerd size={15} />
              </a>

              <a
                href="#"
                aria-label="GitHub"
                className="btn-ghost flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  border: "1px solid #ECE3CD",
                  color: "#5F5748",
                }}
              >
                <SiGithub size={15} />
              </a>

            </div>
          </div>

          {/* Product */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                color: "#B08B3F",
              }}
            >
              Product
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      color: "#5F5748",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                color: "#B08B3F",
              }}
            >
              Company
            </p>

            <ul className="mt-4 space-y-3 text-sm">

              {COMPANY_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    style={{
                      color: "#5F5748",
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}

              <li>
                <a
                  href="mailto:hello@applyai.app"
                  style={{
                    color: "#5F5748",
                    textDecoration: "none",
                  }}
                >
                  Contact
                </a>
              </li>

            </ul>
          </div>

          {/* Legal */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                color: "#B08B3F",
              }}
            >
              Legal
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    style={{
                      color: "#5F5748",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom footer */}
        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 pt-6 text-xs md:flex-row"
          style={{
            borderTop: "1px solid #ECE3CD",
            color: "#9C9179",
          }}
        >
          <span>
            © {new Date().getFullYear()} ApplyAI.
            All rights reserved.
          </span>

          <span>
            Built for people, not just parsers.
          </span>
        </div>

      </div>
    </footer>
  );
}