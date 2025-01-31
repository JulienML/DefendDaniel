import { NextResponse } from 'next/server';

const VOICES = {
  fr: {
    LAWYER_VOICE: {
      id: "mXYwNeAXtcb9FWObPpOY",
      volume: 0.25 // 25%
    },
    JUDGE_VOICE: {
      id: "5hObYp8fo0XqhbudPFdE",
      volume: 0.75 // 75%
    }
  },
  en: {
    LAWYER_VOICE: {
      id: "bGLLbWl0MmTsn5gWQCuZ",
      volume: 1 // 100%
    },
    JUDGE_VOICE: {
      id: "e170Z5cpDGpADYBfQKbs",
      volume: 0.75 // 75%
    }
  },
  es: {
    LAWYER_VOICE: {
      id: "tozjSvFqKBPpgsJFDfS0",
      volume: 1 // 100%
    },
    JUDGE_VOICE: {
      id: "I2lWW75NJTSYfUWIunTb",
      volume: 1 // 100%
    }
  }
};

export async function POST(request: Request) {
  try {
    const { text, language = 'en', role } = await request.json();

    let voice;
    let volume = 0;
    if (role === 'lawyer') {
      voice = VOICES[language as keyof typeof VOICES].LAWYER_VOICE.id;
      volume = VOICES[language as keyof typeof VOICES].LAWYER_VOICE.volume;
    } else if (role === 'judge') {
      voice = VOICES[language as keyof typeof VOICES].JUDGE_VOICE.id;
      volume = VOICES[language as keyof typeof VOICES].JUDGE_VOICE.volume;
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY!
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

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
        'X-Volume': volume.toString()
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