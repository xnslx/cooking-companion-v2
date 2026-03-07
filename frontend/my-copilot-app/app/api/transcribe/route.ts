import OpenAI, { toFile } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob | null;

    if (!audio) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const file = await toFile(buffer, 'recording.webm', { type: audio.type || 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file,
    });

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error('Transcription error:', err);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
