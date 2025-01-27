import { NextResponse } from 'next/server';
import { Mistral } from "@mistralai/mistralai";

type Language = 'fr' | 'en' | 'es';

const mistral = new Mistral({apiKey: process.env.MISTRAL_API_KEY})

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { language, story, chat } = body;

        const chatHistory = chat.messages
          .map((m: { role: string; content: string }) =>
            `${m.role === 'judge' ? 'Judge' : 'Lawyer'}: ${m.content}`
          )
          .join('\n');

        const prompts = {
            fr: `Pouvez-vous trouver 1 question amusante pour réfuter les alibis que le juge pourrait poser à l'avocat de l'accusé dans cette affaire ?
                (ne demandez pas de dessiner ou de faire des gestes, seulement des réponses textuelles), La question doit commencer par "Pourquoi" ou "J'aimerais savoir" etc.
                Cette question doit être nouvelle: elle n'apparaît pas dans l'historiques de la discussion.
                Pouvez-vous aussi donner 3 mots aléatoires *mais réels* que l'avocat devra ajouter à son discours. Ces mots doivent être simple, drole, reliés a l'affaire ou des mots ou expressions embarassantes pour un statut d'avocat (ex: "euuuh, et voila quoi..").
                Ces mots doivent aussi être nouveaux: ils n'apparaissent pas dans l'historique de la discussion.
                Je veux un mot en lien avec le case. 
                Je veux un mot ou expression embarassante pour un avocat.
                Je veux un mot simple et drole.
                RÉPONDEZ UNIQUEMENT AVEC LE JSON
                N'AJOUTEZ PAS DE MOTS QUI ONT DÉJÀ ÉTÉ ENVOYÉS
                Voici le contexte de l'affaire :

                description de l'histoire : ${story.description}
                alibis : ${story.alibi.join(', ')}
                history : ${chat.messages.length > 0 ? `historique de la discussion : ${chatHistory}` : 'Vide'}

                Je veux egalement une réaction a la derniere réponse de l'avocat. Cela peut etre des "Hmmm, d'accord" ou alors "Vous ne m'avez pas vraiment convaincu... Pourquoi parlez vous de ...".
                Prends le role du juge et reponds avec condescendance. Cela doit etre dans un champ json "reaction" different de "question".
                Parcontre la reaction ne doit pas finir par une question. Elle doit finir par trois petits points '...'
                si history est vide, ne mettez pas reaction dans le json.

                Réponse en JSON avec ce format :
                {
                    "reaction" : "Votre réaction incisive ici",
                    "question" : " Votre question incisive de juge ici ",
                    "words" : [" expression1 ", " expression2 ", " expression3 "].
                }`,
            en: `can you find 1 fun questions to refute the alibis the judge could ask the lawyer of the accused about this case ?
                (do not ask to draw or to gesture, only text answers), The question must start with "Why" or "I would like to know" etc.
                This question must be new: it doesn't appear in the history of the discussion.
                Can you also give 3 random *but real* words for the lawyer to add to his speech. These words should be simple, funny, related to the case or embarrassing words or phrases for a lawyer (e.g. “uh huh, here goes nothing”).
                These words must also be new: they don't appear in the discussion history.
                I want a word related to the case.
                I want a word or phrase embarassant for a lawyer.
                I want a simple and funny word.
                ANSWER WITH ONLY THE JSON
                DO NOT ADD WORDS THAT HAVE ALREADY BEEN SENT
                Here is the context of the case :

                story description: ${story.description}
                alibis: ${story.alibi.join(', ')}
                history: ${chat.messages.length > 0 ? `discussion history: ${chatHistory}` : 'Empty'}

                I want a reaction to the last answer of the lawyer. This could be "Hmmm, okay.." or then "You didn't really convince me... Why are you talking about ...".
                Take the role of the judge and answer with condescendance. This must be in a json field "reaction" different from "question".
                The reaction must not end with a question. It has to finish with three dots '...'
                If history is empty, do not put reaction in the json.

                Answer in JSON with this format:
                {
                    "reaction": "Your incisive reaction here",
                    "question": "Your incisive judge question here",
                    "words": ["expression1", "expression2", "expression3"]
                }`,
            es: `¿puedes encontrar 1 preguntas divertidas para refutar las coartadas que el juez podría hacer al abogado del acusado sobre este caso?
                (no pidas dibujar o gesticular, sólo respuestas de texto), La pregunta debe comenzar con "Por qué" o "Me gustaría saber" etc.
                Esta pregunta debe ser nueva: no aparece en la historia del debate.
                También puedes dar 3 palabras aleatorias *pero reales* para que el abogado las añada a su discurso. Estas palabras deben ser sencillas, divertidas, relacionadas con el caso o palabras o frases embarazosas para un abogado (por ejemplo, «uh huh, aquí vamos..»).
                Estas palabras también deben ser nuevas: no aparecen en la historia del debate.
                Quiero una palabra relacionada con el caso.
                Quiero una palabra o frase embarazosa para un abogado.
                Quiero una palabra simple y divertida.
                RESPONDA SÓLO CON EL JSON
                NO AÑADAS PALABRAS QUE YA HAYAN SIDO ENVIADAS
                Aquí está el contexto del caso :

                descripción de la historia: ${story.description}
                coartadas: ${story.alibi.join(', ')}
                history: ${chat.messages.length > 0 ? `historia de la discusión: ${chatHistory}` : 'vacío'}

                Quiero una reacción a la última respuesta del abogado. Esto podría ser "Hmmmm, entonces..." o "No me has convencido... ¿Por qué hablas de...".
                Toma el papel del juez y responde con condescendencia. Cela debe estar en un campo json "reaction" diferente de "question".
                La reacción no debe terminar con una pregunta. It has to finish with three dots '...'
                Si history está vacío, no pongas reacción en el json.

                Respuesta en JSON con este formato:
                {
                    "reaction": "Tu reacción incisiva aquí",
                    "question": "Tu incisiva pregunta de juez aquí",
                    "words": ["expresión1", "expresión2", "expresión3"]
                }`
        };


        const seed = Math.floor(Math.random() * 1000000);


        const response = await mistral.chat.complete({
            model: "mistral-large-latest",
            messages: [{role: 'user', content: prompts[language as Language]}],
            responseFormat: {type: 'json_object'},
            randomSeed: seed,
        });


        const functionCall = response.choices?.[0]?.message.content;
        const JSONResponse = functionCall ? JSON.parse(functionCall as string) : null;


        return NextResponse.json(JSONResponse || {
            'question': 'Erreur de génération de question',
            'words': [],
            'status': 'error',
        });

    } catch (error: unknown) {
        console.log('error:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la génération de la question' },
            { status: 500 }
        );
    }
}