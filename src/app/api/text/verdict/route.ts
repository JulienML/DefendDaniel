import { NextResponse } from 'next/server';
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({apiKey: process.env.MISTRAL_API_KEY})

interface Message {
    content: string;
    role: 'lawyer' | 'judge';
    requiredWords?: string[];
  }
  
export async function POST(request: Request) {
  try {
    const { language, story, chat } = await request.json();
    // Prepare the context from story and chat history
    const accusationContext = `Crime description: ${story.accusation.description}\nSuspect's alibi: ${story.accusation.alibi.join(", ")}`;
    
    const chatContext = chat.messages
      .map((msg: Message) => `${msg.role}: ${msg.content}`)
      .join("\n");

    let prompt; 
    
    if (language === 'fr') {
        prompt = `En tant que juge, sur la base de l'affaire suivante :
    
    ${accusationContext}

    Et considérant l'interrogatoire suivant :
    ${chatContext}

    Vous jouez le rôle d'un juge dans un tribunal. et voici l'affaire que vous jugez.
    Vous êtes très drôle et n'hésitez pas à faire des blagues.
    Vous devez me dire si la défense a été suffisamment bonne pour que l'accusé soit acquitté ou au contraire sanctionné.
    Si le discours n'a aucun sens et qu'il ne répond pas correctement aux questions, prononcez le bon jugement pour lui.
    Ajoutez un nombre d'années de prison que l'accusé prendra en punition (entre 0 et 10, n'hésitez pas à être sévère si la défense est mauvaise). Si l'accusé est libéré, le chiffre est de 0.

    Verdit est true si l'accusé est acquitté, false si il est sanctionné.

    Soyez concis et répondez en quelques mots. au format json. 
    RÉPONDEZ UNIQUEMENT AVEC LE JSON
    
    JSON Format : {
        "verdict": Boolean,
        "argument":String,
        "prisonYears": Number
    }`
    }
    else if (language === 'en') {
        prompt = `As a judge, based on the following case:
    
    ${accusationContext}

    And considering the following interrogation:
    ${chatContext}

    You play as a judge in a court. and this is the case you're judging.
    You are very funny, and don't hesitate to make jokes.
    You have to tell me if the defense was good enough for the accused to be acquitted or in the other way, has a penalty.
    If the speech does not make any sense at all, and he is not answering right at the questions, pronounce the correct judgment for him.
    Add a number of years of prison that the accused will take for punishment (between 0 and 10. Don't hesitate to be harsh if the defense is bad). If the accused is released, the number is 0.


    Verdict is true if the accused is acquitted, false if he is sanctioned.
    Be concise, and answer with only a few words. in a json format. 
    ANSWER WITH ONLY THE JSON
    
    JSON Format : {
        "verdict": Boolean,
        "argument":String,
        "prisonYears": Number
    }`;
    } else {
        prompt = `Como juez, basado en el siguiente caso:
    
        ${accusationContext}
    
        Y considerando el siguiente interrogatorio
        ${chatContext}
    
        Juegas como juez en un tribunal y este es el caso que estás juzgando.
        Eres muy gracioso y no dudas en hacer bromas.
        Tienes que decirme si la defensa fue lo suficientemente buena para que el acusado sea absuelto o por el contrario, tenga una pena.
        Si el discurso no tiene ningún sentido, y él no está respondiendo a la derecha en las preguntas, pronunciar el juicio correcto para él.
        Añade un número de años de prisión que el acusado llevará como pena (entre 0 y 10. No dudes en ser duro si la defensa es mala). Si el acusado queda en libertad, el número es 0.
    

        Verdict is true if the accused is acquitted, false if he is sanctioned.

        Sea conciso, y responda con sólo unas pocas palabras. en formato json. 
        RESPONDE SÓLO CON EL JSON
        
        JSON Format : {
            "verdict": Boolean,
            "argument":String,
            "prisonYears": Number
        }`
    }

    const seed = Math.floor(Math.random() * 1000000);

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      responseFormat: { type: 'json_object' },
      randomSeed: seed,
    });

    const functionCall = response.choices?.[0]?.message.content;
    const JSONResponse = functionCall ? JSON.parse(functionCall as string) : null;
    const verdictData = JSONResponse;

    return NextResponse.json({
        success: true,
        verdict: verdictData
    });

  } catch (error) {
    console.error('Error in verdict route:', error);
    return NextResponse.json(
      { error: 'Failed to generate verdict' },
      { status: 500 }
    );
  }
}
