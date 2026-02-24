/**
 * Mock data for the Chance Me dashboard (frontend prototype).
 *
 * HANDOFF: Replace this with your API/backend.
 * - Fetch user's selected colleges and their chance data.
 * - Keep the same shape as CollegeData so the dashboard components keep working.
 * - See HANDOFF.md for data contract and hook points.
 */

export type Classification = "Far Reach" | "Reach" | "Target" | "Safety"
export type Confidence = "Basic Estimate" | "Solid Estimate" | "High Confidence"
export type InputLevel = "basic" | "partial" | "full"

export interface PillarScore {
  score: number
  weight: number
}

export interface SensitivityFactor {
  label: string
  delta: number
}

export interface FactorScore {
  label: string
  score: number | null
  importance: "High" | "Medium" | "Low"
  binary?: boolean
  binaryValue?: boolean
}

export interface CollegeData {
  value: string
  label: string
  domain: string
  acceptanceRate: number
  testPolicy: string
  rounds: string[]
  chance: number
  chanceRange: [number, number]
  classification: Classification
  confidence: Confidence
  inputLevel: InputLevel
  pillars: {
    academic: PillarScore
    personal: PillarScore
    hooks: PillarScore
  }
  sensitivity: SensitivityFactor[]
  trendData: { date: Date; chance: number }[]
  breakdown: {
    academic: FactorScore[]
    personal: FactorScore[]
    hooks: FactorScore[]
  }
}

function generateTrend(base: number): { date: Date; chance: number }[] {
  const offsets = [-1.2, 0.8, 2.1, -0.5, 1.6, 3.0, 0.3, -1.8, 2.4, 1.1, -0.9, 1.7]
  return offsets.map((n, i) => ({
    date: new Date(2025, i, 1),
    chance: Math.max(1, Math.min(99, base + n)),
  }))
}

