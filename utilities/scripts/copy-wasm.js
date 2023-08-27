const fs = require('fs')
const path = require('path')

const outFolder = '../../out'
const targetFiles = path.join(
  __dirname,
  '../../out/asset-extractor-wasm_bg.wasm'
)
const sourceFiles = path.join(
  __dirname,
  '../../node_modules/@arbs.io/asset-extractor-wasm/asset-extractor-wasm_bg.wasm'
)

const dir = path.join(__dirname, outFolder)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

fs.copyFile(sourceFiles, targetFiles, (err) => {
  if (err) throw err
  console.log(`copied:\n\t${sourceFiles}\n\t${targetFiles}`)
})
