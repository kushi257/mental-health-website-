// PHQ-9 Questions
export const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed — or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
]

// GAD-7 Questions
export const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
]

export const ANSWER_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
]

export type Tier = 'LOW' | 'MODERATE' | 'HIGH'

export interface ScoringResult {
  phq9Score: number
  gad7Score: number
  tier: Tier
  phq9Band: string
  gad7Band: string
}

export function scorePHQ9(answers: number[]): number {
  return answers.slice(0, 9).reduce((sum, a) => sum + a, 0)
}

export function scoreGAD7(answers: number[]): number {
  return answers.slice(0, 7).reduce((sum, a) => sum + a, 0)
}

export function getPHQ9Band(score: number): string {
  if (score <= 4) return 'Minimal'
  if (score <= 9) return 'Mild'
  if (score <= 14) return 'Moderate'
  if (score <= 19) return 'Moderately Severe'
  return 'Severe'
}

export function getGAD7Band(score: number): string {
  if (score <= 4) return 'Minimal'
  if (score <= 9) return 'Mild'
  if (score <= 14) return 'Moderate'
  return 'Severe'
}

export function calculateTier(phq9Score: number, gad7Score: number, phq9Answers: number[]): Tier {
  // PHQ-9 Q9 (index 8) > 0 is immediate HIGH regardless of total
  const suicidalIdeation = phq9Answers[8] > 0
  if (suicidalIdeation || phq9Score >= 15 || gad7Score >= 15) return 'HIGH'
  if (phq9Score >= 10 || gad7Score >= 10) return 'MODERATE'
  return 'LOW'
}

export function computeScoring(phq9Answers: number[], gad7Answers: number[]): ScoringResult {
  const phq9Score = scorePHQ9(phq9Answers)
  const gad7Score = scoreGAD7(gad7Answers)
  const tier = calculateTier(phq9Score, gad7Score, phq9Answers)
  return {
    phq9Score,
    gad7Score,
    tier,
    phq9Band: getPHQ9Band(phq9Score),
    gad7Band: getGAD7Band(gad7Score),
  }
}
