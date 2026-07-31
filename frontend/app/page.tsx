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

  candidate: {
    skills: string[];
    experience: string[];
    projects: string[];
    education: string[];
  };

  match: {
    matching_skills: string[];
    missing_skills: string[];
    total_required_skills: number;
    match_score: number;
  };
};

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeJob() {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload your resume and provide the job description.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("Backend API URL is not configured.");
      }


      const response = await fetch(
        `${API_URL}/analyze-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail || `Request failed with status ${response.status}`
        );
      }

      const data: AnalysisResult = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "ApplyAI couldn't analyze the match."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* Header */}

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            ApplyAI
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Understand how well your profile matches a job before you apply.
          </p>
        </header>

        {/* Inputs */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* Resume */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Your Resume
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Upload your resume as a PDF.
              </p>
            </div>

            <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-8">
              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setResumeFile(file);
                }}
              />

              <label
                htmlFor="resume"
                className="cursor-pointer text-center"
              >
                {resumeFile ? (
                  <>
                    <p className="font-medium">
                      ✓ {resumeFile.name}
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Click to choose another PDF
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">
                      Upload your resume
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Click to select a PDF
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Job */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Job Description
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Paste the position you want to analyze.
              </p>
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-80 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-6 outline-none transition focus:border-zinc-500"
            />
          </div>

        </section>

        {/* Analyze */}

        <div className="mt-6 flex flex-col items-center">

          <button
            onClick={analyzeJob}
            disabled={
              loading ||
              !resumeFile ||
              !jobDescription.trim()
            }
            className="rounded-xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Analyzing your match..." : "Analyze Match"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

        </div>

        {/* Results */}

        {result && (
          <section className="mt-12 space-y-6">

            <div>
              <p className="text-sm font-medium text-zinc-400">
                ANALYSIS
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Your Job Match
              </h2>
            </div>

            {/* Top cards */}

            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">
                  Match Score
                </p>

                <p className="mt-3 text-5xl font-bold">
                  {Math.round(result.match.match_score)}%
                </p>

                <p className="mt-3 text-sm text-zinc-400">
                  {result.match.matching_skills.length} of{" "}
                  {result.match.total_required_skills} required skills matched
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">
                  Position
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  {result.job.role}
                </h3>

                <p className="mt-4 text-sm text-zinc-400">
                  Experience
                </p>

                <p className="mt-1">
                  {result.job.experience}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">
                  Location
                </p>

                <p className="mt-3 text-xl font-semibold">
                  {result.job.location}
                </p>

                <p className="mt-4 text-sm text-zinc-400">
                  Required skills
                </p>

                <p className="mt-1">
                  {result.match.total_required_skills}
                </p>
              </div>

            </div>

            {/* Matching / missing */}

            <div className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-lg font-semibold">
                  Matching Skills
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Skills from your resume that match this position.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  {result.match.matching_skills.length > 0 ? (
                    result.match.matching_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No direct skill matches found.
                    </p>
                  )}

                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-lg font-semibold">
                  Skill Gaps
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Required skills not detected in your resume.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  {result.match.missing_skills.length > 0 ? (
                    result.match.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No missing required skills detected.
                    </p>
                  )}

                </div>
              </div>

            </div>

            {/* Candidate */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold">
                Candidate Profile
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Skills ApplyAI extracted from your resume.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                {result.candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </div>

            {/* Required skills */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold">
                Job Requirements
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Technical skills detected in the job description.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                {result.job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </div>

            {/* Responsibilities */}

            {result.job.responsibilities.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-lg font-semibold">
                  Responsibilities
                </h3>

                <ul className="mt-5 space-y-3 text-zinc-300">
                  {result.job.responsibilities.map(
                    (responsibility, index) => (
                      <li
                        key={`${responsibility}-${index}`}
                        className="flex gap-3"
                      >
                        <span className="text-zinc-500">
                          •
                        </span>

                        <span>
                          {responsibility}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}