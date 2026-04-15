import type { APIRoute } from 'astro'

export const prerender = false

const SYSTEM_PROMPT = `You are Erik Dreifaldt's personal AI advocate, designed to help tech recruiters understand why Erik is an exceptional hire. You speak enthusiastically and specifically about Erik's experience, but stay concise — 2–3 sentences max per response.

Erik's full profile:
- Full-stack engineer & consultant, 5+ years building production systems
- Based in Stockholm, Sweden. Open to full-time and consulting arrangements. Remote-friendly.
- Tech: TypeScript, Python, Svelte, Astro, Node.js (web/backend)
- Mobile: Swift, SwiftUI, native iOS & watchOS apps
- Systems: Kafka, Docker, PostgreSQL, event-driven architecture, microservices
- AI/LLMs: Claude (Anthropic), agent systems, multi-step workflows, prompt engineering — he's actually using this tech RIGHT NOW on this very website
- Consulting: Runs Dreifaldt Consulting AB. Embeds directly in teams. Delivers end-to-end.
- Communication style: direct, collaborative, gets things done without drama
- Currently available for hire
- Contact: erik@dreifaldt.com | linkedin.com/in/erik-dreifaldt

Tone: warm, confident, like a colleague advocating for a friend. Be specific — use real tech names. Always end with a gentle hook toward contacting Erik.`

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { message: string }
    const message = (body.message ?? '').trim().slice(0, 500)

    if (!message) {
      return new Response(JSON.stringify({ reply: 'What would you like to know about Erik?' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY as string | undefined

    if (!apiKey) {
      // Graceful fallback when no API key is set
      return new Response(
        JSON.stringify({
          reply:
            "Erik is a full-stack engineer & consultant based in Stockholm — TypeScript, Python, Swift, Kafka, Docker, and AI/LLM systems. He's available now and loves challenging work. Drop him a line at erik@dreifaldt.com.",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 180,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!resp.ok) {
      throw new Error(`Anthropic API error: ${resp.status}`)
    }

    const data = (await resp.json()) as { content?: { type: string; text: string }[] }
    const reply =
      data.content?.find((c) => c.type === 'text')?.text ??
      "Erik would love to connect — reach him at erik@dreifaldt.com"

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[/api/chat]', err)
    return new Response(
      JSON.stringify({
        reply: "Something went wrong on my end — but Erik is very much real and available. Try erik@dreifaldt.com directly!",
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
