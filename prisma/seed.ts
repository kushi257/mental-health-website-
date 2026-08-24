import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { id: 'demo-user-alex' },
    update: {},
    create: {
      id: 'demo-user-alex',
      name: 'Alex',
      isAnonymous: false,
    },
  })
  console.log('✅ Created demo user:', user.name)

  // Seed 14 days of mood logs
  const tags = ['exams', 'sleep', 'family', 'money', 'relationships', 'self-care']
  const now = new Date()

  // Check if seed logs already exist
  const existingLogs = await prisma.moodLog.count({ where: { userId: 'demo-user-alex' } })
  if (existingLogs === 0) {
    for (let i = 14; i >= 1; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Realistic mood trajectory — starts lower, improves
      const baseMood = i > 10 ? 2 : i > 7 ? 2.5 : i > 4 ? 3 : 3.5
      const score = Math.min(5, Math.max(1, Math.round(baseMood + (Math.random() - 0.5))))
      const selectedTags = [tags[Math.floor(Math.random() * tags.length)]]
      if (Math.random() > 0.5) selectedTags.push(tags[Math.floor(Math.random() * tags.length)])

      await prisma.moodLog.create({
        data: {
          userId: 'demo-user-alex',
          score,
          tags: JSON.stringify([...new Set(selectedTags)]),
          note: score <= 2
            ? "Tough day, feeling overwhelmed with deadlines."
            : score === 3
              ? "Managed okay today. Did some deep breathing."
              : "Had a good day! Felt more focused.",
          createdAt: date,
        },
      })
    }
    console.log('✅ Created 14 mood log entries')
  }

  // Seed screener result (MODERATE tier)
  const existingScreener = await prisma.screenerResult.count({ where: { userId: 'demo-user-alex' } })
  if (existingScreener === 0) {
    await prisma.screenerResult.create({
      data: {
        userId: 'demo-user-alex',
        phq9Score: 11,
        gad7Score: 10,
        tier: 'MODERATE',
        answers: JSON.stringify({
          phq9Answers: [1, 2, 1, 2, 1, 1, 1, 1, 0],
          gad7Answers: [2, 1, 2, 1, 1, 2, 1],
        }),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    })
    console.log('✅ Created screener result')
  }

  // Seed journal entries
  const existingJournals = await prisma.journalEntry.count({ where: { userId: 'demo-user-alex' } })
  if (existingJournals === 0) {
    await prisma.journalEntry.create({
      data: {
        userId: 'demo-user-alex',
        type: 'thought_record',
        situation: 'Failed a quiz I studied hard for',
        automaticThought: "I'm terrible at this subject and will fail my degree",
        evidenceFor: 'Got a low score this time',
        evidenceAgainst: "I've passed previous quizzes and understand most concepts",
        alternativeView: 'One quiz does not define my ability. I can study differently and ask for help.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.journalEntry.create({
      data: {
        userId: 'demo-user-alex',
        type: 'worry',
        worryText: 'What if I can\'t afford rent next month?',
        deferredTo: 'Sunday 6pm worry time',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.journalEntry.create({
      data: {
        userId: 'demo-user-alex',
        type: 'activation',
        activityName: 'Go for a 20-minute walk',
        scheduledFor: 'Tomorrow morning',
        completed: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    })
    console.log('✅ Created 3 journal entries')
  }

  // Seed exercise completions
  const existingCompletions = await prisma.exerciseCompletion.count({ where: { userId: 'demo-user-alex' } })
  if (existingCompletions === 0) {
    const completionSeeds = [
      { exerciseId: 'box-breathing', exerciseName: 'Box Breathing', category: 'breathing' },
      { exerciseId: 'grounding-54321', exerciseName: '5-4-3-2-1 Grounding', category: 'grounding' },
      { exerciseId: 'thought-record', exerciseName: 'Thought Record', category: 'cbt' },
    ]
    for (const c of completionSeeds) {
      await prisma.exerciseCompletion.create({
        data: {
          userId: 'demo-user-alex',
          ...c,
          createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        },
      })
    }
    console.log('✅ Created exercise completions')
  }

  // Seed counsellor slots
  const existingCounsellors = await prisma.counsellor.count()
  if (existingCounsellors === 0) {
    const slots = [
      {
        id: 'counsellor-1',
        name: 'Dr. Priya Sharma',
        title: 'Clinical Psychologist',
        specialty: 'Anxiety & Depression',
        slotTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        available: true,
      },
      {
        id: 'counsellor-2',
        name: 'Mr. Arjun Mehta',
        title: 'Counselling Psychologist',
        specialty: 'Academic Stress & Burnout',
        slotTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        available: true,
      },
      {
        id: 'counsellor-3',
        name: 'Dr. Ananya Krishnan',
        title: 'Psychiatrist',
        specialty: 'Sleep Disorders & Mood',
        slotTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        available: true,
      },
      {
        id: 'counsellor-4',
        name: 'Ms. Riya Desai',
        title: 'Counsellor',
        specialty: 'Relationships & Identity',
        slotTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        available: true,
      },
    ]
    for (const slot of slots) {
      await prisma.counsellor.create({ data: slot })
    }
    console.log('✅ Created 4 counsellor slots')
  }

  console.log('🎉 Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
