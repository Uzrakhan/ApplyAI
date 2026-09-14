import { Target, Wand2, Mail, Sliders } from "lucide-react";
import { Reveal } from "./Reveal";

const FEATURES = [
  {
    id: "match-score",
    icon: Target,
    title: "Resume match score",
    body: "See exactly how your resume stacks up against the job — with matched and missing skills.",
    tint: "#DC4A2A",
    tintBg: "#FDE8E0",  
    big: true,
  },
  {
    id: "optimizer",
    icon: Wand2,
    title: "Resume optimizer",
    body: "Get targeted improvements that strengthen your resume for the role you're applying to.",
    tint: "#DC4A2A",
    tintBg: "#FDE8E0",  
    big: false,
  },
  {
    id: "cover-letter",
    icon: Mail,
    title: "Cover letter generator",
    body: "Generate a personalized cover letter using your actual experience and the job description.",
    tint: "#DC4A2A",
    tintBg: "#FDE8E0",  
    big: false,
  },
  {
    id: "job-preferences",
    icon: Sliders,
    title: "Job preferences",
    body: "Tell ApplyAI what roles, locations, and opportunities you're looking for.",
    tint: "#DC4A2A",
    tintBg: "#FDE8E0",  
    big: false,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20 md:py-28"
    >
      {/* Section heading */}
      <Reveal>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{
            color: "#B08B3F",
          }}
        >
          What ApplyAI does
        </p>

        <h2
          className="mt-3 max-w-xl text-3xl md:text-4xl"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 600,
          }}
        >
          Everything you need to apply with confidence
        </h2>
      </Reveal>

      {/* Feature cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <Reveal
              key={feature.id}
              delay={index * 90}
              className={
                feature.big
                  ? "md:col-span-2"
                  : ""
              }
            >
              <div
                id={feature.id}
                className="hover-lift h-full scroll-mt-28 rounded-[28px] p-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5DDCC",
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    background: feature.tintBg,
                    color: feature.tint,
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={2}
                  />
                </div>

                {/* Title */}
                <h3
                  className="mt-5 text-xl"
                  style={{
                    fontFamily:
                      "'Fraunces', Georgia, serif",
                    fontWeight: 600,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2 max-w-md text-sm leading-6"
                  style={{
                    color: "#766E5C",
                  }}
                >
                  {feature.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}