"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import LiveMatchCard from "./LiveMatchCard";

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "Marketing Lead",
  "HR",
  "Graphic Designer"
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((current) => (current + 1) % ROLES.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function goToAnalyze() {
    window.location.href = "/analyze";
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-20 pt-40 md:pb-28 md:pt-48"
    >
      {/* Decorative blob */}
      <div
        className="blob"
        style={{
          width: 420,
          height: 420,
          top: -140,
          right: -100,
          background: "#FFB08A",
        }}
      />

      {/* Decorative blob */}
      <div
        className="blob"
        style={{
          width: 320,
          height: 320,
          top: 220,
          left: -120,
          background: "#D9E8D2",
          animationDelay: "3s",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

        {/* LEFT SIDE */}
        <div className="fade-up">

          {/* Badge */}
          <span
            className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5DDCC",
              color: "#766E5C",
            }}
          >
            <Sparkles
              size={13}
              strokeWidth={2.25}
              style={{
                color: "#FF5A1F",
              }}
            />

            AI resume intelligence
          </span>

          {/* Heading */}
          <h1
            className="text-5xl leading-[1.05] tracking-tight md:text-6xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#1D1912",
            }}
          >
            Know your match
            <br />

            before you apply as a
            <br />

            <span
              key={roleIndex}
              className="role-word"
              style={{
                fontStyle: "italic",
                color: "#FF5A1F",
              }}
            >
              {ROLES[roleIndex]}
            </span>
          </h1>

          {/* Description */}
          <p
            className="mt-6 max-w-lg text-base leading-7 md:text-lg"
            style={{
              color: "#766E5C",
            }}
          >
            Upload your resume, paste any job description, and get a real match
            score, an optimized resume, and a ready-to-send cover letter in
            under a minute.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">

            {/* Primary CTA */}
            <button
              onClick={goToAnalyze}
              className="btn-primary flex cursor-pointer items-center gap-2 rounded-2xl px-7 py-3.5 text-base font-semibold"
              style={{
                background: "#DC4A2A",
                color: "#fff",
                boxShadow: "0 12px 28px -12px rgba(220, 74, 42, 0.5)",
              }}
            >
              Analyze your resume free

              <ArrowRight
                size={16}
                strokeWidth={2.5}
              />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => scrollTo("how-it-works")}
              className="btn-ghost cursor-pointer rounded-2xl px-6 py-3.5 text-base font-semibold"
              style={{
                border: "1px solid #ECE3CD",
                color: "#1D1912",
              }}
            >
              See how it works
            </button>

          </div>

          {/* Trust text */}
          <p
            className="mt-5 text-xs"
            style={{
              color: "#B3A992",
            }}
          >
            No credit card required · Your resume is never sold or shared
          </p>

        </div>

        {/* RIGHT SIDE — LIVE MATCH CARD */}
        <div
          className="fade-up flex justify-center lg:justify-end"
          style={{
            animationDelay: "150ms",
          }}
        >
          <LiveMatchCard />
        </div>

      </div>
    </section>
  );
}