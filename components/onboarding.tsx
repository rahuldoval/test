"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const COLLEGES = [
  { value: "mit", label: "MIT", domain: "mit.edu" },
  { value: "stanford", label: "Stanford University", domain: "stanford.edu" },
  { value: "harvard", label: "Harvard University", domain: "harvard.edu" },
  { value: "caltech", label: "Caltech", domain: "caltech.edu" },
  { value: "princeton", label: "Princeton University", domain: "princeton.edu" },
  { value: "yale", label: "Yale University", domain: "yale.edu" },
  { value: "columbia", label: "Columbia University", domain: "columbia.edu" },
  { value: "upenn", label: "UPenn", domain: "upenn.edu" },
  { value: "duke", label: "Duke University", domain: "duke.edu" },
  { value: "brown", label: "Brown University", domain: "brown.edu" },
  { value: "dartmouth", label: "Dartmouth College", domain: "dartmouth.edu" },
  { value: "cornell", label: "Cornell University", domain: "cornell.edu" },
  { value: "jhu", label: "Johns Hopkins", domain: "jhu.edu" },
  { value: "northwestern", label: "Northwestern", domain: "northwestern.edu" },
  { value: "rice", label: "Rice University", domain: "rice.edu" },
  { value: "vanderbilt", label: "Vanderbilt", domain: "vanderbilt.edu" },
  { value: "washu", label: "WashU", domain: "wustl.edu" },
  { value: "emory", label: "Emory University", domain: "emory.edu" },
  { value: "georgetown", label: "Georgetown", domain: "georgetown.edu" },
  { value: "ucberkeley", label: "UC Berkeley", domain: "berkeley.edu" },
  { value: "ucla", label: "UCLA", domain: "ucla.edu" },
  { value: "umich", label: "UMich", domain: "umich.edu" },
  { value: "nyu", label: "NYU", domain: "nyu.edu" },
  { value: "cmu", label: "Carnegie Mellon", domain: "cmu.edu" },
  { value: "usc", label: "USC", domain: "usc.edu" },
  { value: "gatech", label: "Georgia Tech", domain: "gatech.edu" },
  { value: "uva", label: "UVA", domain: "virginia.edu" },
  { value: "notredame", label: "Notre Dame", domain: "nd.edu" },
  { value: "tufts", label: "Tufts University", domain: "tufts.edu" },
  { value: "wakeforest", label: "Wake Forest", domain: "wfu.edu" },
]

/* Height of the center-aligned content box (step 1 & 2). Matches full step-2 form height. */
const CONTENT_BOX_HEIGHT = 1100

interface StudentProfile {
  colleges: string[]
  gpa: number
  testType: "sat" | "act" | null
  testScore: number | null
  apCourses: number | null
  applicationRound: string
  classRank: number | null
}

/* ── Blur-in field wrapper ── */
function FieldBlock({
  visible,
  children,
  className,
  innerRef,
}: {
  visible: boolean
  children: React.ReactNode
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
}) {
  if (!visible) return null
  return (
    <div ref={innerRef} className={cn("w-full animate-blur-in", className)}>
      {children}
    </div>
  )
}

