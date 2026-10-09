import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
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
    const exerciseStats = Object.entries(byCategory).map(([category, count]) => ({ category, count }))

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

    return NextResponse.json({
      moodTrend: moodTrend.slice(-30), // last 30 days aggregate
      exerciseStats,
      tierDistribution: tierCounts,
      summary: { totalUsers, totalMoodLogs, totalCompletions, totalBookings },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 })
  }
}
