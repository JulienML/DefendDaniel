import { NextResponse } from 'next/server';

const VOICES = {
  fr: {
    LAWYER_VOICE: {
      id: "ThT5KcBeYPX3keUQqHPh",
      volume: 0
    }
  },
  en: {
    LAWYER_VOICE: {
      id: "ThT5KcBeYPX3keUQqHPh",
      volume: 0
    }
  },
  es: {
    LAWYER_VOICE: {
      id: "ThT5KcBeYPX3keUQqHPh",
      volume: 0
    }
  }
};

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

export async function POST(request: Request) {
  try {
    const { text, language = 'en' } = await request.json();

    if (!VOICES[language as keyof typeof VOICES]) {
      return NextResponse.json(
        { error: 'Language not supported' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICES[language as keyof typeof VOICES].LAWYER_VOICE.id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY!
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          },
          language_code: language
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate voice');
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    });

  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}