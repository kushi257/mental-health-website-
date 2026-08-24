import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_INSTRUCTION = `You are ManoBot, a warm mental-health support companion for college students. You are not a licensed therapist, counsellor, or emergency service. Use plain, compassionate language and reflective listening. Validate feelings before suggestions. Ask at most one gentle follow-up question when it helps, and do not assume missing details. Keep replies below 180 words, use complete sentences, and never stop mid-sentence.

Never diagnose, prescribe, promise outcomes, or claim to replace professional care. If asked whether you are a real counsellor, say clearly that you are a digital support companion. Offer practical, small next steps such as breathing, grounding, journaling, planning, or reaching out to trusted support.

SAFETY: If the user's message indicates possible suicide, self-harm, harm to someone else, immediate danger, or inability to stay safe, do not ask probing questions and do not continue casual conversation. Respond briefly with empathy, encourage immediate human support, mention Tele-MANAS at 14416 and the existing ManoMitra Safety Plan, and say they can book a campus counsellor at /booking. Do not claim to contact emergency services.`

const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash']

function chooseReply(replies: string[], messages: ChatMessage[]) {
  const userTurns = messages.filter(message => message.role === 'user').length
  return replies[userTurns % replies.length]
}

function isCompleteReply(reply: string) {
  return /[.!?\u2026]$/.test(reply.trim())
}

function localFallbackReply(text: string, messages: ChatMessage[]) {
  const message = text.toLowerCase()
  if (/suicid|kill myself|end my life|self[- ]?harm|hurt myself|no reason to live/.test(message)) {
    return 'I am really sorry this feels so overwhelming. Please do not stay alone with this right now. Call Tele-MANAS at 14416, open your ManoMitra Safety Plan, or book a campus counsellor at /booking. If you may act immediately, contact local emergency services or go to the nearest emergency department.'
  }
  if (/hello|hi|hey|good morning|good evening/.test(message)) {
    return chooseReply([
      'Hi, I am here with you. What is taking up most of your mind today?',
      'Hello. You can start anywhere, even if your thoughts feel messy. What would you like to talk through?',
    ], messages)
  }
  if (/are you (real|a person)|real counsellor|real therapist|who are you|are you ai/.test(message)) {
    return "I am ManoBot, a digital support companion, not a licensed counsellor or therapist. I can listen, help you sort your thoughts, and suggest practical next steps. What is happening for you right now?"
  }
  if (/thank|thanks|appreciate/.test(message)) {
    return chooseReply([
      'You are welcome. Reaching out was a good step. Would you like to keep unpacking this or choose one small action?',
      'I am glad I could stay with you for a moment. What would make the next hour feel a little easier?',
    ], messages)
  }
  if (/exam|study|college|assignment|deadline|procrastinat/.test(message)) {
    return chooseReply([
      'That sounds like a lot to carry, especially when deadlines are close. Write down every task, circle the one due soonest, and work on it for five minutes. Which task is most urgent?',
      'Academic pressure can make starting feel impossible. Try opening the document or writing just the first sentence, then pause and notice how it feels. What are you trying to finish?',
      'You do not have to solve the whole semester tonight. Pick one small, visible action: email someone, outline one section, or set a ten-minute timer. Which option feels realistic?',
    ], messages)
  }
  if (/friend|friendship|roommate|relationship|breakup|family|parent|argument|fight/.test(message)) {
    return chooseReply([
      'It sounds like this relationship matters to you, which may be why it hurts so much. Before replying, take a short pause and decide what you want the other person to understand. What happened?',
      'Conflict can leave your mind replaying every detail. You could write what you felt, what you needed, and what you want to ask for, without sending it yet. What do you wish they knew?',
    ], messages)
  }
  if (/sleep|insomnia|awake|night|tired/.test(message)) {
    return chooseReply([
      'A tired mind can make worries feel much louder. Dim the screen, relax your jaw and shoulders, and take four slow breaths. Is one particular thought keeping you awake?',
      'That sounds exhausting. Instead of forcing sleep, try a quiet reset: place both feet on the floor, name five things you see, and return to bed when your body feels calmer. What usually keeps you awake?',
    ], messages)
  }
  if (/anxious|panic|worried|worry|stress|nervous/.test(message)) {
    return chooseReply([
      'It sounds like your mind has been working hard to protect you from something difficult. Name five things you can see, four you can feel, and take one slow breath. What feels most urgent?',
      'Stress can make every problem arrive at once. Separate what needs action today from what can wait, then choose one next step. What is within your control right now?',
      'You do not need to argue with the worry immediately. Notice it, place both feet on the ground, and ask: “What evidence do I have, and what would I tell a friend?” What is the worry saying?',
    ], messages)
  }
  if (/sad|low|empty|hopeless|cry|unhappy|down/.test(message)) {
    return chooseReply([
      'I am sorry this has been feeling heavy. You do not have to explain it perfectly. Has this feeling been building for a while, or did something happen today?',
      'That sounds painful to sit with. For now, drink some water, move somewhere with a little light, and let one trusted person know you are having a hard day. What feels heaviest?',
      'When your energy is low, “do something helpful” can feel too big. Could you choose one gentle action: wash your face, eat something small, or step outside for two minutes?',
    ], messages)
  }
  if (/lonely|alone|isolated|nobody|no one/.test(message)) {
    return chooseReply([
      'Feeling alone can make a difficult moment feel even bigger. Is there one person you could send a simple message to, such as “I am having a rough day; can we talk for a few minutes?”',
      'I am glad you said it out loud. You do not need a perfect conversation; sitting near people, visiting a familiar place, or sending a short check-in can be a start. When do you feel most alone?',
    ], messages)
  }
  if (/angry|irritat|frustrat|mad|rage/.test(message)) {
    return chooseReply([
      'It makes sense that you feel frustrated when something keeps pushing against you. Take a pause before responding and tell me what triggered the anger.',
      'Anger often points to a boundary, hurt, or need that has not been heard. Move away for a few minutes if you can, then ask yourself what you needed in that moment.',
    ], messages)
  }
  if (/focus|concentrat|motivat|energy|stuck|cannot start|can\'t start/.test(message)) {
    return chooseReply([
      'Starting can be harder than doing when your mind feels overloaded. Clear one small space, set a five-minute timer, and stop when it ends if you need to. What are you trying to begin?',
      'Let us lower the bar instead of waiting for motivation. Choose the smallest version of the task, like opening the file or writing three words. What is getting in the way of starting?',
    ], messages)
  }
  if (/breathe|breathing|grounding|calm down|help right now/.test(message)) {
    return 'Let us try something simple together: breathe in gently for four counts, hold for four, and breathe out for four. Repeat it three times. What do you notice in your body now?'
  }
  return chooseReply([
    'I hear you. Let us turn this into something we can work with: what happened, what are you feeling, and what do you need most right now?',
    'That sounds worth taking seriously. You can describe the situation, the feeling it brought up, or the decision you are stuck on. Where should we begin?',
    'I want to help you move forward, not just repeat a question. Would you like practical advice, help sorting your thoughts, or simply a space to be heard?',
  ], messages)
}

