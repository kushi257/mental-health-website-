'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Calendar, UserCheck, Clock, CheckCircle, Shield } from 'lucide-react'

interface CounsellorSlot {
  id: string
  name: string
  title: string
  specialty: string
  slotTime: string
  available: boolean
}

interface Booking {
  id: string
  counsellorName: string
  slotTime: string
  status: string
  createdAt: string
}

export default function BookingPage() {
  const [slots, setSlots] = useState<CounsellorSlot[]>([])
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [selectedSlot, setSelectedSlot] = useState<CounsellorSlot | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        fetch('/api/booking'),
        fetch('/api/my-bookings'),
      ])
      const slotsData = await slotsRes.json()
      const bookingsData = await bookingsRes.json()

      setSlots(slotsData.counsellors || [])
      setMyBookings(bookingsData.bookings || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleBook = async () => {
    if (!selectedSlot) return
    setLoading(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counsellorId: selectedSlot.id,
          counsellorName: selectedSlot.name,
          slotTime: selectedSlot.slotTime,
        }),
      })

      if (res.ok) {
        setBookingSuccess(true)
        loadData()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page min-h-screen pb-24">
      <Navigation />

      <main className="app-content max-w-3xl mx-auto px-4 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Book Campus Counsellor</h1>
          <p className="text-gray-500 mt-1">Confidential & free 1-on-1 sessions for college students</p>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-xs text-teal-800">
          <Shield className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <span>
            <strong>100% Confidential:</strong> Your booking is stored anonymously and is never disclosed to campus administration or faculty.
          </span>
        </div>

        {/* Confirmed Bookings list */}
        {myBookings.length > 0 && (
          <div className="glass-card p-6 mb-8 border-2 border-teal-500">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              Your Confirmed Bookings
            </h2>
            <div className="space-y-3">
              {myBookings.map(b => (
                <div key={b.id} className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-teal-900 text-sm">{b.counsellorName}</p>
                    <p className="text-xs text-teal-700 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(b.slotTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Slots */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Available Counsellor Slots</h2>

          <div className="space-y-4">
            {slots.map(slot => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedSlot?.id === slot.id ? 'border-teal-600 bg-teal-50/70 shadow-md' : 'border-gray-200 bg-white hover:border-teal-300'}`}
              >
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{slot.name}</h3>
                  <p className="text-xs text-gray-500">{slot.title} · {slot.specialty}</p>
                  <p className="text-xs text-teal-700 font-semibold mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(slot.slotTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${selectedSlot?.id === slot.id ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedSlot?.id === slot.id ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedSlot && !bookingSuccess && (
            <div className="mt-6 pt-4 border-t border-gray-100 animate-slide-up">
              <button id="confirm-booking-btn" onClick={handleBook} disabled={loading} className="btn-primary w-full text-base">
                {loading ? 'Confirming...' : `Confirm Booking with ${selectedSlot.name}`}
              </button>
            </div>
          )}

          {bookingSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-grow-in">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-bold text-green-900 text-sm">Booking Confirmed!</p>
              <p className="text-xs text-green-700 mt-1">Your session has been saved to the database. You will see it above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
