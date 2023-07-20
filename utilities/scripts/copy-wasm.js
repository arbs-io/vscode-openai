const fs = require('fs')

const targetFiles = './out/extract-text-content-wasm_bg.wasm'
const sourceFiles =
  './node_modules/@arbs.io/extract-text-content-wasm/extract-text-content-wasm_bg.wasm'

fs.copyFile(sourceFiles, targetFiles, (err) => {
  if (err) throw err
  console.log(`copied:\n\t${sourceFiles}\n\t${targetFiles}`)
})

// sourceFiles.forEach((file) => {
//   const source = path.join(__dirname, file)
//   if (fs.existsSync(source)) {
//     fs.copyFile(source, 'destination.txt', (err) => {
//       if (err) throw err
//       console.log(`copied ${source}`)
//     })
//   }
// })
