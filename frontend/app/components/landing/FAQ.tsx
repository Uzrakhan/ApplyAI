"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "How does ApplyAI calculate my match score?",
    a: "ApplyAI analyzes the skills and requirements in the job description, compares them with the skills found in your resume, and calculates a match score based on how well your experience aligns with the role.",
  },
  {
    q: "Does ApplyAI rewrite my resume?",
    a: "Yes. The resume optimizer provides targeted suggestions for improving your resume for the specific job. It focuses on stronger wording, relevant keywords, and clearer presentation without inventing experience.",
  },
  {
    q: "Will ApplyAI invent experience or skills?",
    a: "No. ApplyAI is designed to use evidence from your resume and the job description. It should not add projects, technologies, or experience that aren't supported by your resume.",
  },
  {
    q: "Can I use ApplyAI for different types of jobs?",
    a: "Yes. You can upload your resume and provide the job description for different roles. ApplyAI analyzes the specific requirements of each job rather than giving you one generic score.",
  },
  {
    q: "Does ApplyAI generate cover letters?",
    a: "Yes. ApplyAI can generate a personalized cover letter using information from your resume and the requirements of the job description.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid #ECE3CD",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span
          className="text-base font-medium md:text-lg"
          style={{
            color: "#1D1912",
          }}
        >
          {question}
        </span>

        <ChevronDown
          size={18}
          strokeWidth={2.25}
          style={{
            color: "#8A7F63",
            flexShrink: 0,
            transform: open
              ? "rotate(180deg)"
              : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p
          className="pb-6 text-sm leading-6"
          style={{
            color: "#8A7F63",
            maxWidth: 640,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section
      id="faq"
      className="px-6 py-20 md:py-28"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #ECE3CD",
      }}
    >
      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <Reveal>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{
              color: "#B08B3F",
            }}
          >
            FAQ
          </p>

          <h2
            className="mt-3 text-3xl md:text-4xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
            }}
          >
            Questions, answered
          </h2>
        </Reveal>

        {/* Questions */}
        <div className="mt-10">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.q}
              question={faq.q}
              answer={faq.a}
              open={openFaq === index}
              onToggle={() =>
                setOpenFaq(
                  openFaq === index ? -1 : index
                )
              }
            />
          ))}
        </div>

      </div>
    </section>
  );
}