'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Shield, Plus, Trash2, Save, CheckCircle, Phone } from 'lucide-react'

export default function SafetyPlanPage() {
  const [warningSigns, setWarningSigns] = useState<string[]>([])
  const [copingStrategies, setCopingStrategies] = useState<string[]>([])
  const [supportContacts, setSupportContacts] = useState<string[]>([])
  const [professionalContacts, setProfessionalContacts] = useState<string[]>([])

  const [newWarning, setNewWarning] = useState('')
  const [newCoping, setNewCoping] = useState('')
  const [newSupport, setNewSupport] = useState('')
  const [newProf, setNewProf] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadPlan()
  }, [])

  const loadPlan = async () => {
    try {
      const res = await fetch('/api/safety-plan')
      const data = await res.json()
      if (data.plan) {
        setWarningSigns(data.plan.warningSigns || [])
        setCopingStrategies(data.plan.copingStrategies || [])
        setSupportContacts(data.plan.supportContacts || [])
        setProfessionalContacts(data.plan.professionalContacts || [])
      } else {
        // Defaults
        setWarningSigns(['Feeling extreme fatigue', 'Isolating in dorm room'])
        setCopingStrategies(['5-4-3-2-1 Grounding exercise', 'Listen to favorite playlist'])
        setSupportContacts(['Best friend Rahul: 9876543210'])
        setProfessionalContacts(['Tele-MANAS: 14416', 'Campus Health Center'])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/safety-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warningSigns,
          copingStrategies,
          supportContacts,
          professionalContacts,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const addItem = (list: string[], setList: any, val: string, setVal: any) => {
    if (!val.trim()) return
    setList([...list, val.trim()])
    setVal('')
  }

  const removeItem = (list: string[], setList: any, index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #fff1f2 0%, #f8fffe 100%)' }}>
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Safety Plan</h1>
            <p className="text-gray-500 mt-1">Your personal action step plan when distress arises</p>
          </div>
          <button id="save-safety-plan" onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-grow-in">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Safety plan successfully updated in database!
          </div>
        )}

        <div className="space-y-6">
          {/* Section 1 */}
          <div className="glass-card p-6 border-l-4 border-rose-500">
            <h3 className="font-bold text-gray-800 text-base mb-2">1. Personal Warning Signs</h3>
            <p className="text-xs text-gray-500 mb-3">Thoughts, moods, or behaviors that indicate distress is building up</p>
            <div className="space-y-2 mb-3">
              {warningSigns.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border text-xs">
                  <span>{item}</span>
                  <button onClick={() => removeItem(warningSigns, setWarningSigns, i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field text-xs py-2"
                placeholder="Add warning sign..."
                value={newWarning}
                onChange={e => setNewWarning(e.target.value)}
              />
              <button onClick={() => addItem(warningSigns, setWarningSigns, newWarning, setNewWarning)} className="btn-secondary text-xs px-3 py-2">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Section 2 */}
          <div className="glass-card p-6 border-l-4 border-teal-500">
            <h3 className="font-bold text-gray-800 text-base mb-2">2. Internal Coping Strategies</h3>
            <p className="text-xs text-gray-500 mb-3">Things I can do on my own to take my mind off problems</p>
            <div className="space-y-2 mb-3">
              {copingStrategies.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border text-xs">
                  <span>{item}</span>
                  <button onClick={() => removeItem(copingStrategies, setCopingStrategies, i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field text-xs py-2"
                placeholder="Add coping strategy..."
                value={newCoping}
                onChange={e => setNewCoping(e.target.value)}
              />
              <button onClick={() => addItem(copingStrategies, setCopingStrategies, newCoping, setNewCoping)} className="btn-secondary text-xs px-3 py-2">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Section 3 */}
          <div className="glass-card p-6 border-l-4 border-amber-500">
            <h3 className="font-bold text-gray-800 text-base mb-2">3. People & Social Settings for Distraction</h3>
            <p className="text-xs text-gray-500 mb-3">Trusted friends, family, or places that provide support</p>
            <div className="space-y-2 mb-3">
              {supportContacts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border text-xs">
                  <span>{item}</span>
                  <button onClick={() => removeItem(supportContacts, setSupportContacts, i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field text-xs py-2"
                placeholder="Add contact..."
                value={newSupport}
                onChange={e => setNewSupport(e.target.value)}
              />
              <button onClick={() => addItem(supportContacts, setSupportContacts, newSupport, setNewSupport)} className="btn-secondary text-xs px-3 py-2">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Section 4 */}
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-800 text-base mb-2">4. Professionals or Agencies to Contact</h3>
            <p className="text-xs text-gray-500 mb-3">Emergency contacts, helplines, or crisis services</p>
            <div className="space-y-2 mb-3">
              {professionalContacts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border text-xs">
                  <span className="font-semibold text-blue-900">{item}</span>
                  <button onClick={() => removeItem(professionalContacts, setProfessionalContacts, i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field text-xs py-2"
                placeholder="Add professional contact..."
                value={newProf}
                onChange={e => setNewProf(e.target.value)}
              />
              <button onClick={() => addItem(professionalContacts, setProfessionalContacts, newProf, setNewProf)} className="btn-secondary text-xs px-3 py-2">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
