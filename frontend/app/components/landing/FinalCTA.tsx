"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export default function FinalCTA() {
  function goToAnalyze() {
    window.location.href = "/analyze";
  }

  return (
    <section
      id="get-started"
      className="relative mx-6 my-20 overflow-hidden rounded-[36px] px-8 py-16 text-center md:mx-auto md:max-w-5xl md:py-20"
      style={{
        background: "#1D1912",
      }}
    >
      {/* Decorative blob */}
      <div
        className="blob"
        style={{
          width: 300,
          height: 300,
          top: -100,
          left: -60,
          background: "#FF5A1F",
          opacity: 0.25,
        }}
      />

      <Reveal>
        {/* Heading */}
        <h2
          className="mx-auto max-w-xl text-3xl md:text-4xl"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Stop guessing if you're a fit. Find out.
        </h2>

        {/* Description */}
        <p
          className="mx-auto mt-4 max-w-md text-sm md:text-base"
          style={{
            color: "#C9BFA6",
          }}
        >
          Upload your resume and your next job description — ApplyAI does the
          rest.
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={goToAnalyze}
          className="btn-primary relative mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold"
          style={{
            background: "#FF5A1F",
            color: "#fff",
            boxShadow:
              "0 16px 32px -12px rgba(255,90,31,0.6)",
          }}
        >
          Analyze your resume free

          <ArrowRight
            size={16}
            strokeWidth={2.5}
          />
        </button>
      </Reveal>
    </section>
  );
}