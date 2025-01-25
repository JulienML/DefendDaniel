import { NextResponse } from 'next/server';

const VOICES = {
  fr: {
    LAWYER_VOICE: {
      id: "ThT5KcBeYPX3keUQqHPh",
      volume: 0
    },
    GLITCH_VOICE: {
      id: "XrExE9yKIg1WjnnlVkGX",
      volume: -10
    }
  },
  en: {
    LAWYER_VOICE: {
      id: "ThT5KcBeYPX3keUQqHPh",
      volume: 0
    },
    GLITCH_VOICE: {
      id: "XrExE9yKIg1WjnnlVkGX",
      volume: -10
    }
  },
  es: {
    LAWYER_VOICE: {
      id: "ThT5KcBeYPX3keUQqHPh",
      volume: 0
    },
    GLITCH_VOICE: {
      id: "XrExE9yKIg1WjnnlVkGX",
      volume: -10
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

    const segments = text.split('*');
    let finalText = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();
      if (segment !== "") {
        if (i % 2 === 1) {
          // Pour les segments glitch, on utilise une voix différente
          const voiceConfig = VOICES[language as keyof typeof VOICES].GLITCH_VOICE;
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`,
            {
              method: 'POST',
              headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVEN_LABS_API_KEY!
              },
              body: JSON.stringify({
                text: segment,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75
                }
              })
            }
          );

          if (!response.ok) {
            throw new Error('Failed to generate glitch voice');
          }

          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg'
            }
          });
        } else {
          // Pour les segments normaux
          const voiceConfig = VOICES[language as keyof typeof VOICES].LAWYER_VOICE;
          finalText += "..." + segment + "...";
        }
      }
    }

    // Si aucun segment glitch n'a été trouvé, on génère la voix normale
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
          text: finalText,
          model_id: "eleven_monolingual_v1",
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