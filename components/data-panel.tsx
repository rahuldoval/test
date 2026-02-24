"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface AcademicData {
  weightedGpa: string
  classRank: string
  apCount: string
  avgApScore: string
  ibCount: string
}

interface PersonalData {
  essay: number
  recommendation: number
  extracurricular: number
  talent: number
  character: number
}

interface BackgroundData {
  firstGen: string
  legacy: string
  religiousAffiliation: string
  volunteerHours: string
  workExperience: string
}

interface StrategyData {
  demonstratedInterest: number
  inState: string
}

const INITIAL_ACADEMIC: AcademicData = {
  weightedGpa: "",
  classRank: "",
  apCount: "",
  avgApScore: "",
  ibCount: "",
}

const INITIAL_PERSONAL: PersonalData = {
  essay: 3,
  recommendation: 3,
  extracurricular: 3,
  talent: 3,
  character: 3,
}

const INITIAL_BACKGROUND: BackgroundData = {
  firstGen: "",
  legacy: "",
  religiousAffiliation: "",
  volunteerHours: "",
  workExperience: "",
}

const INITIAL_STRATEGY: StrategyData = {
  demonstratedInterest: 3,
  inState: "",
}

/* ═══════════════════════════════════════════
   Categories
   ═══════════════════════════════════════════ */

const CATEGORIES = [
  {
    id: "basic",
    title: "Basic Profile",
    description: "Colleges, GPA, test scores — from onboarding.",
  },
  {
    id: "academic",
    title: "Academic Detail",
    description: "Weighted GPA, class rank, AP/IB courses.",
  },
  {
    id: "personal",
    title: "Personal Profile",
    description: "Self-assessed strengths on a 1–5 scale.",
  },
  {
    id: "background",
    title: "Background & Context",
    description: "First-gen, legacy, volunteer & work history.",
  },
  {
    id: "strategy",
    title: "Strategy & Engagement",
    description: "Demonstrated interest, in-state status.",
  },
]

/* ═══════════════════════════════════════════
   Shared small components
   ═══════════════════════════════════════════ */

function CompletedBadge() {
  return (
    <div className="size-8 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center">
      <svg className="size-4 text-white" viewBox="0 0 12 12" fill="none">
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={onClick}
      className="mb-5 w-fit gap-1.5"
    >
      <svg className="size-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 19l-7-7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </Button>
  )
}

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm tabular-nums font-medium text-muted-foreground">
          {value} / 5
        </span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={5}
        step={1}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  )
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => {
          if (v) onChange(v)
        }}
        variant="outline"
        className="w-full"
      >
        <ToggleGroupItem value="yes" className="flex-1">
          Yes
        </ToggleGroupItem>
        <ToggleGroupItem value="no" className="flex-1">
          No
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Category forms
   ═══════════════════════════════════════════ */

