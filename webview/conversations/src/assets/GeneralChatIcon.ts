export const GeneralChatIcon = (fillColor: string): string => {
  const iconDataUrl = `data:image/svg+xml;base64,${btoa(`
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
  fill="${fillColor}">
  <path
    d="M14.5 2h-13l-.5.5v9l.5.5H4v2.5l.854.354L7.707 12H14.5l.5-.5v-9l-.5-.5zm-.5 9H7.5l-.354.146L5 13.293V11.5l-.5-.5H2V3h12v8z" />
</svg>
  `)}`

  return iconDataUrl
}
