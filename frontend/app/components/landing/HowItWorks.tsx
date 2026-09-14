import { Upload, ScanSearch, Gauge } from "lucide-react";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    icon: Upload,
    title: "Upload your resume",
    body: "Drop in your PDF resume. ApplyAI securely extracts the information it needs.",
  },
  {
    icon: ScanSearch,
    title: "Paste the job description",
    body: "Add the job you're interested in. ApplyAI analyzes the requirements and expectations.",
  },
  {
    icon: Gauge,
    title: "Get your match",
    body: "See your match score, matched skills, missing skills, and personalized recommendations.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-6 py-20 md:py-28"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #ECE3CD",
        borderBottom: "1px solid #ECE3CD",
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <Reveal>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{
              color: "#B08B3F",
            }}
          >
            How it works
          </p>

          <h2
            className="mt-3 max-w-xl text-3xl md:text-4xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
            }}
          >
            Three steps, one minute
          </h2>
        </Reveal>

        {/* Steps */}
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <Reveal
                key={step.title}
                delay={index * 120}
              >
                <div className="relative">

                  {/* Step number */}
                  <span
                    className="text-6xl"
                    style={{
                      fontFamily:
                        "'Fraunces', Georgia, serif",
                      fontWeight: 600,
                      color: "#F1E9D3",
                    }}
                  >
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <div
                    className="-mt-8 flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{
                      background: "#FBF8F0",
                      color: "#FF5A1F",
                      border: "1px solid #ECE3CD",
                    }}
                  >
                    <Icon
                      size={19}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="mt-4 text-lg font-semibold"
                    style={{
                      color: "#1D1912",
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{
                      color: "#8A7F63",
                    }}
                  >
                    {step.body}
                  </p>

                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}