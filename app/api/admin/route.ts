import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  if (req.cookies.get('adminSession')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 })
  }

  try {
    // Aggregate mood data - average per day across all users
    const moodLogs = await prisma.moodLog.findMany({
      orderBy: { createdAt: 'asc' },
    })

    // Group by date
    const moodByDay: Record<string, number[]> = {}
    for (const log of moodLogs) {
      const date = log.createdAt.toISOString().split('T')[0]
      if (!moodByDay[date]) moodByDay[date] = []
      moodByDay[date].push(log.score)
    }
    const moodTrend = Object.entries(moodByDay).map(([date, scores]) => ({
      date,
      avgMood: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
      count: scores.length,
    }))

    // Exercise completion counts by category
    const completions = await prisma.exerciseCompletion.findMany()
    const byCategory: Record<string, number> = {}
    for (const c of completions) {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1
    }
    const exerciseStudents = new Set(completions.map(completion => completion.userId))
    const completionsByStudent: Record<string, number> = {}
    for (const completion of completions) {
      completionsByStudent[completion.userId] = (completionsByStudent[completion.userId] || 0) + 1
    }
    const repeatUsers = Object.values(completionsByStudent).filter(count => count >= 2).length
    const activeStudents = exerciseStudents.size
    const exerciseStats = Object.entries(byCategory)
      .map(([category, count]) => ({
        category,
        count,
        shareOfActivity: activeStudents ? Math.round((count / completions.length) * 100) : 0,
      }))
      .sort((first, second) => second.count - first.count)

    // Tier distribution
    const screeners = await prisma.screenerResult.findMany()
    const tierCounts: Record<string, number> = { LOW: 0, MODERATE: 0, HIGH: 0 }
    for (const s of screeners) {
      tierCounts[s.tier] = (tierCounts[s.tier] || 0) + 1
    }

    // Aggregate counts - never individual rows
    const totalUsers = await prisma.user.count()
    const totalMoodLogs = await prisma.moodLog.count()
    const totalCompletions = await prisma.exerciseCompletion.count()
    const totalBookings = await prisma.booking.count()
    const screenedStudents = screeners.length
    const participationRate = totalUsers ? Math.round((activeStudents / totalUsers) * 100) : 0
    const repeatUseRate = activeStudents ? Math.round((repeatUsers / activeStudents) * 100) : 0
    const averageCompletionsPerParticipant = activeStudents ? Math.round((totalCompletions / activeStudents) * 10) / 10 : 0
    const latestMood = moodTrend[moodTrend.length - 1]?.avgMood || 0
    const previousMood = moodTrend[moodTrend.length - 2]?.avgMood || latestMood
    const moodDirection = latestMood > previousMood + 0.1 ? 'improving' : latestMood < previousMood - 0.1 ? 'declining' : 'stable'
    const moderateOrHigh = tierCounts.MODERATE + tierCounts.HIGH
    const higherSupportShare = screenedStudents ? Math.round((moderateOrHigh / screenedStudents) * 100) : 0
    const screeningCoverage = totalUsers ? Math.round((screenedStudents / totalUsers) * 100) : 0
    const engagementRate = totalUsers ? Math.round((totalCompletions / totalUsers) * 10) / 10 : 0
    const mostUsedExercise = exerciseStats.reduce((top, current) => current.count > top.count ? current : top, { category: 'No activity yet', count: 0 })

    const insights = [
      {
        type: moodDirection === 'declining' ? 'attention' : 'positive',
        title: `Mood trend is ${moodDirection}`,
        detail: moodTrend.length
          ? `The latest campus average is ${latestMood.toFixed(1)} out of 5, based on ${moodTrend[moodTrend.length - 1].count} check-ins on the latest recorded day.`
          : 'There are not enough mood check-ins yet to identify a campus trend.',
        action: moodDirection === 'declining' ? 'Review outreach capacity and promote low-barrier support this week.' : 'Continue regular check-ins so this signal becomes more reliable over time.',
      },
      {
        type: higherSupportShare >= 30 ? 'attention' : 'neutral',
        title: `${higherSupportShare}% screened in moderate or high tiers`,
        detail: screenedStudents
          ? `${moderateOrHigh} of ${screenedStudents} completed screeners fall in tiers that may benefit from additional support or follow-up.`
          : 'No completed screeners are available for a risk distribution yet.',
        action: higherSupportShare >= 30 ? 'Check that referral pathways and counsellor availability can meet likely demand.' : 'Keep the screener accessible and pair it with clear support options.',
      },
      {
        type: screeningCoverage < 50 && totalUsers > 0 ? 'attention' : 'neutral',
        title: `${screeningCoverage}% screening coverage`,
        detail: `${screenedStudents} of ${totalUsers} registered students have a recorded PHQ-9 / GAD-7 screening result.`
          + (screenedStudents ? ' Risk-tier findings should be read as a screened-sample signal, not a whole-campus estimate.' : ''),
        action: screeningCoverage < 50 ? 'Improve screening completion prompts before drawing broad conclusions from tier data.' : 'Use the coverage level when planning campus-wide interventions.',
      },
      {
        type: 'positive',
        title: totalCompletions ? `${mostUsedExercise.category} is the leading engagement category` : 'Engagement data is still building',
        detail: totalCompletions
          ? `${mostUsedExercise.count} of ${totalCompletions} exercise completions are in the ${mostUsedExercise.category} category. Average activity is ${engagementRate} completion${engagementRate === 1 ? '' : 's'} per registered student.`
          : 'No exercise completions have been recorded yet.',
        action: totalCompletions ? 'Feature the leading category while continuing to test discoverability of other tools.' : 'Promote one simple exercise from the student dashboard to establish a baseline.',
      },
    ]

    return NextResponse.json({
      moodTrend: moodTrend.slice(-30), // last 30 days aggregate
      exerciseStats,
      exerciseEngagement: {
        activeStudents,
        participationRate,
        repeatUsers,
        repeatUseRate,
        averageCompletionsPerParticipant,
      },
      tierDistribution: tierCounts,
      summary: { totalUsers, totalMoodLogs, totalCompletions, totalBookings, screenedStudents },
      insights,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 })
  }
}
