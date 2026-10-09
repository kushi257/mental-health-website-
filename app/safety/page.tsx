'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Phone, AlertTriangle, Heart, CheckCircle2, ExternalLink } from 'lucide-react'
import { Suspense } from 'react'

function SafetyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') // 'screener' or 'chatbot'
  const [acknowledged, setAcknowledged] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleAcknowledge = async () => {
    setChecking(true)
    // Set cookie that screener is done
    document.cookie = 'screenerDone=1; path=/; max-age=2592000'
    await new Promise(r => setTimeout(r, 500))
    setAcknowledged(true)
    setChecking(false)
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #1e1b4b 0%, #7c2d12 100%)'}}>
      {/* Pulsing background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Alert header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-500/20 border-2 border-red-400/50 rounded-full flex items-center justify-center mx-auto mb-4" style={{animation: 'pulse-ring 2s infinite'}}>
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">You&apos;re not alone</h1>
          <p className="text-red-200 text-lg">
            Your responses suggest you might be having a tough time right now.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-4">
          <p className="text-white/90 text-center mb-8 leading-relaxed">
            It takes courage to acknowledge how you&apos;re feeling. Please reach out to a real person right now — trained counsellors are available to listen, 24/7, free of charge.
          </p>

          {/* Emergency contacts */}
          <div className="space-y-4">
            <a
              id="telemanas-call"
              href="tel:14416"
              className="flex items-center gap-4 bg-red-500/20 border-2 border-red-400/50 rounded-2xl p-5 hover:bg-red-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/40 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Tele-MANAS</p>
                <p className="text-red-200 text-2xl font-bold tracking-wider">14416</p>
                <p className="text-red-300 text-xs">National Mental Health Helpline · Free · 24/7</p>
              </div>
              <ExternalLink className="ml-auto text-red-300 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              id="icall-call"
              href="tel:9152987821"
              className="flex items-center gap-4 bg-orange-500/10 border border-orange-400/30 rounded-2xl p-4 hover:bg-orange-500/20 transition-all group"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">iCall</p>
                <p className="text-orange-200 text-lg font-bold">9152987821</p>
                <p className="text-orange-300 text-xs">TISS Counselling Service · Mon–Sat</p>
              </div>
            </a>

            <a
              id="vandrevala-call"
              href="tel:18602662345"
              className="flex items-center gap-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 hover:bg-blue-500/20 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Vandrevala Foundation</p>
                <p className="text-blue-200 text-lg font-bold">1860-2662-345</p>
                <p className="text-blue-300 text-xs">Free · 24/7 · Multi-lingual</p>
              </div>
            </a>
          </div>
        </div>

        {/* Acknowledgment section */}
        {!acknowledged ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <p className="text-white/80 text-sm mb-4 text-center">
              Before continuing to ManoMitra, please confirm you&apos;ve seen these crisis resources.
            </p>
            <button
              id="acknowledge-btn"
              onClick={handleAcknowledge}
              disabled={checking}
              className="btn-primary w-full"
              style={{background: 'linear-gradient(135deg, #0d9488, #0ea5e9)'}}
            >
              {checking ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  I&apos;ve seen these resources — I&apos;m safe right now
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-teal-500/20 border border-teal-400/50 rounded-2xl p-6 text-center animate-grow-in">
            <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto mb-3" />
            <p className="text-white font-semibold mb-4">
              Thank you for taking care of yourself. ManoMitra is here to support you every step of the way.
            </p>
            <button
              id="continue-to-dashboard"
              onClick={handleContinue}
              className="btn-primary mx-auto"
            >
              Continue to ManoMitra
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SafetyPage() {
  return (
    <Suspense>
      <SafetyContent />
    </Suspense>
  )
}
