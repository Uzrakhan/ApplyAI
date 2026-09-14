import {
  ShieldCheck,
  Target,
  Wand2,
  Sparkles,
} from "lucide-react";
import { Reveal } from "./Reveal";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Privacy-first parsing",
    body: "Your resume is processed securely and used only to power your analysis.",
  },
  {
    icon: Target,
    title: "ATS-aware keywords",
    body: "Identify important keywords from the job description and see where your resume aligns.",
  },
  {
    icon: Wand2,
    title: "Tailored to each job",
    body: "Get recommendations based on the specific role instead of generic resume advice.",
  },
  {
    icon: Sparkles,
    title: "Free to start",
    body: "Analyze your resume and understand your fit before deciding what to improve.",
  },
];

export default function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      {/* Section heading */}
      <Reveal>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{
            color: "#B08B3F",
          }}
        >
          Why ApplyAI
        </p>

        <h2
          className="mt-3 max-w-xl text-3xl md:text-4xl"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 600,
          }}
        >
          Built for the job hunt, not a demo
        </h2>
      </Reveal>

      {/* Benefit cards */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <Reveal
              key={benefit.title}
              delay={index * 90}
            >
              <div
                className="hover-lift h-full rounded-[24px] p-6"
                style={{
                  background: "#FBF8F0",
                  border: "1px solid #ECE3CD",
                }}
              >
                {/* Icon */}
                <Icon
                  size={18}
                  strokeWidth={2}
                  style={{
                    color: "#FF5A1F",
                  }}
                />

                {/* Title */}
                <h3
                  className="mt-4 text-sm font-semibold"
                  style={{
                    color: "#1D1912",
                  }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    color: "#8A7F63",
                  }}
                >
                  {benefit.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}