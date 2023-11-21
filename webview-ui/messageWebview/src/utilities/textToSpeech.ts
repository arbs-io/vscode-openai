export class TextToSpeech {
  private static instance: TextToSpeech | null = null
  private speechSynthesis: SpeechSynthesis

  private constructor() {
    this.speechSynthesis = window.speechSynthesis
  }

  public static getInstance(): TextToSpeech {
    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech()
    }
    return TextToSpeech.instance
  }

  public activateTextToSpeech(text: string): void {
    try {
      const voices = this.speechSynthesis.getVoices()
      const enVoices = voices.find(({ lang }) => lang.indexOf('en') !== -1)

      const msg = this.buildSpeechSynthesisUtterance(text)
      msg.voice = enVoices!
      msg.lang = 'en-US'

      this.speechSynthesis.speak(msg)
    } catch (error) {
      console.error(error)
    }
  }

  private buildSpeechSynthesisUtterance(
    text: string
  ): SpeechSynthesisUtterance {
    const msg = new SpeechSynthesisUtterance(text)
    msg.volume = 1
    msg.rate = 2
    msg.pitch = 1
    return msg
  }
}
