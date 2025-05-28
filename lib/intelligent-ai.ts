// Intelligente KI mit echter Wissensdatenbank
export class IntelligentAI {
  private knowledge: { [key: string]: any } = {
    // Allgemeinwissen
    countries: {
      deutschland: {
        capital: "Berlin",
        population: "83 Millionen",
        language: "Deutsch",
        currency: "Euro",
        facts: "Deutschland ist bekannt für Bier, Autos und Oktoberfest",
      },
      frankreich: {
        capital: "Paris",
        population: "67 Millionen",
        language: "Französisch",
        currency: "Euro",
        facts: "Frankreich ist berühmt für den Eiffelturm und gutes Essen",
      },
      usa: {
        capital: "Washington D.C.",
        population: "331 Millionen",
        language: "Englisch",
        currency: "US-Dollar",
        facts: "Die USA sind bekannt für Hollywood und die Freiheitsstatue",
      },
    },

    // Mathematik
    math: {
      addition: (a: number, b: number) => a + b,
      subtraction: (a: number, b: number) => a - b,
      multiplication: (a: number, b: number) => a * b,
      division: (a: number, b: number) => (b !== 0 ? a / b : "Division durch Null nicht möglich"),
      square: (a: number) => a * a,
      sqrt: (a: number) => (a >= 0 ? Math.sqrt(a) : "Quadraturwurzel aus negativer Zahl nicht möglich"),
    },

    // Programmierung
    programming: {
      javascript: {
        description: "JavaScript ist eine vielseitige Programmiersprache für Web-Entwicklung",
        uses: "Frontend, Backend (Node.js), Mobile Apps",
        difficulty: "Mittel",
        syntax: "C-ähnlich mit dynamischer Typisierung",
      },
      python: {
        description: "Python ist eine einfache und mächtige Programmiersprache",
        uses: "Data Science, AI, Web-Entwicklung, Automatisierung",
        difficulty: "Einfach",
        syntax: "Sehr lesbar und anfängerfreundlich",
      },
      react: {
        description: "React ist eine JavaScript-Bibliothek für Benutzeroberflächen",
        uses: "Frontend Web-Entwicklung, Mobile Apps (React Native)",
        difficulty: "Mittel bis Schwer",
        syntax: "JSX - JavaScript mit HTML-ähnlicher Syntax",
      },
    },

    // Wissenschaft
    science: {
      physics: {
        gravity: "9.81 m/s² auf der Erde",
        lightSpeed: "299.792.458 m/s im Vakuum",
        atoms: "Bestehen aus Protonen, Neutronen und Elektronen",
      },
      chemistry: {
        water: "H2O - zwei Wasserstoff, ein Sauerstoff",
        gold: "Au - chemisches Element mit Ordnungszahl 79",
        oxygen: "O2 - essentiell für das Leben auf der Erde",
      },
    },

    // Geschichte
    history: {
      ww2: {
        start: "1939",
        end: "1945",
        description: "Globaler Konflikt zwischen Achsenmächten und Alliierten",
      },
      berlin_wall: {
        built: "1961",
        fell: "1989",
        description: "Teilte Berlin während des Kalten Krieges",
      },
    },

    // Technologie
    technology: {
      ai: "Künstliche Intelligenz - Simulation menschlicher Intelligenz in Maschinen",
      blockchain: "Dezentrale, unveränderliche Datenbank-Technologie",
      internet: "Globales Netzwerk verbundener Computer",
    },
  }