export const COLLEGE_DATA: CollegeData[] = [
  {
    value: "mit",
    label: "MIT",
    domain: "mit.edu",
    acceptanceRate: 3.96,
    testPolicy: "Test Flexible",
    rounds: ["EA", "RD"],
    chance: 12,
    chanceRange: [8, 18],
    classification: "Far Reach",
    confidence: "Solid Estimate",
    inputLevel: "full",
    pillars: { academic: { score: 88, weight: 35 }, personal: { score: 72, weight: 40 }, hooks: { score: 45, weight: 25 } },
    sensitivity: [
      { label: "Apply EA", delta: 4 },
      { label: "Improve EC strength", delta: 3 },
      { label: "Strong research experience", delta: 2 },
    ],
    trendData: generateTrend(12),
    breakdown: {
      academic: [
        { label: "GPA", score: 92, importance: "High" },
        { label: "Test Score", score: 85, importance: "High" },
        { label: "Class Rank", score: 90, importance: "Medium" },
        { label: "Course Rigor", score: 88, importance: "High" },
      ],
      personal: [
        { label: "Essays", score: 70, importance: "High" },
        { label: "Recommendations", score: 75, importance: "Medium" },
        { label: "Extracurriculars", score: 68, importance: "High" },
        { label: "Talent / Spike", score: 80, importance: "High" },
        { label: "Character", score: 72, importance: "Medium" },
      ],
      hooks: [
        { label: "First-gen", score: null, importance: "Medium", binary: true, binaryValue: false },
        { label: "Legacy", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "In-state", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "Volunteer / Work", score: 55, importance: "Low" },
        { label: "Demonstrated Interest", score: 40, importance: "Medium" },
      ],
    },
  },
  {
    value: "stanford",
    label: "Stanford University",
    domain: "stanford.edu",
    acceptanceRate: 3.68,
    testPolicy: "Test Optional",
    rounds: ["REA", "RD"],
    chance: 9,
    chanceRange: [5, 14],
    classification: "Far Reach",
    confidence: "Solid Estimate",
    inputLevel: "full",
    pillars: { academic: { score: 90, weight: 30 }, personal: { score: 65, weight: 45 }, hooks: { score: 38, weight: 25 } },
    sensitivity: [
      { label: "Apply REA", delta: 5 },
      { label: "Improve essay quality", delta: 3 },
      { label: "Add leadership roles", delta: 2 },
    ],
    trendData: generateTrend(9),
    breakdown: {
      academic: [
        { label: "GPA", score: 94, importance: "High" },
        { label: "Test Score", score: 88, importance: "Medium" },
        { label: "Class Rank", score: 85, importance: "Medium" },
        { label: "Course Rigor", score: 90, importance: "High" },
      ],
      personal: [
        { label: "Essays", score: 62, importance: "High" },
        { label: "Recommendations", score: 70, importance: "Medium" },
        { label: "Extracurriculars", score: 60, importance: "High" },
        { label: "Talent / Spike", score: 72, importance: "High" },
        { label: "Character", score: 68, importance: "Medium" },
      ],
      hooks: [
        { label: "First-gen", score: null, importance: "Medium", binary: true, binaryValue: false },
        { label: "Legacy", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "In-state", score: null, importance: "Low", binary: true, binaryValue: true },
        { label: "Volunteer / Work", score: 48, importance: "Low" },
        { label: "Demonstrated Interest", score: 35, importance: "Medium" },
      ],
    },
  },
  {
    value: "harvard",
    label: "Harvard University",
    domain: "harvard.edu",
    acceptanceRate: 3.41,
    testPolicy: "Test Optional",
    rounds: ["REA", "RD"],
    chance: 7,
    chanceRange: [4, 12],
    classification: "Far Reach",
    confidence: "Basic Estimate",
    inputLevel: "basic",
    pillars: { academic: { score: 86, weight: 30 }, personal: { score: 68, weight: 40 }, hooks: { score: 42, weight: 30 } },
    sensitivity: [
      { label: "Apply REA", delta: 5 },
      { label: "Stronger essay narrative", delta: 3 },
      { label: "Add research experience", delta: 2 },
    ],
    trendData: generateTrend(7),
    breakdown: {
      academic: [
        { label: "GPA", score: 90, importance: "High" },
        { label: "Test Score", score: 82, importance: "High" },
        { label: "Class Rank", score: 88, importance: "Medium" },
        { label: "Course Rigor", score: 85, importance: "High" },
      ],
      personal: [
        { label: "Essays", score: 65, importance: "High" },
        { label: "Recommendations", score: 72, importance: "Medium" },
        { label: "Extracurriculars", score: 60, importance: "High" },
        { label: "Talent / Spike", score: 75, importance: "High" },
        { label: "Character", score: 70, importance: "Medium" },
      ],
      hooks: [
        { label: "First-gen", score: null, importance: "Medium", binary: true, binaryValue: false },
        { label: "Legacy", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "In-state", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "Volunteer / Work", score: 50, importance: "Low" },
        { label: "Demonstrated Interest", score: 38, importance: "Medium" },
      ],
    },
  },
  {
    value: "cornell",
    label: "Cornell University",
    domain: "cornell.edu",
    acceptanceRate: 8.7,
    testPolicy: "Test Optional",
    rounds: ["ED", "RD"],
    chance: 32,
    chanceRange: [25, 40],
    classification: "Reach",
    confidence: "Solid Estimate",
    inputLevel: "partial",
    pillars: { academic: { score: 82, weight: 40 }, personal: { score: 60, weight: 35 }, hooks: { score: 50, weight: 25 } },
    sensitivity: [
      { label: "Apply ED", delta: 8 },
      { label: "Improve GPA", delta: 3 },
    ],
    trendData: generateTrend(32),
    breakdown: {
      academic: [
        { label: "GPA", score: 82, importance: "High" },
        { label: "Test Score", score: 78, importance: "High" },
        { label: "Class Rank", score: 75, importance: "Medium" },
        { label: "Course Rigor", score: 80, importance: "High" },
      ],
      personal: [
        { label: "Essays", score: 58, importance: "High" },
        { label: "Recommendations", score: 65, importance: "Medium" },
        { label: "Extracurriculars", score: 55, importance: "High" },
        { label: "Talent / Spike", score: 60, importance: "Medium" },
        { label: "Character", score: 62, importance: "Low" },
      ],
      hooks: [
        { label: "First-gen", score: null, importance: "Medium", binary: true, binaryValue: true },
        { label: "Legacy", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "In-state", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "Volunteer / Work", score: 60, importance: "Low" },
        { label: "Demonstrated Interest", score: 55, importance: "Medium" },
      ],
    },
  },
  {
    value: "rice",
    label: "Rice University",
    domain: "rice.edu",
    acceptanceRate: 8.56,
    testPolicy: "Test Optional",
    rounds: ["ED", "RD"],
    chance: 48,
    chanceRange: [38, 58],
    classification: "Target",
    confidence: "High Confidence",
    inputLevel: "full",
    pillars: { academic: { score: 85, weight: 40 }, personal: { score: 70, weight: 35 }, hooks: { score: 62, weight: 25 } },
    sensitivity: [
      { label: "Apply ED", delta: 10 },
      { label: "Improve demonstrated interest", delta: 4 },
      { label: "Add volunteer hours", delta: 2 },
    ],
    trendData: generateTrend(48),
    breakdown: {
      academic: [
        { label: "GPA", score: 88, importance: "High" },
        { label: "Test Score", score: 82, importance: "High" },
        { label: "Class Rank", score: 80, importance: "Medium" },
        { label: "Course Rigor", score: 85, importance: "High" },
      ],
      personal: [
        { label: "Essays", score: 72, importance: "High" },
        { label: "Recommendations", score: 68, importance: "Medium" },
        { label: "Extracurriculars", score: 65, importance: "High" },
        { label: "Talent / Spike", score: 70, importance: "Medium" },
        { label: "Character", score: 74, importance: "Low" },
      ],
      hooks: [
        { label: "First-gen", score: null, importance: "Medium", binary: true, binaryValue: true },
        { label: "Legacy", score: null, importance: "Low", binary: true, binaryValue: false },
        { label: "In-state", score: null, importance: "Low", binary: true, binaryValue: true },
        { label: "Volunteer / Work", score: 70, importance: "Low" },
        { label: "Demonstrated Interest", score: 65, importance: "High" },
      ],
    },
  },
]
