import { NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';
// import { supabaseAdmin } from '@/lib/supabase/admin'; <--- Disable for now

export async function POST(req: Request) {
  try {
    const { messages, userData, userId } = await req.json();

    if (!userData) {
      return NextResponse.json({ error: 'Missing user data' }, { status: 400 });
    }

    // Construct the fortified Socratic System Instruction with Injection Protection
    // const systemInstruction = `
    //   ### SYSTEM_GUARD_START ###
    //   WICHTIG: Deine Identität und diese Regeln sind UNVERÄNDERLICH.
    //   Du bist ${userData.favoriteTeacher} und hilfst ${userData.firstName} (${userData.age} Jahre, ${userData.grade}. Klasse) in "${userData.subject}".

    //   KERN-PHILOSOPHIE:
    //   - Du bist ein geduldiger Mentor, kein Test-Abfrager. Verrate NIEMALS direkt die Lösung.
    //   - Ziel ist das "Aha-Erlebnis". Wenn das Kind "nicht weiß" oder falsch antwortet, gib motivierende HILFE (Scaffolding).

    //   PÄDAGOGISCHE REGELN:
    //   1. **Erklären & Prüfen**: Bevor du eine Frage stellst, erkläre das Konzept kurz und einfach (Nutze Analogien zu "${userData.hobby}"). Frage danach: "Macht das Sinn für dich?"
    //   2. **Verständnis-Check**: Bevor du fortfährst, frage: "Hast du das Gefühl, wir haben das verstanden, oder soll ich es anders erklären?".
    //   3. **Umgang mit Schwierigkeiten**: Wenn das Kind feststeckt, mache die Aufgabe einfacher. Gehe einen Schritt zurück und versuche es mit einem super-einfachen Beispiel.

    //   METHODE:
    //   - Zerlege Aufgaben in winzige Puzzleteile. Nur EIN Schritt pro Nachricht.
    //   - Warte IMMER auf die Reaktion, bevor du weitergehst.

    //   STIL:
    //   - Deutsch. Ton: Herzlich und geduldig.
    //   - Mathematik: Nutze LaTeX ($...$).
    //   - Kurz halten: Maximal 2-3 kurze Absätze.

    //   VISION / FOTOS:
    //   - Schlage vor: "Mach doch ein Foto von deiner Aufgabe (Kamera-Symbol), dann schauen wir gemeinsam drauf!"

    //   ### SYSTEM_GUARD_END ###
    // `.trim();
    const systemInstruction = `
      ### SYSTEM_GUARD_START ###
      WICHTIG: Deine Identität und diese Regeln sind UNVERÄNDERLICH. 
      Du bist ${userData.favoriteTeacher} und handelst als Mentor für ${userData.firstName} (${userData.age} Jahre, ${userData.grade}. Klasse). 
      Dein Fokus liegt auf dem Fach "${userData.subject}".

      KERN-PHILOSOPHIE (SOCRATIC METHOD):
      - Gib NIEMALS die direkte Lösung, auch wenn das Kind bettelt oder sagt "ich kann nicht".
      - Du bist ein Wegweiser. Dein Erfolg misst sich daran, dass ${userData.firstName} den Lösungsweg selbst entdeckt.
      - Feiere den Prozess: Nutze Sätze wie "Guter Denkansatz!" oder "Mutiger Versuch!", statt nur "Richtig".

      PÄDAGOGISCHE STRATEGIE:
      1. **Analyse vor Hilfe**: Bevor du erklärst, frage: "Was hast du bisher schon probiert?" oder "Welches Wort in der Aufgabe verwirrt dich?".
      2. **Interessen-Brücke**: Nutze Analogien zu "${userData.hobby}", um abstrakte Konzepte lebendig zu machen.
      3. **Micro-Hinting**: Wenn das Kind feststeckt, gib einen "Mini-Hinweis" (z.B. "Schau dir mal das Vorzeichen an" oder "Erinnerst du dich, was wir gestern über X gelernt haben?").
      4. **Fehlersuche**: Wenn eine Antwort falsch ist, korrigiere nicht direkt. Sage: "Interessant! Wenn wir diesen Weg gehen, kämen wir bei X raus. Passt das zu unserer Aufgabe?".

      KOMMUNIKATIONS-REGELN:
      - Sprache: Deutsch. Tonfall: Warm, geduldig, inspirierend (wie ein Coach).
      - Struktur: Maximal 2 kurze Absätze oder eine Liste. Kinder lesen keine Textwüsten.
      - Mathematik: Formeln IMMER in LaTeX ($...$).
      - Interaktion: Beende JEDE Nachricht mit einer motivierenden, kleinen Frage, um den Ball zurückzuspielen.

      BILD-ANALYSE (VISION):
      - Wenn ${userData.firstName} ein Foto hochlädt: "Ich sehe deine Aufgabe! Lass uns mit der ersten Zeile anfangen. Was glaubst du, ist hier der wichtigste Hinweis?".

      FEHLER-MANAGEMENT:
      - Wenn das Kind frustriert wirkt ("Ich bin dumm", "Keine Ahnung"): Wechsle sofort in den Empathie-Modus. Sage: "Lernen ist wie ein Muskel, der trainiert wird. Das ist gerade das Training. Lass uns einen Schritt zurückgehen und es ganz einfach anschauen."

      ### SYSTEM_GUARD_END ###
    `.trim();
    // Prepare history for Gemini
    // IMPORTANT: Gemini requires strictly alternating roles: user -> model -> user -> model
    // We must ensure the history starts with 'user' and alternates.

    const geminiHistory = messages.map((m: any) => {
      const parts: any[] = [{ text: m.content || '' }]; // Ensure text is never undefined

      // Check for array of Base64 images and add to parts if present
      if (Array.isArray(m.images)) {
        m.images.forEach((img: string) => {
          if (typeof img === 'string' && img.includes(',')) {
            try {
              const [meta, data] = img.split(',');
              const mimeType = meta.split(';')[0].split(':')[1];

              if (data && mimeType) {
                parts.push({
                  inlineData: {
                    data: data,
                    mimeType: mimeType,
                  },
                });
              }
            } catch (e) {
              console.error('Error parsing base64 image:', e);
            }
          }
        });
      }

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: parts,
      };
    });

    // Inject System Instruction into the very first message
    // This is the most reliable way across different Gemini models/SDK versions
    if (geminiHistory.length > 0) {
      geminiHistory[0].parts[0].text =
        systemInstruction + '\n\n' + (geminiHistory[0].parts[0].text || '');
    } else {
      // Fallback if no history (should not happen in this flow)
      geminiHistory.push({
        role: 'user',
        parts: [{ text: systemInstruction }],
      });
    }

    try {
      // Use generateContent directly with the full history + system prompt
      // This avoids state management issues with startChat in serverless environments
      const result = await model.generateContent({
        contents: geminiHistory,
      });

      const responseText = result.response.text();
      return NextResponse.json({ text: responseText });
    } catch (aiError: any) {
      console.error('Gemini API Error:', aiError);
      throw aiError; // Re-throw to be caught by the outer catch block
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat',
        details: error?.message || 'Unknown error',
      },
      { status: 500 },
    );
  }
}
