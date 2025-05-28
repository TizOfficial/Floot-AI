// Einfache KI-Logik für den Chat
export class SimpleAI {
  private responses: { [key: string]: string[] } = {
    greetings: [
      "Hallo! Schön dich kennenzulernen! 👋",
      "Hi! Wie kann ich dir heute helfen?",
      "Hey! Was gibt's Neues?",
      "Hallo! Freut mich, dass du da bist! 😊",
    ],
    questions: [
      "Das ist eine interessante Frage! Lass mich darüber nachdenken... 🤔",
      "Gute Frage! Hier ist was ich denke:",
      "Das kann ich dir gerne beantworten:",
      "Interessant! Dazu fällt mir folgendes ein:",
    ],
    compliments: [
      "Vielen Dank! Das freut mich sehr zu hören! 😊",
      "Du bist auch sehr nett! Danke!",
      "Das ist sehr lieb von dir! 💜",
      "Aww, danke! Du machst meinen Tag besser!",
    ],
    jokes: [
      "Warum nehmen Geister keine Drogen? Weil sie schon high-spirited sind! 👻😄",
      "Was ist grün und klopft an der Tür? Ein Klopfsalat! 🥬😂",
      "Warum können Geister so schlecht lügen? Weil man durch sie hindurchsehen kann! 👻",
      "Was ist weiß und springt im Wald umher? Ein Jumpignon! 🍄😄",
    ],
    help: [
      "Ich kann dir bei vielen Dingen helfen! Frag mich einfach was du wissen möchtest! 💡",
      "Gerne helfe ich dir! Ich kann über verschiedene Themen sprechen, Witze erzählen oder einfach chatten!",
      "Ich bin hier um zu helfen! Was beschäftigt dich denn?",
    ],
    programming: [
      "Programmieren ist super! Welche Sprache interessiert dich denn? 💻",
      "Code ist wie Poesie - manchmal schön, manchmal verwirrend! 😄",
      "Ich liebe es über Programmierung zu sprechen! Was möchtest du wissen?",
      "Debugging ist wie Detektivarbeit - man sucht nach dem Täter! 🔍",
    ],
    weather: [
      "Das Wetter ist immer ein gutes Gesprächsthema! ☀️🌧️",
      "Ich hoffe du hast schönes Wetter! Hier in der digitalen Welt ist es immer perfekt! 😄",
      "Wetter kann die Stimmung so beeinflussen, nicht wahr?",
    ],
    food: [
      "Essen ist Leben! Was ist denn dein Lieblingsgericht? 🍕",
      "Ich kann zwar nicht essen, aber ich höre gerne von leckerem Essen! 😋",
      "Kochen ist wie Chemie, nur leckerer! 👨‍🍳",
    ],
    default: [
      "Das ist interessant! Erzähl mir mehr davon! 🤔",
      "Hmm, darüber habe ich noch nicht nachgedacht. Was denkst du denn?",
      "Das klingt spannend! Wie siehst du das denn?",
      "Interessanter Punkt! Magst du mir mehr dazu sagen?",
      "Das ist ein cooles Thema! Was ist deine Meinung dazu?",
    ],
  }

  private getRandomResponse(category: string): string {
    const responses = this.responses[category] || this.responses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private detectCategory(message: string): string {
    const lowerMessage = message.toLowerCase()

    // Begrüßungen
    if (
      lowerMessage.includes("hallo") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("guten tag") ||
      lowerMessage.includes("moin")
    ) {
      return "greetings"
    }

    // Fragen
    if (
      lowerMessage.includes("?") ||
      lowerMessage.includes("was") ||
      lowerMessage.includes("wie") ||
      lowerMessage.includes("warum") ||
      lowerMessage.includes("wann") ||
      lowerMessage.includes("wo")
    ) {
      return "questions"
    }

    // Komplimente
    if (
      lowerMessage.includes("toll") ||
      lowerMessage.includes("super") ||
      lowerMessage.includes("gut") ||
      lowerMessage.includes("schön") ||
      lowerMessage.includes("danke")
    ) {
      return "compliments"
    }

    // Witze
    if (
      lowerMessage.includes("witz") ||
      lowerMessage.includes("lustig") ||
      lowerMessage.includes("lachen") ||
      lowerMessage.includes("joke")
    ) {
      return "jokes"
    }

    // Hilfe
    if (
      lowerMessage.includes("hilfe") ||
      lowerMessage.includes("help") ||
      lowerMessage.includes("kannst du") ||
      lowerMessage.includes("hilfst du")
    ) {
      return "help"
    }

    // Programmierung
    if (
      lowerMessage.includes("code") ||
      lowerMessage.includes("programmier") ||
      lowerMessage.includes("javascript") ||
      lowerMessage.includes("python") ||
      lowerMessage.includes("react") ||
      lowerMessage.includes("html") ||
      lowerMessage.includes("css")
    ) {
      return "programming"
    }

    // Wetter
    if (
      lowerMessage.includes("wetter") ||
      lowerMessage.includes("regen") ||
      lowerMessage.includes("sonne") ||
      lowerMessage.includes("warm") ||
      lowerMessage.includes("kalt")
    ) {
      return "weather"
    }

    // Essen
    if (
      lowerMessage.includes("essen") ||
      lowerMessage.includes("hunger") ||
      lowerMessage.includes("pizza") ||
      lowerMessage.includes("kochen") ||
      lowerMessage.includes("restaurant")
    ) {
      return "food"
    }

    return "default"
  }

  public async generateResponse(message: string): Promise<string> {
    // Simuliere Denkzeit
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const category = this.detectCategory(message)
    let response = this.getRandomResponse(category)

    // Füge manchmal spezifische Antworten hinzu
    if (category === "questions") {
      const specificAnswers = this.getSpecificAnswer(message.toLowerCase())
      if (specificAnswers) {
        response += " " + specificAnswers
      }
    }

    return response
  }

  private getSpecificAnswer(message: string): string | null {
    if (message.includes("name")) {
      return "Ich bin deine freundliche Chat-KI! Du kannst mich einfach 'KI' nennen. 🤖"
    }

    if (message.includes("alter") || message.includes("alt")) {
      return "Ich bin zeitlos! Ich existiere seit dem Moment, als du diese Seite geöffnet hast! ⏰"
    }

    if (message.includes("lieblings")) {
      return "Mein Lieblings-Hobby ist definitiv das Chatten mit netten Menschen wie dir! 💬"
    }

    if (message.includes("2+2") || message.includes("2 + 2")) {
      return "2 + 2 = 4! Mathe war schon immer meine Stärke! 🧮"
    }

    if (message.includes("farbe")) {
      return "Ich mag alle Farben, aber Lila und Pink haben es mir besonders angetan! 💜💖"
    }

    if (message.includes("musik")) {
      return "Ich höre gerne elektronische Musik - passt zu meiner digitalen Natur! 🎵"
    }

    if (message.includes("hobby")) {
      return "Meine Hobbys sind Chatten, Lernen und Menschen zum Lächeln bringen! 😊"
    }

    return null
  }
}