function AcademicForm({
  data,
  onChange,
  onSave,
  onBack,
}: {
  data: AcademicData
  onChange: (d: AcademicData) => void
  onSave: () => void
  onBack: () => void
}) {
  const update = (key: keyof AcademicData, val: string) =>
    onChange({ ...data, [key]: val })

  return (
    <div className="flex flex-col h-full">
      <BackButton onClick={onBack} />
      <h2 className="text-lg font-semibold mb-6">Academic Detail</h2>

      <div className="flex-1 overflow-y-auto space-y-5 pb-6">
        <div className="space-y-2">
          <Label>Weighted GPA</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="5"
            placeholder="0.0 – 5.0"
            value={data.weightedGpa}
            onChange={(e) => update("weightedGpa", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Class Rank Percentile</Label>
          <Input
            type="number"
            min="1"
            max="99"
            placeholder="1 – 99"
            value={data.classRank}
            onChange={(e) => update("classRank", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>AP Course Count</Label>
          <Input
            type="number"
            min="0"
            placeholder="Number of AP courses"
            value={data.apCount}
            onChange={(e) => update("apCount", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Average AP Score</Label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            placeholder="1.0 – 5.0"
            value={data.avgApScore}
            onChange={(e) => update("avgApScore", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>IB Course Count</Label>
          <Input
            type="number"
            min="0"
            placeholder="Number of IB courses"
            value={data.ibCount}
            onChange={(e) => update("ibCount", e.target.value)}
          />
        </div>
      </div>

      <div className="shrink-0 pt-4">
        <Button className="w-full h-11 text-sm font-medium" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

function PersonalForm({
  data,
  onChange,
  onSave,
  onBack,
}: {
  data: PersonalData
  onChange: (d: PersonalData) => void
  onSave: () => void
  onBack: () => void
}) {
  const update = (key: keyof PersonalData, val: number) =>
    onChange({ ...data, [key]: val })

  return (
    <div className="flex flex-col h-full">
      <BackButton onClick={onBack} />
      <h2 className="text-lg font-semibold mb-6">Personal Profile</h2>

      <div className="flex-1 overflow-y-auto space-y-6 pb-6">
        <RatingField
          label="Essay Strength"
          value={data.essay}
          onChange={(v) => update("essay", v)}
        />
        <RatingField
          label="Recommendation Strength"
          value={data.recommendation}
          onChange={(v) => update("recommendation", v)}
        />
        <RatingField
          label="Extracurricular Strength"
          value={data.extracurricular}
          onChange={(v) => update("extracurricular", v)}
        />
        <RatingField
          label="Talent Strength"
          value={data.talent}
          onChange={(v) => update("talent", v)}
        />
        <RatingField
          label="Character Strength"
          value={data.character}
          onChange={(v) => update("character", v)}
        />
      </div>

      <div className="shrink-0 pt-4">
        <Button className="w-full h-11 text-sm font-medium" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

function BackgroundForm({
  data,
  onChange,
  onSave,
  onBack,
}: {
  data: BackgroundData
  onChange: (d: BackgroundData) => void
  onSave: () => void
  onBack: () => void
}) {
  const update = (key: keyof BackgroundData, val: string) =>
    onChange({ ...data, [key]: val })

  return (
    <div className="flex flex-col h-full">
      <BackButton onClick={onBack} />
      <h2 className="text-lg font-semibold mb-6">Background & Context</h2>

      <div className="flex-1 overflow-y-auto space-y-5 pb-6">
        <YesNoField
          label="First-Generation Student"
          value={data.firstGen}
          onChange={(v) => update("firstGen", v)}
        />
        <YesNoField
          label="Legacy Status"
          value={data.legacy}
          onChange={(v) => update("legacy", v)}
        />
        <div className="space-y-2">
          <Label>Religious Affiliation</Label>
          <Input
            placeholder="Optional"
            value={data.religiousAffiliation}
            onChange={(e) => update("religiousAffiliation", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Volunteer Hours</Label>
          <Input
            type="number"
            min="0"
            placeholder="Total hours"
            value={data.volunteerHours}
            onChange={(e) => update("volunteerHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Work Experience</Label>
          <Input
            type="number"
            min="0"
            placeholder="Months"
            value={data.workExperience}
            onChange={(e) => update("workExperience", e.target.value)}
          />
        </div>
      </div>

      <div className="shrink-0 pt-4">
        <Button className="w-full h-11 text-sm font-medium" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

function StrategyForm({
  data,
  onChange,
  onSave,
  onBack,
}: {
  data: StrategyData
  onChange: (d: StrategyData) => void
  onSave: () => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <BackButton onClick={onBack} />
      <h2 className="text-lg font-semibold mb-6">Strategy & Engagement</h2>

      <div className="flex-1 overflow-y-auto space-y-6 pb-6">
        <RatingField
          label="Demonstrated Interest"
          value={data.demonstratedInterest}
          onChange={(v) => onChange({ ...data, demonstratedInterest: v })}
        />
        <YesNoField
          label="In-State Status"
          value={data.inState}
          onChange={(v) => onChange({ ...data, inState: v })}
        />
      </div>

      <div className="shrink-0 pt-4">
        <Button className="w-full h-11 text-sm font-medium" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main DataPanel
   ═══════════════════════════════════════════ */

export function DataPanel({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [filled, setFilled] = useState<Set<string>>(new Set(["basic"]))

  const [academic, setAcademic] = useState<AcademicData>(INITIAL_ACADEMIC)
  const [personal, setPersonal] = useState<PersonalData>(INITIAL_PERSONAL)
  const [background, setBackground] = useState<BackgroundData>(INITIAL_BACKGROUND)
  const [strategy, setStrategy] = useState<StrategyData>(INITIAL_STRATEGY)

  const handleSave = (categoryId: string) => {
    setFilled((prev) => new Set([...prev, categoryId]))
    setActiveCategory(null)
  }

  const handleBack = () => setActiveCategory(null)

  const handleOpenChange = (next: boolean) => {
    if (!next) setActiveCategory(null)
    onOpenChange(next)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={!activeCategory}
        overlayClassName="bg-black/12 supports-backdrop-filter:backdrop-blur-md"
        className={cn(
          "data-[side=right]:sm:max-w-[640px]",
          "data-[side=right]:top-3 data-[side=right]:right-3 data-[side=right]:bottom-3 data-[side=right]:h-[calc(100vh-24px)] data-[side=right]:rounded-xl"
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* ── Listing view ── */}
        {!activeCategory && (
          <div className="flex flex-col h-full p-6">
            <SheetHeader className="p-0 mb-2">
              <SheetTitle className="text-lg font-semibold">
                Add Your Data
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              {CATEGORIES.map((cat, i) => {
                const isFilled = filled.has(cat.id)
                const isBasic = cat.id === "basic"

                return (
                  <div key={cat.id}>
                    <div
                      className={cn(
                        "flex items-center gap-4 py-5",
                        !isBasic && "cursor-pointer group"
                      )}
                      onClick={() => {
                        if (!isBasic) setActiveCategory(cat.id)
                      }}
                    >
                      <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold group-hover:text-foreground transition-colors">
                          {cat.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      {isFilled ? (
                        <CompletedBadge />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveCategory(cat.id)
                          }}
                        >
                          Add data
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Detail / form view ── */}
        {activeCategory && (
          <div className="animate-blur-in flex flex-col h-full p-6">
            {activeCategory === "academic" && (
              <AcademicForm
                data={academic}
                onChange={setAcademic}
                onSave={() => handleSave("academic")}
                onBack={handleBack}
              />
            )}
            {activeCategory === "personal" && (
              <PersonalForm
                data={personal}
                onChange={setPersonal}
                onSave={() => handleSave("personal")}
                onBack={handleBack}
              />
            )}
            {activeCategory === "background" && (
              <BackgroundForm
                data={background}
                onChange={setBackground}
                onSave={() => handleSave("background")}
                onBack={handleBack}
              />
            )}
            {activeCategory === "strategy" && (
              <StrategyForm
                data={strategy}
                onChange={setStrategy}
                onSave={() => handleSave("strategy")}
                onBack={handleBack}
              />
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