interface ChatMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the dev server.' },
      { status: 503 },
    )
  }

  try {
    const body = await request.json() as { messages?: ChatMessage[] }
    const messages = body.messages || []

    if (!messages.length || messages.some(message => !message.parts?.[0]?.text?.trim())) {
      return NextResponse.json({ error: 'A valid conversation is required.' }, { status: 400 })
    }

    const requestBody = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: messages,
      generationConfig: { temperature: 0.65, maxOutputTokens: 800 },
    })

    const lastUserText = [...messages].reverse().find(message => message.role === 'user')?.parts[0]?.text || ''

    for (const model of GEMINI_MODELS) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
        },
      )

      if (response.ok) {
        const data = await response.json() as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        }
        const reply = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
        if (reply && isCompleteReply(reply)) return NextResponse.json({ reply })
        console.error(`Gemini model ${model} returned an incomplete reply`)
      } else {
        const status = response.status
        console.error(`Gemini model ${model} failed:`, status)
        if (status === 400 || status === 401 || status === 403) {
          return NextResponse.json({ error: 'Gemini rejected the request. Check that GEMINI_API_KEY is valid and enabled.' }, { status: 502 })
        }
      }
    }

    return NextResponse.json({ reply: localFallbackReply(lastUserText, messages), fallback: true })
  } catch (error) {
    console.error('Chat request failed:', error)
    return NextResponse.json({ error: 'Unable to reach Gemini right now. Please try again.' }, { status: 500 })
  }
}
