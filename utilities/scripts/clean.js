const fs = require('fs')
const path = require('path')

const folders = [
  '../../dist',
  '../../out',
  '../../node_modules',
  '../../webview-ui/conversationsWebview/node_modules',
  '../../webview-ui/messageWebview/node_modules',
]

folders.forEach((folder) => {
  const dir = path.join(__dirname, folder)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
