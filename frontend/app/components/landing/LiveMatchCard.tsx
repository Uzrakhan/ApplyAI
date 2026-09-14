"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const MOCK_CHIPS = [
  "React",
  "TypeScript",
  "REST APIs",
  "Node.js",
  "Testing",
];

export default function LiveMatchCard() {
  const [score, setScore] = useState(38);
  const [chipCount, setChipCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    function runAnimation() {
      setScore(38);
      setChipCount(0);

      let currentScore = 38;

      const scoreTimer = setInterval(() => {
        currentScore += 3;

        if (currentScore >= 91) {
          currentScore = 91;
          clearInterval(scoreTimer);
        }

        if (!cancelled) {
          setScore(currentScore);
        }
      }, 90);

      MOCK_CHIPS.forEach((_, index) => {
        setTimeout(() => {
          if (!cancelled) {
            setChipCount((current) =>
              Math.max(current, index + 1)
            );
          }
        }, 700 + index * 380);
      });
    }

    runAnimation();

    const loopTimer = setInterval(
      runAnimation,
      6200
    );

    return () => {
      cancelled = true;
      clearInterval(loopTimer);
    };
  }, []);

  return (
    <div
      className="hover-lift w-full max-w-sm p-6"
      style={{
        background: "#1D1912",
        color: "#fff",
        border: "1px solid #1D1912",
        borderRadius: 28,
        boxShadow:
          "0 30px 60px -24px rgba(29,25,18,0.45)",
      }}
    >

      {/* Header */}
      <div className="flex items-center justify-between">

        <p
          className="text-sm"
          style={{
            color: "#C9BFA6",
          }}
        >
          Match score
        </p>

        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background:
              score >= 85
                ? "#E7F0E4"
                : "#F6EFDB",

            color:
              score >= 85
                ? "#3E6B4F"
                : "#B08B3F",
          }}
        >
          {score >= 85
            ? "Excellent match"
            : "Good match"}
        </span>

      </div>

      {/* Score */}
      <div className="mt-3 flex items-end gap-2">

        <span
          style={{
            fontFamily:
              "'Fraunces', Georgia, serif",
            fontWeight: 600,
            fontSize: 64,
            lineHeight: 1,
          }}
        >
          {score}
        </span>

        <span
          className="mb-2 text-xl"
          style={{
            color: "#C9BFA6",
          }}
        >
          %
        </span>

      </div>

      {/* Progress */}
      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full"
        style={{
          background: "#39352A",
        }}
      >
        <div
          className="progress-fill h-full rounded-full"
          style={{
            width: `${score}%`,
            background:
              "linear-gradient(90deg, #FF5A1F, #FF8A5C)",
          }}
        />
      </div>

      {/* Matched skills heading */}
      <p
        className="mt-5 text-xs font-semibold uppercase tracking-wider"
        style={{
          color: "#8A7F63",
        }}
      >
        Matched skills
      </p>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-2">

        {MOCK_CHIPS.slice(0, chipCount).map(
          (chip) => (
            <span
              key={chip}
              className="chip-pop inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background:
                  "rgba(231,240,228,0.12)",

                color: "#CFE3C9",

                border:
                  "1px solid rgba(231,240,228,0.25)",
              }}
            >
              <CheckCircle2
                size={11}
                strokeWidth={2.5}
              />

              {chip}
            </span>
          )
        )}

      </div>
    </div>
  );
}