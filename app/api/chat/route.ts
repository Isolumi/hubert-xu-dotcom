import { GoogleGenerativeAI } from '@google/generative-ai'
import { profile } from '@/lib/profile'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  let messages: { role: string; content: string }[]

  try {
    const body = await req.json()
    messages = body.messages
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('messages must be a non-empty array', { status: 400 })
  }

  const lastMessage = messages[messages.length - 1]
  if (!lastMessage?.content) {
    return new Response('Last message must have content', { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: profile.systemPrompt,
    })

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    })

    const result = await chat.sendMessageStream(lastMessage.content)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    console.error('Gemini API error:', err)
    return new Response('AI service error', { status: 500 })
  }
}
