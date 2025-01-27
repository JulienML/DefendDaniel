import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json(
                { error: 'Le texte est requis' },
                { status: 400 }
            );
        }

        // Logique de traitement du texte ici
        const processedText = text.toUpperCase(); // exemple simple

        return NextResponse.json({
            success: true,
            result: processedText
        });

    } catch (_error: unknown) {
        console.log('error:', _error)
        return NextResponse.json(
            { error: 'Erreur lors de la génération de la question' },
            { status: 500 }
        );
    }
}