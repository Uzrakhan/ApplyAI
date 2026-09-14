"use client";

import { useState } from "react";
import { Sparkles, X, Plus, ChevronDown } from "lucide-react";

type EmploymentType = "Full-time" | "Part-time" | "Internship" | "Contract";
type WorkMode = "On-site" | "Hybrid" | "Remote";

const EMPLOYMENT_OPTIONS: EmploymentType[] = ["Full-time", "Part-time", "Internship", "Contract"];
const WORK_MODE_OPTIONS: WorkMode[] = ["On-site", "Hybrid", "Remote"];
const EXPERIENCE_OPTIONS = [
  "Fresher / 0–2 years",
  "2–4 years",
  "4–7 years",
  "7–10 years",
  "10+ years",
];

function TagInput({
  label,
  tags,
  setTags,
  placeholder,
  accentBg = "#FBF8F0",
  accentColor = "#1D1912",
  accentBorder = "#ECE3CD",
}: {
  label: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  accentBg?: string;
  accentColor?: string;
  accentBorder?: string;
}) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  function commit() {
    const value = draft.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setDraft("");
    setAdding(false);
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium"
            style={{ background: accentBg, color: accentColor, border: `1px solid ${accentBorder}` }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="flex h-4 w-4 items-center justify-center rounded-full transition-opacity hover:opacity-70"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </span>
        ))}

        {adding ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            onBlur={commit}
            placeholder={placeholder}
            className="field-input rounded-full px-3.5 py-1.5 text-sm outline-none"
            style={{ border: "1.5px solid #FF5A1F", background: "#FFFFFF", color: "#1D1912", minWidth: 140 }}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="icon-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium"
            style={{ border: "1.5px dashed #E1D5B4", color: "#8A7F63", background: "transparent" }}
          >
            <Plus size={13} strokeWidth={2.25} />
            Add {label.toLowerCase().replace(/s$/, "")}
          </button>
        )}
      </div>
    </div>
  );
}

function PillCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
      style={{
        background: checked ? "#1D1912" : "#FFFFFF",
        color: checked ? "#FFFFFF" : "#8A7F63",
        border: `1.5px solid ${checked ? "#1D1912" : "#ECE3CD"}`,
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          background: checked ? "#FF5A1F" : "transparent",
          border: checked ? "none" : "1.5px solid #E1D5B4",
          color: "#FFFFFF",
        }}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

