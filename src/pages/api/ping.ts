import type { APIRoute } from 'astro'
import { Kafka, logLevel } from 'kafkajs'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const broker = import.meta.env.KAFKA_BROKER ?? 'localhost:9092'
  const topic = import.meta.env.KAFKA_TOPIC ?? 'recruiter-pings'

  const kafka = new Kafka({
    clientId: 'dreifaldt-com',
    brokers: [broker],
    logLevel: logLevel.ERROR,
    // Short timeouts so the button doesn't hang if Kafka isn't running
    connectionTimeout: 3000,
    requestTimeout: 5000,
  })

  const producer = kafka.producer()

  try {
    await producer.connect()
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            event: 'recruiter_ping',
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') ?? 'unknown',
            referrer: request.headers.get('referer') ?? 'direct',
          }),
        },
      ],
    })
    await producer.disconnect()

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[ping] Kafka error:', err)
    try {
      await producer.disconnect()
    } catch {
      // ignore
    }
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
