import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ plan: null })

  try {
    const plan = await prisma.safetyPlan.findUnique({ where: { userId } })
    if (plan) {
      return NextResponse.json({
        plan: {
          ...plan,
          warningSigns: JSON.parse(plan.warningSigns),
          copingStrategies: JSON.parse(plan.copingStrategies),
          supportContacts: JSON.parse(plan.supportContacts),
          professionalContacts: JSON.parse(plan.professionalContacts),
        },
      })
    }
    return NextResponse.json({ plan: null })
  } catch {
    return NextResponse.json({ plan: null })
  }
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const { warningSigns, copingStrategies, supportContacts, professionalContacts } = await req.json()
    const plan = await prisma.safetyPlan.upsert({
      where: { userId },
      create: {
        userId,
        warningSigns: JSON.stringify(warningSigns || []),
        copingStrategies: JSON.stringify(copingStrategies || []),
        supportContacts: JSON.stringify(supportContacts || []),
        professionalContacts: JSON.stringify(professionalContacts || []),
      },
      update: {
        warningSigns: JSON.stringify(warningSigns || []),
        copingStrategies: JSON.stringify(copingStrategies || []),
        supportContacts: JSON.stringify(supportContacts || []),
        professionalContacts: JSON.stringify(professionalContacts || []),
      },
    })
    return NextResponse.json({ plan })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save safety plan' }, { status: 500 })
  }
}
