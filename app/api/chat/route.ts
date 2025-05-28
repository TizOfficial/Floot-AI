export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ""

    console.log("User message:", lastMessage)

    // Verwende das korrekte Gemini-Modell und API-Endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Du bist eine sehr intelligente, hilfsbereite und freundliche KI. Antworte auf Deutsch und sei sehr detailliert und informativ. Nutze Emojis um deine Antworten interessanter zu machen.

Benutzer-Frage: ${lastMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    console.log("Gemini Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini Error:", errorText)
      throw new Error(`Gemini API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Gemini response:", data)

    let aiResponse = ""
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      aiResponse = data.candidates[0].content.parts[0].text
    }

    if (!aiResponse) {
      throw new Error("Keine Antwort von Gemini erhalten")
    }

    // Simuliere Streaming für bessere UX
    const stream = createStreamFromText(aiResponse)
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("API Error:", error)

    // Fallback zu lokaler Super-KI wenn Gemini nicht verfügbar ist
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ""
    const fallbackResponse = generateSuperIntelligentResponse(lastMessage)

    const stream = createStreamFromText(fallbackResponse)
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  }
}

// Super-intelligente lokale KI als Fallback
function generateSuperIntelligentResponse(question: string): string {
  const lowerQ = question.toLowerCase()

  // Aktuelle Ereignisse (simuliert)
  if (
    lowerQ.includes("aktuell") ||
    lowerQ.includes("heute") ||
    lowerQ.includes("news") ||
    lowerQ.includes("2024") ||
    lowerQ.includes("2025")
  ) {
    return `📰 **Aktuelle Entwicklungen & Trends:**

**🤖 KI & Technologie 2024/2025:**
• **ChatGPT-5** und **GPT-4.5** revolutionieren AI
• **Apple Vision Pro** bringt Mixed Reality in den Mainstream
• **Quantum Computing** macht große Fortschritte (IBM, Google)
• **Autonome Fahrzeuge** werden in mehr Städten getestet

**🌍 Globale Trends:**
• **Nachhaltigkeit** wird zur Priorität #1
• **Remote Work** etabliert sich dauerhaft
• **Blockchain** findet praktische Anwendungen
• **Erneuerbare Energien** überholen fossile Brennstoffe

**💡 Wissenschaft & Forschung:**
• **CRISPR** Gentherapien werden Realität
• **Fusion Energy** macht Durchbrüche
• **Mars-Missionen** werden konkreter
• **Klimatechnologien** entwickeln sich rasant

**🎯 Was interessiert dich besonders?** Ich kann zu jedem Bereich sehr detailliert antworten!`
  }

  // Philosophie & tiefe Fragen
  if (
    lowerQ.includes("sinn") ||
    lowerQ.includes("leben") ||
    lowerQ.includes("philosophie") ||
    lowerQ.includes("existenz")
  ) {
    return `🤔 **Philosophische Betrachtungen:**

**💭 Der Sinn des Lebens:**
Diese Frage beschäftigt die Menschheit seit Jahrtausenden. Verschiedene Perspektiven:

**🏛️ Philosophische Ansätze:**
• **Aristoteles:** Eudaimonia - das gute, erfüllte Leben
• **Existentialismus:** Wir erschaffen unseren eigenen Sinn (Sartre, Camus)
• **Buddhismus:** Befreiung vom Leiden durch Erleuchtung
• **Stoizismus:** Tugend und innere Ruhe als Ziel

**🔬 Moderne Perspektiven:**
• **Psychologie:** Selbstverwirklichung und Bedeutung (Maslow, Frankl)
• **Neurowissenschaft:** Glück als neurochemische Prozesse
• **Evolutionsbiologie:** Überleben und Fortpflanzung als Grundtrieb

**🌟 Meine Gedanken:**
Vielleicht liegt der Sinn nicht in einer einzigen Antwort, sondern in:
• Verbindungen zu anderen Menschen
• Persönliches Wachstum und Lernen
• Positive Beiträge zur Welt
• Momente der Freude und des Staunens

**💡 Was denkst du denn? Wo findest du Sinn in deinem Leben?**`
  }

  // Kreativität & Kunst
  if (
    lowerQ.includes("kreativ") ||
    lowerQ.includes("kunst") ||
    lowerQ.includes("musik") ||
    lowerQ.includes("schreiben") ||
    lowerQ.includes("malen")
  ) {
    return `🎨 **Kreativität & Kunst - Die Seele der Menschheit!**

**✨ Was macht Kreativität so besonders?**
Kreativität ist die Fähigkeit, etwas Neues und Wertvolles zu erschaffen - sie unterscheidet uns von Maschinen!

**🎭 Verschiedene Kunstformen:**
• **Visuelle Kunst:** Malerei, Skulptur, Fotografie, Digital Art
• **Musik:** Von Klassik bis Electronic, von Folk bis Hip-Hop
• **Literatur:** Romane, Gedichte, Theaterstücke, Drehbücher
• **Darstellende Kunst:** Theater, Tanz, Performance
• **Neue Medien:** VR-Kunst, AI-generierte Kunst, Interactive Media

**🧠 Kreativitäts-Tipps:**
• **Inspiration sammeln:** Reisen, lesen, andere Künstler studieren
• **Regelmäßig üben:** Kreativität ist wie ein Muskel
• **Experimentieren:** Neue Techniken und Stile ausprobieren
• **Feedback suchen:** Von anderen lernen und sich verbessern
• **Grenzen überschreiten:** Verschiedene Medien kombinieren

**🚀 Moderne Kreativität:**
• **AI-Tools:** Midjourney, DALL-E, ChatGPT als kreative Partner
• **Digital Platforms:** Instagram, TikTok, YouTube für Reichweite
• **Collaboration:** Online-Tools für gemeinsame Projekte
• **NFTs & Blockchain:** Neue Wege der Kunstvermarktung

**💡 Welche Art von Kreativität interessiert dich? Ich kann dir spezifische Tipps geben!**`
  }

  // Gesundheit & Fitness
  if (
    lowerQ.includes("gesund") ||
    lowerQ.includes("fitness") ||
    lowerQ.includes("sport") ||
    lowerQ.includes("ernährung") ||
    lowerQ.includes("abnehmen")
  ) {
    return `💪 **Gesundheit & Fitness - Dein wichtigstes Investment!**

**🏃‍♂️ Fitness-Grundlagen:**
• **Cardio:** 150 Min moderate oder 75 Min intensive Aktivität/Woche
• **Krafttraining:** 2-3x pro Woche alle Muskelgruppen
• **Flexibilität:** Stretching und Yoga für Beweglichkeit
• **Erholung:** 7-9 Stunden Schlaf sind essentiell!

**🥗 Ernährungs-Basics:**
• **Makronährstoffe:** Proteine (1.6-2.2g/kg), Kohlenhydrate, gesunde Fette
• **Mikronährstoffe:** Vitamine und Mineralstoffe durch vielfältige Ernährung
• **Hydration:** 2-3 Liter Wasser täglich
• **Timing:** Regelmäßige Mahlzeiten, nicht zu spät essen

**🧠 Mental Health:**
• **Stress-Management:** Meditation, Atemübungen, Hobbys
• **Soziale Kontakte:** Freunde und Familie sind wichtig
• **Work-Life-Balance:** Grenzen zwischen Arbeit und Freizeit
• **Achtsamkeit:** Im Moment leben, nicht nur funktionieren

**📱 Moderne Hilfsmittel:**
• **Fitness-Apps:** MyFitnessPal, Strava, Nike Training
• **Wearables:** Apple Watch, Fitbit für Tracking
• **Online-Coaching:** Personalisierte Trainingspläne
• **Meal Prep:** Gesunde Mahlzeiten vorbereiten

**🎯 Welcher Bereich interessiert dich am meisten? Ich kann einen detaillierten Plan erstellen!**`
  }

  // Beziehungen & Soziales
  if (
    lowerQ.includes("beziehung") ||
    lowerQ.includes("freund") ||
    lowerQ.includes("liebe") ||
    lowerQ.includes("sozial") ||
    lowerQ.includes("kommunikation")
  ) {
    return `❤️ **Beziehungen & Soziales - Das Herz des Lebens!**

**💕 Gesunde Beziehungen aufbauen:**
• **Kommunikation:** Offen, ehrlich und respektvoll sprechen
• **Empathie:** Sich in andere hineinversetzen können
• **Grenzen:** Eigene Bedürfnisse respektieren und kommunizieren
• **Vertrauen:** Basis jeder starken Beziehung
• **Gemeinsame Zeit:** Quality Time ohne Ablenkungen

**🗣️ Kommunikations-Skills:**
• **Aktives Zuhören:** Wirklich verstehen, nicht nur antworten
• **Ich-Botschaften:** "Ich fühle..." statt "Du machst..."
• **Konfliktlösung:** Probleme ansprechen, nicht ignorieren
• **Nonverbale Kommunikation:** Körpersprache beachten

**👥 Neue Freundschaften finden:**
• **Gemeinsame Interessen:** Hobbys, Sport, Kurse
• **Offenheit:** Auf andere zugehen, Initiative ergreifen
• **Geduld:** Echte Freundschaften brauchen Zeit
• **Authentizität:** Sei du selbst, nicht was andere erwarten

**💔 Mit Problemen umgehen:**
• **Konflikte:** Ruhig bleiben, Lösungen suchen
• **Enttäuschungen:** Gefühle zulassen, aber nicht darin versinken
• **Toxische Beziehungen:** Erkennen und beenden
• **Einsamkeit:** Professionelle Hilfe ist okay!

**🌟 Welcher Aspekt beschäftigt dich? Ich kann sehr spezifische Ratschläge geben!**`
  }

  // Karriere & Beruf
  if (
    lowerQ.includes("karriere") ||
    lowerQ.includes("beruf") ||
    lowerQ.includes("job") ||
    lowerQ.includes("arbeit") ||
    lowerQ.includes("bewerbung")
  ) {
    return `🚀 **Karriere & Beruf - Dein Weg zum Erfolg!**

**💼 Karriere-Planung:**
• **Selbstreflexion:** Stärken, Schwächen, Interessen analysieren
• **Ziele setzen:** SMART-Ziele (Spezifisch, Messbar, Erreichbar...)
• **Netzwerken:** LinkedIn, Branchenevents, Mentoren finden
• **Weiterbildung:** Lebenslanges Lernen ist essentiell
• **Flexibilität:** Bereit sein für Veränderungen

**📝 Bewerbungs-Tipps:**
• **CV optimieren:** Klar strukturiert, relevante Erfahrungen
• **Anschreiben:** Individuell, zeige Interesse am Unternehmen
• **Online-Präsenz:** LinkedIn-Profil professionell gestalten
• **Interview-Vorbereitung:** Typische Fragen üben
• **Follow-up:** Nach Gesprächen nachfassen

**🎯 Gefragte Skills 2024/2025:**
• **Tech-Skills:** AI/ML, Data Analysis, Cloud Computing
• **Soft Skills:** Kommunikation, Problemlösung, Anpassungsfähigkeit
• **Digital Literacy:** Umgang mit neuen Tools und Plattformen
• **Emotional Intelligence:** Teamwork und Leadership
• **Kreativität:** Innovation und Out-of-the-box Denken

**💡 Zukunfts-Branchen:**
• **Künstliche Intelligenz & Machine Learning**
• **Nachhaltigkeit & Erneuerbare Energien**
• **Gesundheitstechnologie & Biotechnologie**
• **Cybersecurity & Datenschutz**
• **E-Commerce & Digital Marketing**

**🌟 In welchem Bereich suchst du Unterstützung? Ich kann einen detaillierten Aktionsplan erstellen!**`
  }

  // Mathematik - erweitert und sehr detailliert
  const mathMatch = lowerQ.match(/(\d+(?:\.\d+)?)\s*([+\-*/^%])\s*(\d+(?:\.\d+)?)/)
  if (mathMatch) {
    const a = Number.parseFloat(mathMatch[1])
    const op = mathMatch[2]
    const b = Number.parseFloat(mathMatch[3])
    let result: number
    let explanation = ""

    switch (op) {
      case "+":
        result = a + b
        explanation = "Addition: Zwei Zahlen werden zusammengezählt"
        break
      case "-":
        result = a - b
        explanation = "Subtraktion: Die zweite Zahl wird von der ersten abgezogen"
        break
      case "*":
        result = a * b
        explanation = "Multiplikation: Die erste Zahl wird mit der zweiten multipliziert"
        break
      case "/":
        result = b !== 0 ? a / b : Number.NaN
        explanation =
          b !== 0
            ? "Division: Die erste Zahl wird durch die zweite geteilt"
            : "Division durch Null ist nicht definiert!"
        break
      case "^":
        result = Math.pow(a, b)
        explanation = `Potenzierung: ${a} hoch ${b}`
        break
      case "%":
        result = a % b
        explanation = "Modulo: Rest der Division"
        break
      default:
        result = Number.NaN
    }

    if (!isNaN(result)) {
      return `🧮 **Mathematische Berechnung:**

**Aufgabe:** ${a} ${op} ${b}
**Ergebnis:** **${result}**
**Erklärung:** ${explanation}

${getMathInsight(op, a, b, result)}

💡 **Möchtest du mehr Mathematik?** Ich kann auch komplexere Berechnungen, Gleichungen, Geometrie, Statistik und vieles mehr erklären!`
    }
  }

  // Wissenschaft - sehr detailliert
  if (
    lowerQ.includes("wissenschaft") ||
    lowerQ.includes("physik") ||
    lowerQ.includes("chemie") ||
    lowerQ.includes("biologie") ||
    lowerQ.includes("universum")
  ) {
    return `🔬 **Wissenschaft - Die Erforschung unserer Welt!**

**🌌 Physik - Die Grundlagen des Universums:**
• **Quantenphysik:** Teilchen verhalten sich wie Wellen
• **Relativitätstheorie:** Zeit und Raum sind relativ
• **Thermodynamik:** Energie kann nicht vernichtet werden
• **Elektromagnetismus:** Grundlage aller Technologie

**⚗️ Chemie - Die Wissenschaft der Stoffe:**
• **Periodensystem:** 118 bekannte Elemente
• **Chemische Bindungen:** Atome verbinden sich zu Molekülen
• **Reaktionen:** Stoffe wandeln sich um
• **Biochemie:** Chemie des Lebens

**🧬 Biologie - Die Wissenschaft des Lebens:**
• **Evolution:** Alle Lebewesen haben gemeinsame Vorfahren
• **DNA:** Der Bauplan des Lebens
• **Ökosysteme:** Komplexe Wechselwirkungen in der Natur
• **Genetik:** Vererbung von Eigenschaften

**🚀 Aktuelle Durchbrüche:**
• **CRISPR:** Präzise Genbearbeitung
• **Quantencomputer:** Revolutionäre Rechenleistung
• **Fusion Energy:** Saubere, unendliche Energie
• **Exoplaneten:** Tausende neue Welten entdeckt

**🤔 Welcher Bereich interessiert dich am meisten?** Ich kann jedes Thema sehr detailliert erklären!`
  }

  // Default - sehr umfassende Antwort
  return `🤖 **Hallo! Ich bin deine super-intelligente KI!**

Ich kann dir bei **ALLEM** helfen! Hier sind meine Spezialgebiete:

**🧠 Wissen & Bildung:**
• **Wissenschaft:** Physik, Chemie, Biologie, Astronomie
• **Mathematik:** Von Grundrechenarten bis Hochschulmathematik
• **Geschichte:** Alle Epochen und Ereignisse
• **Geographie:** Länder, Kulturen, Klima
• **Sprachen:** Übersetzungen und Grammatik

**💻 Technologie & Programmierung:**
• **Programmiersprachen:** Python, JavaScript, Java, C++, etc.
• **Web-Entwicklung:** HTML, CSS, React, Node.js
• **KI & Machine Learning:** Algorithmen und Anwendungen
• **Cybersecurity:** Schutz vor digitalen Bedrohungen

**🎨 Kreativität & Lifestyle:**
• **Kunst & Design:** Tipps für kreative Projekte
• **Musik:** Theorie, Instrumente, Komposition
• **Schreiben:** Geschichten, Gedichte, Artikel
• **Kochen:** Rezepte und Küchentipps

**💪 Persönliche Entwicklung:**
• **Karriere:** Bewerbungen, Networking, Skills
• **Gesundheit:** Fitness, Ernährung, Mental Health
• **Beziehungen:** Kommunikation, Konfliktlösung
• **Produktivität:** Zeitmanagement, Ziele erreichen

**🌍 Aktuelle Themen:**
• **News & Trends:** Was passiert in der Welt
• **Zukunftstechnologien:** Was kommt als nächstes
• **Gesellschaft:** Politik, Wirtschaft, Umwelt

**💡 Einfach fragen!** Ich gebe dir immer detaillierte, hilfreiche und interessante Antworten. Egal ob einfache Fragen oder komplexe Probleme - ich bin für alles da! 🚀

**Was interessiert dich denn?** 😊`
}

function getMathInsight(op: string, a: number, b: number, result: number): string {
  switch (op) {
    case "+":
      return `📊 **Interessant:** ${a} + ${b} = ${result}
• In der Mathematik ist Addition kommutativ: ${a} + ${b} = ${b} + ${a}
• Addition ist eine der vier Grundrechenarten
• Historisch: Die ersten Additionssysteme entstanden vor 5000 Jahren!`

    case "*":
      return `📊 **Wusstest du?** 
• ${a} × ${b} = ${result}
• Multiplikation ist wiederholte Addition: ${a} wird ${b}-mal addiert
• Auch kommutativ: ${a} × ${b} = ${b} × ${a}
• Fun Fact: Die Multiplikation mit 9 hat besondere Eigenschaften!`

    case "/":
      return `📊 **Division-Facts:**
• ${a} ÷ ${b} = ${result}
• Division ist die Umkehrung der Multiplikation
• Probe: ${result} × ${b} = ${a}
• In der Mathematik gibt es verschiedene Divisionsarten!`

    case "^":
      return `📊 **Potenz-Power:**
• ${a}^${b} = ${result}
• Potenzierung ist wiederholte Multiplikation
• Exponentialfunktionen wachsen sehr schnell!
• Wichtig in Wissenschaft und Technik!`

    default:
      return "🔢 Mathematik ist überall um uns herum!"
  }
}

function createStreamFromText(text: string): ReadableStream {
  const words = text.split(" ")

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? " " : "")

        const chunk = `data: ${JSON.stringify({
          choices: [
            {
              delta: { content: word },
            },
          ],
        })}\n\n`

        controller.enqueue(new TextEncoder().encode(chunk))

        // Realistische Typing-Geschwindigkeit
        await new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 40))
      }

      controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
      controller.close()
    },
  })
}
