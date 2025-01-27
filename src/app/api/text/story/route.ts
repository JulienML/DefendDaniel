import { NextResponse } from 'next/server';
import { Mistral } from "@mistralai/mistralai";

interface Story {
    description: string;
    alibi: string[];
    problematic: string[];
}

const mistral = new Mistral({apiKey: process.env.MISTRAL_API_KEY})

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { language = 'fr' } = body;

        const prompts = {
            fr: `Vous êtes passé maître dans l'art de générer de fausses histoires de procès.
                Choisissez un mot réel totalement aléatoire et générez une fausse histoire, intégrant ce mot, d'un homme nommé Daniel accusé dans un procès.
                L'histoire doit être cohérente et tenir en 1 ou 2 phrases.
                Pouvez-vous donner la réponse dans un format json ?
                Trouvez 3 alibis. Ils doivent être crédibles et concis.
                RÉPONDRE UNIQUEMENT AVEC LE JSON`,
            en: `You're a master in generating fake trial stories.
                Choose a completly random real word and generate a fake story, integrating this word, of a guy named Daniel accused in trail.
                The story must be coherent and must fit into 1 or 2 sentences.
                Can you give the answer in a json format?
                Find 3 alibis. They must be credible and concise.
                ANSWER WITH ONLY THE JSON`,
            es: `Eres un maestro en generar historias falsas de juicios.
                Elige una palabra real completamente aleatoria y genera una historia falsa, integrando esta palabra, de un tipo llamado Daniel acusado en juicio.
                La historia debe ser coherente y debe caber en 1 o 2 frases.
                ¿Puedes dar la respuesta en formato json?
                Encuentra 3 coartadas. Deben ser creíbles y concisas.
                RESPONDER SÓLO CON EL JSON`
        };

        const chatPrompt = `${prompts[language as keyof typeof prompts] || prompts.fr}
            accusation: {
                description: String,
                alibi: [<String>],
            }`;

        const seed = Math.floor(Math.random() * 1000000);

        const response = await mistral.chat.complete({
            model: "mistral-large-latest",
            messages: [{role: 'user', content: chatPrompt}],
            responseFormat: {type: 'json_object'},
            randomSeed: seed,
        });

        const functionCall = response.choices?.[0]?.message.content;
        const JSONResponse = functionCall ? JSON.parse(functionCall as string) : null;
        const storyData: Story = JSONResponse?.accusation || {
            description: "Erreur de génération",
            alibi: [],
            problematic: []
        };

        return NextResponse.json({
            success: true,
            story: storyData
        });

    } catch (error: unknown) {
        console.log('error:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la génération de l\'histoire' },
            { status: 500 }
        );
    }
}