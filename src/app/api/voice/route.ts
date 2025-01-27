import { NextResponse } from 'next/server';

const VOICES = {
  fr: {
    LAWYER_VOICE: {
      id: "XgXB0fxFNJAEDoy7QEp5",
      volume: 0
    },
    GLITCH_VOICE: {
      id: "MWhJLNn7P7uvQrOTocc8",
      volume: -10
    },
    JUDGE_VOICE: {
      id: "x2AhtLKBQ202WmP0eMAe",
      volume: 0
    }
  },
  en: {
    LAWYER_VOICE: {
      id: "bGLLbWl0MmTsn5gWQCuZ",
      volume: 0
    },
    GLITCH_VOICE: {
      id: "ZCgnAThIoaTqZwEGwRb4",
      volume: -10
    },
    JUDGE_VOICE: {
      id: "e170Z5cpDGpADYBfQKbs",
      volume: 0
    }
  },
  es: {
    LAWYER_VOICE: {
      id: "tozjSvFqKBPpgsJFDfS0",
      volume: 0
    },
    GLITCH_VOICE: {
      id: "AnLaVu7KDTirBKuGkCZt",
      volume: -10
    },
    JUDGE_VOICE: {
      id: "I2lWW75NJTSYfUWIunTb",
      volume: 0
    }
  }
};

export async function POST(request: Request) {
  try {
    const { text, language = 'en', role } = await request.json();

    let voice;
    if (role === 'lawyer') {
      voice = VOICES[language as keyof typeof VOICES].LAWYER_VOICE.id;
    } else if (role === 'judge') {
      voice = VOICES[language as keyof typeof VOICES].JUDGE_VOICE.id;
    } else if (role === 'glitch') {
      voice = VOICES[language as keyof typeof VOICES].GLITCH_VOICE.id;
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
          }
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
        'Cache-Control': 'no-cache'
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