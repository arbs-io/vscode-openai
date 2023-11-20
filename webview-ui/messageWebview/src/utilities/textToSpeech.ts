export function activateTextToSpeech(text: string) {
  try {
    const voices = window.speechSynthesis.getVoices()
    const enVoices = voices.find(({ lang }) => lang.indexOf('en') !== -1)
    const msg = new SpeechSynthesisUtterance()
    msg.text = text
    msg.voice = enVoices!
    msg.volume = 1 // From 0 to 1
    msg.rate = 5 // From 0.1 to 10
    msg.pitch = 1 // From 0 to 2
    msg.lang = 'en-US'
    window.speechSynthesis.speak(msg)
  } catch (error) {
    console.error(error)
  }
}
