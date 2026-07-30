"use client";

import { useState } from "react";

type AnalysisResult = {
  job: {
    role: string;
    skills: string[];
    experience: string;
    responsibilities: string[];
    location: string;
  };
  match: {
    matching_skills: string[];
    missing_skills: string[];
    total_required_skills: number;
    match_score: number
  }
}


export default function Home() {
  const [jobDescription,setJobDescription] = useState("");
  const [result,setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function analyzeJob() {
    if (!jobDescription.trim()) {
      return
    }

    setLoading(true)
    setResult(null)


    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          job_description: jobDescription
        })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze job")
      }

      const data: AnalysisResult = await response.json()

      setResult(data)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setLoading(false)
    }
  } 
  return (
    <main className="min-h-screen bg-purple-700 text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            ApplyAI
          </h1>

          <p className="mt-4 text-zinc-800">
            AI-powered job intelligence and candidate matching
          </p>
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Analyze a Job
          </h2>

          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste a job description here..."
            className="min-h-52 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-zinc-500"
          />

          <button
            onClick={analyzeJob}
            disabled={loading || !jobDescription.trim()}
            className="mt-4 rounded-xl bg-white px-6 py-3 font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Job"}
          </button>
        </section>

        {result && (
          <section className="mt-8 space-y-6">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400">Match Score</p>

              <p className="mt-2 text-5xl font-bold">
                {Math.round(result.match.match_score)}%
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">Role</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {result.job.role}
                </h2>

                <p className="mt-6 text-sm text-zinc-400">
                  Experience
                </p>
                <p className="mt-1">
                  {result.job.experience}
                </p>

                <p className="mt-6 text-sm text-zinc-400">
                  Location
                </p>
                <p className="mt-1">
                  {result.job.location}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">
                  Required Skills
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="font-semibold">
                  Matching Skills
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.match.matching_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-sm"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="font-semibold">
                  Skill Gaps
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.match.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {result.job.responsibilities.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="font-semibold">
                  Responsibilities
                </h3>

                <ul className="mt-4 space-y-2 text-zinc-300">
                  {result.job.responsibilities.map((responsibility) => (
                    <li key={responsibility}>
                      • {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}