export default function JobPreferences() {
  const [roles, setRoles] = useState<string[]>(["Frontend Developer", "Full Stack Developer"]);
  const [locations, setLocations] = useState<string[]>(["Noida", "Gurgaon", "Remote"]);
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Python"]);
  const [excluded, setExcluded] = useState<string[]>(["Night shift", "Unpaid"]);

  const [employmentTypes, setEmploymentTypes] = useState<Set<EmploymentType>>(
    new Set(["Full-time", "Internship"])
  );
  const [workModes, setWorkModes] = useState<Set<WorkMode>>(
    new Set(["On-site", "Hybrid", "Remote"])
  );

  const [minSalary, setMinSalary] = useState("4,00,000");
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[0]);
  const [experienceOpen, setExperienceOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleSet<T>(set: Set<T>, setSet: (s: Set<T>) => void, value: T) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setSet(next);
  }

  function handleSalaryChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) {
      setMinSalary("");
      return;
    }
    setMinSalary(new Intl.NumberFormat("en-IN").format(Number(digits)));
  }

  function savePreferences() {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }, 700);
  }

  return (
    <div
      className="hover-lift rounded-[32px] p-8"
      style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", boxShadow: "0 2px 8px -4px rgba(29,25,18,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ background: "#FBF8F0", color: "#FF5A1F" }}
        >
          <Sparkles size={18} strokeWidth={2} />
        </div>
        <div>
          <h2
            className="text-xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, color: "#1D1912" }}
          >
            Your job search
          </h2>
          <p className="text-sm" style={{ color: "#8A7F63" }}>
            Tell ApplyAI what kind of opportunities you&apos;re looking for.
          </p>
        </div>
      </div>

      <div className="my-7 h-px w-full" style={{ background: "#ECE3CD" }} />

      <div className="space-y-8">
        {/* Target roles */}
        <TagInput
          label="Target roles"
          tags={roles}
          setTags={setRoles}
          placeholder="e.g. Backend Developer"
          accentBg="#FFF4E8"
          accentColor="#B0470F"
          accentBorder="#F3D3B8"
        />

        {/* Locations */}
        <TagInput
          label="Locations"
          tags={locations}
          setTags={setLocations}
          placeholder="e.g. Bengaluru"
          accentBg="#FBF8F0"
          accentColor="#1D1912"
          accentBorder="#ECE3CD"
        />

        {/* Employment type */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
            Employment type
          </p>
          <div className="flex flex-wrap gap-2.5">
            {EMPLOYMENT_OPTIONS.map((option) => (
              <PillCheckbox
                key={option}
                label={option}
                checked={employmentTypes.has(option)}
                onChange={() => toggleSet(employmentTypes, setEmploymentTypes, option)}
              />
            ))}
          </div>
        </div>

        {/* Work mode */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
            Work mode
          </p>
          <div className="flex flex-wrap gap-2.5">
            {WORK_MODE_OPTIONS.map((option) => (
              <PillCheckbox
                key={option}
                label={option}
                checked={workModes.has(option)}
                onChange={() => toggleSet(workModes, setWorkModes, option)}
              />
            ))}
          </div>
        </div>

        {/* Salary + Experience row */}
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
              Minimum salary
            </p>
            <div
              className="field-input flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{ border: "1.5px solid #ECE3CD", background: "#FBF8F0" }}
            >
              <span className="text-sm font-semibold" style={{ color: "#8A7F63" }}>
                ₹
              </span>
              <input
                value={minSalary}
                onChange={(e) => handleSalaryChange(e.target.value)}
                inputMode="numeric"
                placeholder="0"
                className="w-full bg-transparent text-sm font-medium outline-none"
                style={{ color: "#1D1912" }}
              />
              <span className="whitespace-nowrap text-sm" style={{ color: "#9C9179" }}>
                / year
              </span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#B08B3F" }}>
              Experience
            </p>
            <div className="relative">
              <button
                onClick={() => setExperienceOpen((v) => !v)}
                className="field-input flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium"
                style={{ border: "1.5px solid #ECE3CD", background: "#FBF8F0", color: "#1D1912" }}
              >
                {experience}
                <ChevronDown
                  size={16}
                  strokeWidth={2.25}
                  style={{
                    color: "#8A7F63",
                    transform: experienceOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                />
              </button>

              {experienceOpen && (
                <div
                  className="fade-in absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-2xl"
                  style={{ background: "#FFFFFF", border: "1px solid #ECE3CD", boxShadow: "0 16px 32px -16px rgba(29,25,18,0.2)" }}
                >
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setExperience(option);
                        setExperienceOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm transition-colors"
                      style={{
                        background: option === experience ? "#FBF8F0" : "transparent",
                        color: option === experience ? "#FF5A1F" : "#1D1912",
                        fontWeight: option === experience ? 600 : 500,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <TagInput
          label="Skills"
          tags={skills}
          setTags={setSkills}
          placeholder="e.g. Node.js"
          accentBg="#E7F0E4"
          accentColor="#3E6B4F"
          accentBorder="#CFE3C9"
        />

        {/* Don't show me */}
        <TagInput
          label="Don't show me"
          tags={excluded}
          setTags={setExcluded}
          placeholder="e.g. Contract roles"
          accentBg="#FBEAE3"
          accentColor="#C24A1F"
          accentBorder="#F0B9A0"
        />
      </div>

      {/* Save */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="analyze-btn flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "#FF5A1F", color: "#FFFFFF", boxShadow: "0 8px 20px -8px rgba(255, 90, 31, 0.55)" }}
        >
          {saving ? "Saving..." : saved ? "✓ Preferences saved" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}