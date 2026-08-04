"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  Star,
  Briefcase,
  MapPin,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  Rocket,
  Upload,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  Mail,
} from "lucide-react";

type ResumeOptimization = {
  summary: string;
  improved_bullets: string[];
  missing_keywords: string[];
  suggestions: string[];
};

type AnalysisResult = {
  job: {
    role: string;
    required_skills: string[];
    preferred_skills: string[];
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

type CoverLetter = {
  subject: string;
  greeting: string;
  introduction: string;
  body_paragraphs: string[];
  closing: string;
  candidate_name: string;
};

function scoreLabel(score: number) {
  if (score >= 85) return { label: "Excellent Match", color: "#3E6B4F", bg: "#E7F0E4" };
  if (score >= 65) return { label: "Good Match", color: "#B08B3F", bg: "#F6EFDB" };
  if (score >= 45) return { label: "Average Match", color: "#B08B3F", bg: "#F6EFDB" };
  return { label: "Poor Match", color: "#C24A1F", bg: "#FBEAE3" };
}

const COVER_LETTER_STEPS = [
  "Reading Resume",
  "Understanding Job Description",
  "Highlighting Relevant Experience",
  "Writing Cover Letter",
];

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [optimization, setOptimization] = useState<ResumeOptimization | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cover Letter Generator state (new, additive only)
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [coverLetterStep, setCoverLetterStep] = useState(0);
  const [coverLetterError, setCoverLetterError] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

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

      const response = await fetch(`${API_URL}/analyze-pdf`, {
        method: "POST",
        body: formData,
      });

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

  async function optimizeResume() {
    if (!resumeFile || !jobDescription.trim()) return;

    setOptimizing(true);

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/optimize-resume`, {
        method: "POST",
        body: formData,
      });

      const data: ResumeOptimization = await response.json();
      setOptimization(data);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  }

  // New, additive function — does not touch any existing state or logic above.
  async function generateCoverLetter() {
    if (!resumeFile || !jobDescription.trim()) return;

    setGeneratingCoverLetter(true);
    setCoverLetterError("");
    setCoverLetterStep(0);
    setCopyStatus("idle");

    const stepTimer = setInterval(() => {
      setCoverLetterStep((prev) =>
        prev < COVER_LETTER_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 700);

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/generate-cover-letter`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `Request failed with status ${response.status}`
        );
      }

      const data: CoverLetter = await response.json();
      setCoverLetter(data);
    } catch (err) {
      console.error(err);
      setCoverLetterError(
        err instanceof Error
          ? err.message
          : "ApplyAI couldn't generate the cover letter."
      );
    } finally {
      clearInterval(stepTimer);
      setGeneratingCoverLetter(false);
      setCoverLetterStep(0);
    }
  }

  function buildCoverLetterText(letter: CoverLetter) {
    return [
      letter.subject,
      "",
      letter.greeting,
      "",
      letter.introduction,
      "",
      ...letter.body_paragraphs.flatMap((p) => [p, ""]),
      "Kind regards,",
      letter.candidate_name,
    ].join("\n");
  }

  async function copyCoverLetter() {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(buildCoverLetterText(coverLetter));
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  function downloadCoverLetterTxt() {
    if (!coverLetter) return;
    const blob = new Blob([buildCoverLetterText(coverLetter)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cover-letter.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const scoreInfo = result ? scoreLabel(result.match.match_score) : null;

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#FAF8F3",
        color: "#1D1912",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap');

        .hover-lift {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -20px rgba(29, 25, 18, 0.16);
          border-color: #E1D5B4 !important;
        }
        .dropzone {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .dropzone:hover {
          border-color: #FF5A1F !important;
          background: #FDF4EE !important;
        }
        .analyze-btn {
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, background 0.25s ease;
        }
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 16px 32px -12px rgba(255, 90, 31, 0.5);
        }
        .analyze-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.99);
        }
        .field-input {
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .field-input:focus {
          border-color: #FF5A1F !important;
          box-shadow: 0 0 0 4px rgba(255, 90, 31, 0.1);
          background: #FFFFFF !important;
        }
        .progress-fill {
          transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chip {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .chip:hover {
          transform: translateY(-1px);
        }
        .icon-btn {
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .icon-btn:hover {
          transform: translateY(-1px);
          background: #FBF8F0 !important;
          border-color: #E1D5B4 !important;
        }
        .cl-step {
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {/* HERO */}
        <header className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide"
            style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", color: "#8A7F63" }}
          >
            <Sparkles size={13} strokeWidth={2.25} style={{ color: "#FF5A1F" }} />
            AI Resume Matcher
          </span>

          <h1
            className="text-6xl md:text-7xl tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, letterSpacing: "-0.025em", color: "#1D1912" }}
          >
            Apply<span style={{ fontStyle: "italic", color: "#FF5A1F" }}>AI</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "#8A7F63" }}>
            AI-powered resume intelligence for smarter job applications.
          </p>
        </header>

        {/* INPUTS */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Resume */}
          <div
            className="hover-lift rounded-[28px] p-7"
            style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", boxShadow: "0 2px 8px -4px rgba(29,25,18,0.06)" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ background: "#FBF8F0", color: "#FF5A1F" }}
                >
                  <FileText size={18} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                    Your resume
                  </h2>
                  <p className="text-sm" style={{ color: "#8A7F63" }}>
                    Upload as a PDF
                  </p>
                </div>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: "#FBEAE3", color: "#C24A1F" }}
              >
                PDF
              </span>
            </div>

            <div
              className="dropzone flex min-h-72 items-center justify-center rounded-2xl p-8"
              style={{ border: "1.5px dashed #E1D5B4", background: "#FBF8F0" }}
            >
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

              <label htmlFor="resume" className="cursor-pointer text-center">
                {resumeFile ? (
                  <>
                    <div
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ background: "#E7F0E4", color: "#3E6B4F" }}
                    >
                      <CheckCircle2 size={26} strokeWidth={2} />
                    </div>
                    <p className="font-medium" style={{ color: "#1D1912" }}>
                      {resumeFile.name}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "#9C9179" }}>
                      Click to choose another PDF
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ background: "#F1E9D3", color: "#B08B3F" }}
                    >
                      <Upload size={22} strokeWidth={2} />
                    </div>
                    <p className="text-lg font-medium" style={{ color: "#1D1912" }}>
                      Upload your resume
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "#9C9179" }}>
                      Click to select a PDF, or drag it here
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Job */}
          <div
            className="hover-lift rounded-[28px] p-7"
            style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", boxShadow: "0 2px 8px -4px rgba(29,25,18,0.06)" }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ background: "#FBF8F0", color: "#FF5A1F" }}
              >
                <Briefcase size={18} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                  Job description
                </h2>
                <p className="text-sm" style={{ color: "#8A7F63" }}>
                  Paste the posting you want to analyze
                </p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
              className="field-input min-h-72 w-full resize-none rounded-2xl p-4 text-sm leading-6 outline-none"
              style={{ border: "1.5px solid #ECE3CD", background: "#FBF8F0", color: "#1D1912" }}
            />
          </div>
        </section>

        {/* ANALYZE BUTTON */}
        <div className="mt-10 flex flex-col items-center">
          <button
            onClick={analyzeJob}
            disabled={loading || !resumeFile || !jobDescription.trim()}
            className="analyze-btn flex items-center gap-2 rounded-full px-9 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none"
            style={{ background: "#FF5A1F", color: "#FFFFFF", boxShadow: "0 8px 20px -8px rgba(255, 90, 31, 0.55)" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" strokeWidth={2.25} />
                Analyzing your match…
              </>
            ) : (
              <>
                <Sparkles size={18} strokeWidth={2.25} />
                Analyze match
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 text-sm" style={{ color: "#C24A1F" }}>
              {error}
            </p>
          )}
        </div>

        {/* RESULTS */}
        {result && scoreInfo && (
          <section className="fade-in mt-20 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
                Analysis
              </p>
              <h2
                className="mt-2 text-3xl md:text-4xl"
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
              >
                Your job match
              </h2>
            </div>

            {/* Top row */}
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
              {/* Match score - hero card */}
              <div
                className="hover-lift flex flex-col justify-between rounded-[32px] p-8"
                style={{ background: "#1D1912", color: "#FFFFFF", border: "1px solid #1D1912" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "#C9BFA6" }}>
                    Match score
                  </p>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: scoreInfo.bg, color: scoreInfo.color }}
                  >
                    {scoreInfo.label}
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <span
                    className="text-7xl md:text-8xl"
                    style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, lineHeight: 1 }}
                  >
                    {Math.round(result.match.match_score)}
                  </span>
                  <span className="mb-3 text-2xl" style={{ color: "#C9BFA6" }}>
                    %
                  </span>
                </div>

                <div className="mt-6">
                  <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "#39352A" }}>
                    <div
                      className="progress-fill h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round(result.match.match_score))}%`,
                        background: "linear-gradient(90deg, #FF5A1F, #FF8A5C)",
                      }}
                    />
                  </div>
                  <p className="mt-3 text-sm" style={{ color: "#C9BFA6" }}>
                    {result.match.matching_skills.length} of {result.match.total_required_skills} required skills matched
                  </p>
                </div>
              </div>

              {/* Position */}
              <div
                className="hover-lift rounded-[28px] p-7"
                style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
              >
                <div className="flex items-center gap-2">
                  <Briefcase size={16} style={{ color: "#FF5A1F" }} strokeWidth={2} />
                  <p className="text-sm" style={{ color: "#8A7F63" }}>
                    Position
                  </p>
                </div>

                <h3
                  className="mt-3 text-xl"
                  style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                >
                  {result.job.role}
                </h3>

                <div className="mt-5 h-px w-full" style={{ background: "#ECE3CD" }} />

                <p className="mt-4 text-sm" style={{ color: "#8A7F63" }}>
                  Experience
                </p>
                <p className="mt-1 font-medium" style={{ color: "#1D1912" }}>
                  {result.job.experience}
                </p>
              </div>

              {/* Location */}
              <div
                className="hover-lift rounded-[28px] p-7"
                style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
              >
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: "#FF5A1F" }} strokeWidth={2} />
                  <p className="text-sm" style={{ color: "#8A7F63" }}>
                    Location
                  </p>
                </div>

                <h3
                  className="mt-3 text-xl"
                  style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                >
                  {result.job.location}
                </h3>

                <div className="mt-5 h-px w-full" style={{ background: "#ECE3CD" }} />

                <p className="mt-4 text-sm" style={{ color: "#8A7F63" }}>
                  Required skills
                </p>
                <p className="mt-1 font-medium" style={{ color: "#1D1912" }}>
                  {result.match.total_required_skills}
                </p>
              </div>
            </div>

            {/* Skills Comparison — single unified card */}
            <div
              className="hover-lift rounded-[32px] p-8"
              style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ background: "#FBF8F0", color: "#FF5A1F" }}
                >
                  <Target size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3
                    className="text-xl"
                    style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                  >
                    Skills comparison
                  </h3>
                  <p className="text-sm" style={{ color: "#8A7F63" }}>
                    How your resume stacks up against this role
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-8 md:grid-cols-3">
                {/* Matched */}
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "#3E6B4F" }}>
                    <CheckCircle2 size={15} strokeWidth={2.25} />
                    Matched skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.match.matching_skills.length > 0 ? (
                      result.match.matching_skills.map((skill) => (
                        <span
                          key={skill}
                          className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                          style={{ background: "#E7F0E4", color: "#3E6B4F" }}
                        >
                          <CheckCircle2 size={12} strokeWidth={2.5} />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "#9C9179" }}>
                        No direct matches found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "#C24A1F" }}>
                    <XCircle size={15} strokeWidth={2.25} />
                    Missing skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.match.missing_skills.length > 0 ? (
                      result.match.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                          style={{ background: "#FFFFFF", color: "#C24A1F", border: "1.5px solid #F0B9A0" }}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "#9C9179" }}>
                        No missing required skills.
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferred */}
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "#B08B3F" }}>
                    <Star size={15} strokeWidth={2.25} />
                    Preferred skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.job.preferred_skills.length > 0 ? (
                      result.job.preferred_skills.map((skill) => (
                        <span
                          key={skill}
                          className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                          style={{ background: "#F6EFDB", color: "#8A6D2E" }}
                        >
                          <Star size={12} strokeWidth={2.5} />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "#9C9179" }}>
                        No preferred skills listed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
                AI Insights
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {/* AI Summary */}
                <div
                  className="hover-lift rounded-[28px] p-7"
                  style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: "#FBF8F0", color: "#FF5A1F" }}
                    >
                      <Brain size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                      AI summary
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6" style={{ color: "#4A4534" }}>
                    Your resume aligns with a{" "}
                    <span className="font-medium" style={{ color: "#1D1912" }}>{scoreInfo.label.toLowerCase()}</span>{" "}
                    for the {result.job.role} role, covering {result.match.matching_skills.length} of{" "}
                    {result.match.total_required_skills} required skills.
                  </p>
                </div>

                {/* Strengths */}
                <div
                  className="hover-lift rounded-[28px] p-7"
                  style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: "#E7F0E4", color: "#3E6B4F" }}
                    >
                      <TrendingUp size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                      Strengths
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6" style={{ color: "#4A4534" }}>
                    Strong overlap in{" "}
                    {result.match.matching_skills.slice(0, 3).join(", ") || "core"} skills gives you a solid
                    foundation to stand out for this position.
                  </p>
                </div>

                {/* Weaknesses */}
                <div
                  className="hover-lift rounded-[28px] p-7"
                  style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: "#FBEAE3", color: "#C24A1F" }}
                    >
                      <TrendingDown size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                      Weaknesses
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6" style={{ color: "#4A4534" }}>
                    {result.match.missing_skills.length > 0
                      ? `Gaps in ${result.match.missing_skills.slice(0, 3).join(", ")} may weaken your application.`
                      : "No significant skill gaps detected for this role."}
                  </p>
                </div>

                {/* Recommendations */}
                <div
                  className="hover-lift rounded-[28px] p-7"
                  style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: "#F6EFDB", color: "#B08B3F" }}
                    >
                      <Rocket size={18} strokeWidth={2} />
                    </div>
                    <h3 className="text-lg" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                      Recommendations
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6" style={{ color: "#4A4534" }}>
                    {result.match.missing_skills.length > 0
                      ? `Highlight transferable experience or consider upskilling in ${result.match.missing_skills[0]} before applying.`
                      : "Your profile is well aligned — tailor your resume summary to this role and apply with confidence."}
                  </p>
                </div>
              </div>
            </div>

            {/* Optimize Resume */}
            <div
              className="hover-lift rounded-[32px] p-8"
              style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
                    AI Resume Coach
                  </p>

                  <h3 className="mt-2 text-2xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                    Optimize your resume
                  </h3>

                  <p className="mt-2 text-sm" style={{ color: "#8A7F63" }}>
                    Rewrite your resume specifically for this job.
                  </p>
                </div>

                <button
                  onClick={optimizeResume}
                  disabled={optimizing}
                  className="analyze-btn rounded-full px-7 py-3 font-semibold"
                  style={{ background: "#FF5A1F", color: "#FFF" }}
                >
                  {optimizing ? "Optimizing..." : "✨ Optimize Resume"}
                </button>
              </div>
            </div>

            {optimization && (
              <div className="mt-6 grid gap-6">
                {/* Summary */}
                <div className="rounded-[28px] p-7" style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}>
                  <h3 className="text-xl" style={{ fontFamily: "'Fraunces', serif" }}>
                    AI Summary
                  </h3>

                  <p className="mt-4 leading-7">{optimization.summary}</p>
                </div>

                {/* Improved bullets */}
                <div className="rounded-[28px] p-7" style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}>
                  <h3 className="text-xl" style={{ fontFamily: "'Fraunces', serif" }}>
                    Improved Resume Bullets
                  </h3>

                  <div className="mt-6 space-y-4">
                    {optimization.improved_bullets.map((bullet) => (
                      <div key={bullet} className="rounded-xl p-4" style={{ background: "#F8F7F3" }}>
                        ✓ {bullet}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="rounded-[28px] p-7" style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}>
                  <h3 className="text-xl" style={{ fontFamily: "'Fraunces', serif" }}>
                    Missing ATS Keywords
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {optimization.missing_keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full px-4 py-2 text-sm font-medium"
                        style={{ background: "#FBEAE3", color: "#C24A1F" }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="rounded-[28px] p-7" style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: "#FFF4E8", color: "#FF5A1F" }}
                    >
                      <Rocket size={18} strokeWidth={2} />
                    </div>

                    <div>
                      <h3 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                        AI Action Plan
                      </h3>

                      <p className="text-sm" style={{ color: "#8A7F63" }}>
                        Follow these recommendations to improve your resume.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4">
                    {optimization.suggestions.map((item, index) => (
                      <div
                        key={item}
                        className="flex gap-4 rounded-2xl p-5 transition-all duration-300 hover:shadow-md"
                        style={{ background: "#FBF8F0", border: "1px solid #ECE3CD" }}
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "#FF5A1F", color: "#FFF" }}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold" style={{ color: "#1D1912" }}>
                            Recommendation {index + 1}
                          </p>

                          <p className="mt-1 leading-7" style={{ color: "#5F5748" }}>
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===================== COVER LETTER GENERATOR (NEW SECTION) ===================== */}
            <div className="mt-16">
              <div className="flex flex-col items-center text-center">
                <span
                  className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide"
                  style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", color: "#8A7F63" }}
                >
                  <Sparkles size={13} strokeWidth={2.25} style={{ color: "#FF5A1F" }} />
                  AI Cover Letter
                </span>

                <h2
                  className="text-3xl md:text-4xl"
                  style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                >
                  Generate a personalized cover letter
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm md:text-base" style={{ color: "#8A7F63" }}>
                  Create a professional cover letter tailored specifically to this job using your
                  resume and the job description.
                </p>
              </div>

              {/* Top CTA card */}
              <div
                className="hover-lift mt-8 rounded-[32px] p-8"
                style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
              >
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                      style={{ background: "#FBF8F0", color: "#FF5A1F" }}
                    >
                      <Mail size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3
                        className="text-xl"
                        style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}
                      >
                        AI Cover Letter
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: "#8A7F63" }}>
                        A ready-to-send letter, written from your resume and this role.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={generateCoverLetter}
                    disabled={generatingCoverLetter || !resumeFile || !jobDescription.trim()}
                    className="analyze-btn flex flex-shrink-0 items-center gap-2 rounded-full px-7 py-3.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none"
                    style={{ background: "#FF5A1F", color: "#FFFFFF", boxShadow: "0 8px 20px -8px rgba(255, 90, 31, 0.55)" }}
                  >
                    {generatingCoverLetter ? (
                      <>
                        <Loader2 size={17} className="animate-spin" strokeWidth={2.25} />
                        Generating Cover Letter...
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} strokeWidth={2.25} />
                        Generate Cover Letter
                      </>
                    )}
                  </button>
                </div>

                {/* Loading timeline */}
                {generatingCoverLetter && (
                  <div
                    className="fade-in mt-7 rounded-2xl p-6"
                    style={{ background: "#FBF8F0", border: "1px solid #ECE3CD" }}
                  >
                    <div className="space-y-3">
                      {COVER_LETTER_STEPS.map((step, index) => {
                        const done = index < coverLetterStep;
                        const active = index === coverLetterStep;
                        return (
                          <div key={step} className="cl-step flex items-center gap-3">
                            {done ? (
                              <CheckCircle2 size={17} strokeWidth={2.25} style={{ color: "#3E6B4F" }} />
                            ) : active ? (
                              <Loader2 size={17} className="animate-spin" strokeWidth={2.25} style={{ color: "#FF5A1F" }} />
                            ) : (
                              <span
                                className="inline-block h-[17px] w-[17px] rounded-full"
                                style={{ border: "1.5px solid #ECE3CD" }}
                              />
                            )}
                            <span
                              className="text-sm"
                              style={{
                                color: done ? "#3E6B4F" : active ? "#1D1912" : "#9C9179",
                                fontWeight: active ? 600 : 500,
                              }}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-sm italic" style={{ color: "#B08B3F" }}>
                      Generating Final Draft...
                    </p>
                  </div>
                )}

                {coverLetterError && (
                  <p className="mt-4 text-sm" style={{ color: "#C24A1F" }}>
                    {coverLetterError}
                  </p>
                )}
              </div>

              {/* Document / Empty state */}
              {coverLetter ? (
                <div className="slide-up mt-6">
                  <div
                    className="mx-auto w-full max-w-3xl rounded-[32px] p-2"
                    style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", boxShadow: "0 24px 48px -28px rgba(29,25,18,0.18)" }}
                  >
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-2 px-6 pt-5">
                      <div className="flex items-center gap-2">
                        <FileText size={16} style={{ color: "#FF5A1F" }} strokeWidth={2} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
                          Cover Letter
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyCoverLetter}
                          className="icon-btn flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ border: "1px solid #ECE3CD", color: "#5F5748" }}
                          title="Copy"
                        >
                          {copyStatus === "copied" ? (
                            <CheckCircle2 size={16} strokeWidth={2.25} style={{ color: "#3E6B4F" }} />
                          ) : (
                            <Copy size={16} strokeWidth={2} />
                          )}
                        </button>
                        <button
                          onClick={generateCoverLetter}
                          disabled={generatingCoverLetter}
                          className="icon-btn flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ border: "1px solid #ECE3CD", color: "#5F5748" }}
                          title="Regenerate"
                        >
                          <RefreshCw size={16} strokeWidth={2} />
                        </button>
                        <button
                          onClick={downloadCoverLetterTxt}
                          className="icon-btn flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ border: "1px solid #ECE3CD", color: "#5F5748" }}
                          title="Download TXT"
                        >
                          <Download size={16} strokeWidth={2} />
                        </button>
                        <button
                          disabled
                          className="flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
                          style={{ border: "1px solid #ECE3CD", color: "#9C9179" }}
                          title="Download PDF (coming soon)"
                        >
                          PDF
                        </button>
                      </div>
                    </div>

                    {/* Document body */}
                    <div className="px-8 py-8 md:px-14 md:py-12" style={{ background: "#FFFFFF" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
                        Subject
                      </p>
                      <p
                        className="mt-2 text-lg"
                        style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, color: "#1D1912" }}
                      >
                        {coverLetter.subject}
                      </p>

                      <div className="my-7 h-px w-full" style={{ background: "#ECE3CD" }} />

                      <p className="text-sm leading-7" style={{ color: "#1D1912" }}>
                        {coverLetter.greeting}
                      </p>

                      <div className="my-7 h-px w-full" style={{ background: "#ECE3CD" }} />

                      <p className="text-sm leading-7" style={{ color: "#4A4534" }}>
                        {coverLetter.introduction}
                      </p>

                      <div className="my-7 h-px w-full" style={{ background: "#ECE3CD" }} />

                      <div className="space-y-5">
                        {coverLetter.body_paragraphs.map((paragraph, index) => (
                          <p key={index} className="text-sm leading-7" style={{ color: "#4A4534" }}>
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="my-7 h-px w-full" style={{ background: "#ECE3CD" }} />

                      <p className="text-sm leading-7" style={{ color: "#1D1912" }}>
                        {coverLetter.closing}
                        <br />
                        <span className="font-medium">{coverLetter.candidate_name}</span>
                      </p>
                    </div>

                    {/* Bottom action bar */}
                    <div
                      className="flex flex-wrap items-center justify-center gap-3 rounded-b-[28px] px-6 py-4"
                      style={{ background: "#FBF8F0", borderTop: "1px solid #ECE3CD" }}
                    >
                      <button
                        onClick={copyCoverLetter}
                        className="icon-btn flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                        style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", color: "#1D1912" }}
                      >
                        <Copy size={14} strokeWidth={2} />
                        {copyStatus === "copied" ? "Copied" : "Copy Cover Letter"}
                      </button>
                      <button
                        onClick={downloadCoverLetterTxt}
                        className="icon-btn flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                        style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", color: "#1D1912" }}
                      >
                        <Download size={14} strokeWidth={2} />
                        Download
                      </button>
                      <button
                        onClick={generateCoverLetter}
                        disabled={generatingCoverLetter}
                        className="icon-btn flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                        style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", color: "#1D1912" }}
                      >
                        <RefreshCw size={14} strokeWidth={2} />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                !generatingCoverLetter && (
                  <div
                    className="fade-in mt-6 flex flex-col items-center justify-center rounded-[32px] px-8 py-16 text-center"
                    style={{ background: "#FFFFFF", border: "1.5px dashed #E1D5B4" }}
                  >
                    <div
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ background: "#FBF8F0", color: "#B08B3F" }}
                    >
                      <FileText size={26} strokeWidth={1.75} />
                    </div>
                    <h3
                      className="text-xl"
                      style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, color: "#1D1912" }}
                    >
                      No cover letter generated yet
                    </h3>
                    <p className="mt-2 max-w-sm text-sm" style={{ color: "#8A7F63" }}>
                      Generate a personalized cover letter using AI.
                    </p>
                  </div>
                )
              )}
            </div>
            {/* =================== END COVER LETTER GENERATOR =================== */}

            {/* Responsibilities */}
            {result.job.responsibilities.length > 0 && (
              <div
                className="hover-lift rounded-[28px] p-7"
                style={{ background: "#FFFFFF", border: "1px solid #ECE3CD" }}
              >
                <h3 className="text-xl" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 }}>
                  Responsibilities
                </h3>

                <ul className="mt-5 space-y-4">
                  {result.job.responsibilities.map((responsibility, index) => (
                    <li key={`${responsibility}-${index}`} className="flex gap-3">
                      <span
                        className="mt-1 flex h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: "#FF5A1F" }}
                      />
                      <span className="text-sm leading-6" style={{ color: "#4A4534" }}>
                        {responsibility}
                      </span>
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