/* ── College card ── */
function CollegeCard({
  college,
  selected,
  onToggle,
  index,
}: {
  college: (typeof COLLEGES)[number]
  selected: boolean
  onToggle: () => void
  index: number
}) {
  const [imgError, setImgError] = useState(false)
  const initials = college.label
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "animate-blur-in flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all",
        selected
          ? "border-foreground bg-foreground/[0.03]"
          : "border-border hover:border-foreground/20"
      )}
      style={{ animationDelay: `${index * 10}ms` }}
    >
      <div className="size-7 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
        {imgError ? (
          <span className="text-[9px] font-semibold text-muted-foreground leading-none">
            {initials}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://logo.clearbit.com/${college.domain}`}
            alt=""
            loading="lazy"
            className="size-full object-contain p-0.5"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="text-sm font-medium truncate flex-1">
        {college.label}
      </span>
      {selected && (
        <div className="size-4 shrink-0 rounded-full bg-foreground flex items-center justify-center">
          <svg className="size-2.5 text-background" viewBox="0 0 12 12" fill="none">
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  )
}

/* ── Logo: top-left placement ── */
function Logo() {
  return (
    <div
      className="absolute left-4 top-4 z-20 size-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm"
      aria-hidden
    >
      C
    </div>
  )
}

/* ── Stepper: two dots, current step highlighted ── */
function Stepper({ currentStep }: { currentStep: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div
        className={cn(
          "rounded-full transition-colors",
          currentStep === 1 ? "size-2.5 bg-primary" : "size-2 bg-primary/30"
        )}
      />
      <div
        className={cn(
          "rounded-full transition-colors",
          currentStep === 2 ? "size-2.5 bg-primary" : "size-2 bg-muted-foreground/30"
        )}
      />
    </div>
  )
}

/* ── Right panel: big image / visual (50% inside island), rounded on all four sides ── */
function RightPanel() {
  return (
    <div
      className="hidden lg:flex flex-1 min-w-0 h-full rounded-2xl overflow-hidden"
      aria-hidden
    >
      <div
        className="w-full h-full"
        style={{
          background:
            "linear-gradient(180deg, #e8ecf7 0%, #ede8f2 35%, #f5e4ec 65%, #fce8e4 100%)",
        }}
      />
    </div>
  )
}

/* ── Main onboarding ── */
export function Onboarding() {
  const [step, setStep] = useState(1)
  const [colleges, setColleges] = useState<string[]>([])
  const [collegeQuery, setCollegeQuery] = useState("")
  const [gpa, setGpa] = useState("")
  const [testType, setTestType] = useState<string>("")
  const [testScore, setTestScore] = useState("")
  const [apCount, setApCount] = useState("")
  const [appRound, setAppRound] = useState("rd")
  const [classRank, setClassRank] = useState("")
  const [visibleFields, setVisibleFields] = useState(1)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const revealField = useCallback((n: number) => {
    setVisibleFields(prev => Math.max(prev, n))
  }, [])

  useEffect(() => {
    if (visibleFields <= 1) return
    const el = fieldRefs.current[visibleFields - 1]
    if (!el) return
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 120)
    return () => clearTimeout(timer)
  }, [visibleFields])

  const toggleCollege = (value: string) => {
    setColleges(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : prev.length < 5
          ? [...prev, value]
          : prev
    )
  }

  const filteredColleges = COLLEGES.filter(c =>
    c.label.toLowerCase().includes(collegeQuery.toLowerCase())
  )

  const getCollegeLabel = (value: string) =>
    COLLEGES.find(c => c.value === value)?.label ?? value

  const gpaNum = parseFloat(gpa)
  const isGpaValid = gpa !== "" && !isNaN(gpaNum) && gpaNum >= 0 && gpaNum <= 4
  const isCtaEnabled = colleges.length > 0 && isGpaValid


  /* ─────────────────────────────────────────── */
  /*  Step 1 — College Selection                 */
  /* ─────────────────────────────────────────── */
  if (step === 1) {
    return (
      <div className="h-screen flex flex-col bg-background pt-3 pr-3 pb-3 relative">
        <Logo />
        {/* Island: 50-50, rounded, 12px from top/right/bottom */}
        <div className="flex-1 flex min-h-0 rounded-2xl overflow-hidden">
        {/* Left: center-aligned fixed-height box. Heading top, button bottom. */}
        <div className="flex-1 flex flex-col items-center justify-center bg-background h-full min-w-0 overflow-hidden">
        <div
          className="w-full max-w-[520px] flex flex-col overflow-hidden"
          style={{ height: CONTENT_BOX_HEIGHT }}
        >
          <header className="shrink-0 px-8 lg:px-12 pt-20 pb-6 bg-background text-center">
            <Stepper currentStep={1} />
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Pick your dream schools.
            </h1>
            <p className="text-xl text-muted-foreground mt-1.5">
              Select up to 5 colleges you&apos;re considering.
            </p>
          </header>

          <div className="relative flex-1 min-h-0 w-full max-h-[380px]">
            <div className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none bg-gradient-to-b from-background to-transparent" />
            <div
              key="step-1"
              className="h-full overflow-y-auto px-8 lg:px-12 py-6 flex flex-col items-center"
            >
              <div className="w-full max-w-[520px] mb-4">
                <Input
                  placeholder="Search colleges…"
                  value={collegeQuery}
                  onChange={e => setCollegeQuery(e.target.value)}
                />
              </div>
              {colleges.length > 0 && (
                <p className="text-xs text-muted-foreground mb-3">
                  {colleges.length} of 5 selected
                </p>
              )}
              <div className="w-full max-w-[520px] grid grid-cols-2 gap-2 pb-4">
                {filteredColleges.map((c, i) => (
                  <CollegeCard
                    key={c.value}
                    college={c}
                    selected={colleges.includes(c.value)}
                    onToggle={() => toggleCollege(c.value)}
                    index={i}
                  />
                ))}
              </div>
              {filteredColleges.length === 0 && (
                <p className="text-sm text-muted-foreground py-8">
                  No colleges match your search.
                </p>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="shrink-0 w-full max-w-[520px] px-8 lg:px-12 pt-4 pb-8">
            <Button
              className="w-full h-11 text-sm font-medium"
              disabled={colleges.length === 0}
              onClick={() => {
                setStep(2)
                window.scrollTo({ top: 0 })
              }}
            >
              Next
            </Button>
          </div>
        </div>
        </div>

          <RightPanel />
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────── */
  /*  Step 2 — Academic Profile                  */
  /* ─────────────────────────────────────────── */
  return (
    <div className="h-screen flex flex-col bg-background pt-3 pr-3 pb-3 relative">
      <Logo />
      {/* Island: 50-50, rounded, 12px from top/right/bottom */}
      <div className="flex-1 flex min-h-0 rounded-2xl overflow-hidden">
        {/* Left: same center-aligned fixed-height box. Content starts from top. */}
        <div className="flex-1 flex flex-col items-center justify-center bg-background h-full min-w-0">
        <div
          className="w-full max-w-[520px] flex flex-col overflow-y-auto py-0 px-10"
          style={{ height: CONTENT_BOX_HEIGHT }}
        >
          <header className="shrink-0 pt-20 pb-6 text-center">
            <Stepper currentStep={2} />
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Now, tell us about you.
            </h1>
            <p className="text-xl text-muted-foreground mt-1.5 mb-4">
              Add your academic details.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {colleges.map(v => (
                <Badge key={v} variant="secondary">
                  {getCollegeLabel(v)}
                </Badge>
              ))}
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
                onClick={() => setStep(1)}
              >
                Change
              </button>
            </div>
          </header>

          <div className="flex-1 min-h-0 flex flex-col gap-5 pb-5 min-w-0">
            <FieldBlock
            visible
            innerRef={el => { fieldRefs.current[0] = el }}
          >
            <div className="space-y-2">
              <Label>GPA</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="0.0 – 4.0"
                value={gpa}
                onChange={e => setGpa(e.target.value)}
                onFocus={() => revealField(2)}
              />
              {gpa && !isGpaValid && (
                <p className="text-xs text-destructive">
                  Please enter a valid GPA between 0.0 and 4.0
                </p>
              )}
            </div>
          </FieldBlock>

          {/* ── Test Score ── */}
          <FieldBlock
            visible={visibleFields >= 2}
            innerRef={el => { fieldRefs.current[1] = el }}
          >
            <div className="space-y-2">
              <Label>Test Score</Label>
              <ToggleGroup
                type="single"
                value={testType}
                onValueChange={val => {
                  setTestType(val)
                  setTestScore("")
                  if (val) revealField(3)
                }}
                variant="outline"
                className="w-full"
              >
                <ToggleGroupItem value="sat" className="flex-1">SAT</ToggleGroupItem>
                <ToggleGroupItem value="act" className="flex-1">ACT</ToggleGroupItem>
              </ToggleGroup>

              {testType === "sat" && (
                <div className="animate-blur-in mt-5">
                  <Input
                    type="number"
                    min="400"
                    max="1600"
                    placeholder="SAT composite (400–1600)"
                    value={testScore}
                    onChange={e => setTestScore(e.target.value)}
                  />
                </div>
              )}

              {testType === "act" && (
                <div className="animate-blur-in mt-5">
                  <Input
                    type="number"
                    min="1"
                    max="36"
                    placeholder="ACT composite (1–36)"
                    value={testScore}
                    onChange={e => setTestScore(e.target.value)}
                  />
                </div>
              )}
            </div>
          </FieldBlock>

          {/* ── AP Courses ── */}
          <FieldBlock
            visible={visibleFields >= 3}
            innerRef={el => { fieldRefs.current[2] = el }}
          >
            <div className="space-y-2">
              <Label>AP Courses</Label>
              <Input
                type="number"
                min="0"
                placeholder="Number of AP courses taken"
                value={apCount}
                onChange={e => setApCount(e.target.value)}
                onFocus={() => revealField(4)}
              />
            </div>
          </FieldBlock>

          {/* ── Application Round ── */}
          <FieldBlock
            visible={visibleFields >= 4}
            innerRef={el => { fieldRefs.current[3] = el }}
          >
            <div className="space-y-2" onFocus={() => revealField(5)}>
              <Label>Application Round</Label>
              <ToggleGroup
                type="single"
                value={appRound}
                onValueChange={val => {
                  if (val) setAppRound(val)
                  revealField(5)
                }}
                variant="outline"
                className="w-full"
              >
                <ToggleGroupItem value="rd" className="flex-1">RD</ToggleGroupItem>
                <ToggleGroupItem value="ed1" className="flex-1">ED I</ToggleGroupItem>
                <ToggleGroupItem value="ed2" className="flex-1">ED II</ToggleGroupItem>
                <ToggleGroupItem value="ea" className="flex-1">EA</ToggleGroupItem>
                <ToggleGroupItem value="rea" className="flex-1">REA</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </FieldBlock>

          {/* ── Class Rank ── */}
          <FieldBlock
            visible={visibleFields >= 5}
            innerRef={el => { fieldRefs.current[4] = el }}
          >
            <div className="space-y-2">
              <Label>Class Rank</Label>
              <Input
                type="number"
                min="1"
                max="99"
                placeholder="Percentile (1–99)"
                value={classRank}
                onChange={e => setClassRank(e.target.value)}
              />
            </div>
          </FieldBlock>

          {/* CTA — 20px below last field */}
          <div className="mt-5 pb-8 space-y-3">
            {isCtaEnabled ? (
              <Button asChild className="w-full h-11 text-sm font-medium">
                <Link href="/dashboard">See My Chances</Link>
              </Button>
            ) : (
              <Button className="w-full h-11 text-sm font-medium" disabled>
                See My Chances
              </Button>
            )}
          </div>
          </div>

        </div>
        </div>

        <RightPanel />
      </div>
    </div>
  )
}
