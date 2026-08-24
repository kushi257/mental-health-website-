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

export const QUESTION_ANSWER_OPTIONS = [
  [
    { label: 'I still make room for things I enjoy', value: 0 },
    { label: 'Joy has felt distant on a few days', value: 1 },
    { label: 'Most days have felt hard to enjoy', value: 2 },
    { label: 'I have hardly felt interested in anything', value: 3 },
  ],
  [
    { label: 'My mood has felt steady', value: 0 },
    { label: 'I have had a few noticeably low days', value: 1 },
    { label: 'Low feelings have been present most days', value: 2 },
    { label: 'I have felt persistently low or hopeless', value: 3 },
  ],
  [
    { label: 'Sleep has generally come easily', value: 0 },
    { label: 'Sleep has been unsettled on a few nights', value: 1 },
    { label: 'Sleep has been difficult most nights', value: 2 },
    { label: 'Sleep has felt disrupted nearly every night', value: 3 },
  ],
  [
    { label: 'I have had my usual energy', value: 0 },
    { label: 'I have felt worn out on some days', value: 1 },
    { label: 'Low energy has been a regular struggle', value: 2 },
    { label: 'I have felt drained nearly every day', value: 3 },
  ],
  [
    { label: 'Eating has felt balanced for me', value: 0 },
    { label: 'My appetite has shifted a little', value: 1 },
    { label: 'Eating changes have been noticeable most days', value: 2 },
    { label: 'My appetite has felt difficult to manage nearly every day', value: 3 },
  ],
  [
    { label: 'I have felt okay about myself', value: 0 },
    { label: 'Self-doubt has visited me on some days', value: 1 },
    { label: 'I have often felt like I am letting people down', value: 2 },
    { label: 'I have felt deeply critical of myself nearly every day', value: 3 },
  ],
  [
    { label: 'I can usually keep my attention on things', value: 0 },
    { label: 'My focus has wandered on some days', value: 1 },
    { label: 'Concentrating has been difficult most days', value: 2 },
    { label: 'It has felt very hard to focus nearly every day', value: 3 },
  ],
  [
    { label: 'My pace and restlessness feel usual for me', value: 0 },
    { label: 'I have noticed some changes on a few days', value: 1 },
    { label: 'I have often felt unusually slowed down or restless', value: 2 },
    { label: 'These changes have been noticeable nearly every day', value: 3 },
  ],
  [
    { label: 'I have not had these thoughts', value: 0 },
    { label: 'A difficult thought has crossed my mind on some days', value: 1 },
    { label: 'These thoughts have returned more than half the days', value: 2 },
    { label: 'These thoughts have been present nearly every day', value: 3 },
  ],
  [
    { label: 'I have felt generally calm', value: 0 },
    { label: 'Nervous feelings have shown up on some days', value: 1 },
    { label: 'I have felt on edge most days', value: 2 },
    { label: 'I have felt intensely nervous nearly every day', value: 3 },
  ],
  [
    { label: 'Worries usually loosen their hold', value: 0 },
    { label: 'I have struggled to stop worrying on some days', value: 1 },
    { label: 'Worry has been difficult to control most days', value: 2 },
    { label: 'Worry has felt impossible to switch off nearly every day', value: 3 },
  ],
  [
    { label: 'I have been able to let worries rest', value: 0 },
    { label: 'Several things have been on my mind at times', value: 1 },
    { label: 'I have carried many worries most days', value: 2 },
    { label: 'Different worries have filled my thoughts nearly every day', value: 3 },
  ],
  [
    { label: 'I can usually settle my body and mind', value: 0 },
    { label: 'Relaxing has taken extra effort on some days', value: 1 },
    { label: 'I have found it hard to relax most days', value: 2 },
    { label: 'I have felt unable to properly relax nearly every day', value: 3 },
  ],
  [
    { label: 'I have generally been able to sit still', value: 0 },
    { label: 'Restlessness has appeared on some days', value: 1 },
    { label: 'I have felt restless and fidgety most days', value: 2 },
    { label: 'Sitting still has felt very difficult nearly every day', value: 3 },
  ],
  [
    { label: 'I have felt patient enough for daily life', value: 0 },
    { label: 'I have been more easily irritated on some days', value: 1 },
    { label: 'I have felt irritable most days', value: 2 },
    { label: 'Small things have felt intensely irritating nearly every day', value: 3 },
  ],
  [
    { label: 'I have generally felt safe', value: 0 },
    { label: 'Fear has visited me on some days', value: 1 },
    { label: 'I have often expected something bad to happen', value: 2 },
    { label: 'A sense of danger has stayed with me nearly every day', value: 3 },
  ],
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