  private parseQuestion(question: string): { type: string; subject: string; operation?: string; numbers?: number[] } {
    const lowerQuestion = question.toLowerCase()

    // Mathematik erkennen
    const mathPattern = /(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/
    const mathMatch = lowerQuestion.match(mathPattern)

    if (mathMatch) {
      const num1 = Number.parseFloat(mathMatch[1])
      const operator = mathMatch[2]
      const num2 = Number.parseFloat(mathMatch[3])
      return {
        type: "math",
        subject: "calculation",
        operation: operator,
        numbers: [num1, num2],
      }
    }

    // Quadrat/Wurzel
    if (lowerQuestion.includes("quadrat") && lowerQuestion.match(/\d+/)) {
      const num = Number.parseFloat(lowerQuestion.match(/\d+/)?.[0] || "0")
      return { type: "math", subject: "square", numbers: [num] }
    }

    if (lowerQuestion.includes("wurzel") && lowerQuestion.match(/\d+/)) {
      const num = Number.parseFloat(lowerQuestion.match(/\d+/)?.[0] || "0")
      return { type: "math", subject: "sqrt", numbers: [num] }
    }

    // Länder
    for (const country of Object.keys(this.knowledge.countries)) {
      if (lowerQuestion.includes(country)) {
        return { type: "geography", subject: country }
      }
    }

    // Programmiersprachen
    for (const lang of Object.keys(this.knowledge.programming)) {
      if (lowerQuestion.includes(lang)) {
        return { type: "programming", subject: lang }
      }
    }

    // Wissenschaft
    if (lowerQuestion.includes("schwerkraft") || lowerQuestion.includes("gravity")) {
      return { type: "science", subject: "gravity" }
    }
    if (lowerQuestion.includes("lichtgeschwindigkeit") || lowerQuestion.includes("light")) {
      return { type: "science", subject: "lightSpeed" }
    }
    if (lowerQuestion.includes("wasser") || lowerQuestion.includes("h2o")) {
      return { type: "science", subject: "water" }
    }

    // Geschichte
    if (lowerQuestion.includes("weltkrieg") || lowerQuestion.includes("ww2")) {
      return { type: "history", subject: "ww2" }
    }
    if (lowerQuestion.includes("berliner mauer") || lowerQuestion.includes("berlin wall")) {
      return { type: "history", subject: "berlin_wall" }
    }

    // Technologie
    if (
      lowerQuestion.includes("künstliche intelligenz") ||
      lowerQuestion.includes("ki") ||
      lowerQuestion.includes("ai")
    ) {
      return { type: "technology", subject: "ai" }
    }

    // Zeit/Datum
    if (lowerQuestion.includes("uhrzeit") || lowerQuestion.includes("zeit")) {
      return { type: "time", subject: "current" }
    }
    if (lowerQuestion.includes("datum") || lowerQuestion.includes("heute")) {
      return { type: "date", subject: "current" }
    }

    // Wetter (simuliert)
    if (lowerQuestion.includes("wetter")) {
      return { type: "weather", subject: "current" }
    }

    return { type: "unknown", subject: "" }
  }

  public async generateResponse(question: string): Promise<string> {
    // Simuliere Denkzeit
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

    const parsed = this.parseQuestion(question)

    switch (parsed.type) {
      case "math":
        return this.handleMath(parsed)

      case "geography":
        return this.handleGeography(parsed.subject)

      case "programming":
        return this.handleProgramming(parsed.subject)

      case "science":
        return this.handleScience(parsed.subject)

      case "history":
        return this.handleHistory(parsed.subject)

      case "technology":
        return this.handleTechnology(parsed.subject)

      case "time":
        return `Die aktuelle Uhrzeit ist ${new Date().toLocaleTimeString("de-DE")} 🕐`

      case "date":
        return `Heute ist der ${new Date().toLocaleDateString("de-DE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })} 📅`

      case "weather":
        const weathers = ["sonnig ☀️", "bewölkt ☁️", "regnerisch 🌧️", "windig 💨"]
        const randomWeather = weathers[Math.floor(Math.random() * weathers.length)]
        return `Das Wetter ist heute ${randomWeather} (Simulation - ich habe keinen echten Wetterzugang)`

      default:
        return this.handleGeneral(question)
    }
  }

  private handleMath(parsed: any): string {
    const { operation, numbers, subject } = parsed

    if (subject === "square" && numbers) {
      const result = this.knowledge.math.square(numbers[0])
      return `${numbers[0]}² = ${result} 🧮`
    }

    if (subject === "sqrt" && numbers) {
      const result = this.knowledge.math.sqrt(numbers[0])
      return `√${numbers[0]} = ${result} 🧮`
    }

    if (operation && numbers && numbers.length === 2) {
      let result: any
      switch (operation) {
        case "+":
          result = this.knowledge.math.addition(numbers[0], numbers[1])
          break
        case "-":
          result = this.knowledge.math.subtraction(numbers[0], numbers[1])
          break
        case "*":
          result = this.knowledge.math.multiplication(numbers[0], numbers[1])
          break
        case "/":
          result = this.knowledge.math.division(numbers[0], numbers[1])
          break
        default:
          return "Diese mathematische Operation kenne ich nicht 🤔"
      }
      return `${numbers[0]} ${operation} ${numbers[1]} = ${result} 🧮`
    }

    return "Ich konnte die mathematische Aufgabe nicht verstehen 🤔"
  }

  private handleGeography(country: string): string {
    const info = this.knowledge.countries[country]
    if (!info) return `Über ${country} habe ich leider keine Informationen 🌍`

    return `🌍 **${country.charAt(0).toUpperCase() + country.slice(1)}:**
• Hauptstadt: ${info.capital}
• Einwohner: ${info.population}
• Sprache: ${info.language}
• Währung: ${info.currency}
• Interessant: ${info.facts}`
  }

  private handleProgramming(language: string): string {
    const info = this.knowledge.programming[language]
    if (!info) return `Über ${language} habe ich leider keine Informationen 💻`

    return `💻 **${language.charAt(0).toUpperCase() + language.slice(1)}:**
• Beschreibung: ${info.description}
• Verwendung: ${info.uses}
• Schwierigkeit: ${info.difficulty}
• Syntax: ${info.syntax}`
  }

  private handleScience(subject: string): string {
    if (subject === "gravity") {
      return `🌍 Die Schwerkraft auf der Erde beträgt ${this.knowledge.science.physics.gravity}`
    }
    if (subject === "lightSpeed") {
      return `⚡ Die Lichtgeschwindigkeit beträgt ${this.knowledge.science.physics.lightSpeed}`
    }
    if (subject === "water") {
      return `💧 Wasser hat die chemische Formel ${this.knowledge.science.chemistry.water}`
    }
    return "Diese wissenschaftliche Frage kann ich nicht beantworten 🔬"
  }

  private handleHistory(subject: string): string {
    const info = this.knowledge.history[subject]
    if (!info) return "Diese historische Frage kann ich nicht beantworten 📚"

    if (subject === "ww2") {
      return `📚 **Zweiter Weltkrieg:**
• Beginn: ${info.start}
• Ende: ${info.end}
• Beschreibung: ${info.description}`
    }

    if (subject === "berlin_wall") {
      return `📚 **Berliner Mauer:**
• Erbaut: ${info.built}
• Gefallen: ${info.fell}
• Beschreibung: ${info.description}`
    }

    return "Diese historische Information habe ich nicht 📚"
  }

  private handleTechnology(subject: string): string {
    const info = this.knowledge.technology[subject]
    if (!info) return "Über diese Technologie weiß ich nichts 💻"

    return `💻 **${subject.toUpperCase()}:** ${info}`
  }

  private handleGeneral(question: string): string {
    const lowerQuestion = question.toLowerCase()

    // Begrüßungen
    if (lowerQuestion.includes("hallo") || lowerQuestion.includes("hi")) {
      return "Hallo! Ich bin eine intelligente KI. Frag mich gerne etwas über Mathematik, Geographie, Programmierung, Wissenschaft oder Geschichte! 🤖"
    }

    // Name
    if (lowerQuestion.includes("name")) {
      return "Ich bin eine intelligente KI! Du kannst mich einfach 'KI' nennen. Ich kann dir bei vielen Fragen helfen! 🤖"
    }

    // Hilfe
    if (lowerQuestion.includes("hilfe") || lowerQuestion.includes("help")) {
      return `Ich kann dir bei folgenden Themen helfen:
• 🧮 Mathematik (z.B. "Was ist 15 + 27?")
• 🌍 Geographie (z.B. "Was ist die Hauptstadt von Deutschland?")
• 💻 Programmierung (z.B. "Was ist JavaScript?")
• 🔬 Wissenschaft (z.B. "Wie schnell ist Licht?")
• 📚 Geschichte (z.B. "Wann war der 2. Weltkrieg?")
• 🕐 Zeit und Datum
Frag mich einfach!`
    }

    // Fähigkeiten
    if (lowerQuestion.includes("kannst du") || lowerQuestion.includes("was kannst")) {
      return "Ich kann mathematische Berechnungen durchführen, Fragen zu Ländern beantworten, über Programmiersprachen sprechen, wissenschaftliche Fakten erklären und historische Ereignisse beschreiben! Probier es aus! 🚀"
    }

    return "Das ist eine interessante Frage! Leider habe ich dazu keine spezifischen Informationen. Frag mich gerne etwas über Mathematik, Geographie, Programmierung, Wissenschaft oder Geschichte! 🤔"
  }
}
