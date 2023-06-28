let PDFJS: any = null

interface RenderOptions {
  normalizeWhitespace: boolean
  disableCombineTextItems: boolean
}

interface TextContentItem {
  transform: number[]
  str: string
}

interface PageData {
  getTextContent(
    renderOptions: RenderOptions
  ): Promise<{ items: TextContentItem[] }>
}

function render_page(pageData: PageData): Promise<string> {
  const render_options: RenderOptions = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  }

  return pageData.getTextContent(render_options).then(function (textContent) {
    let lastY,
      text = ''

    for (const item of textContent.items) {
      if (lastY == item.transform[5] || !lastY) {
        text += item.str
      } else {
        text += '\n' + item.str
      }
      lastY = item.transform[5]
    }

    return text
  })
}

interface Options {
  pagerender?: typeof render_page
  max?: number
  version?: string
}

const DEFAULT_OPTIONS: Options = {
  pagerender: render_page,
  max: 0,
  version: 'v1.10.100',
}

async function PDF(dataBuffer: any, options?: Options) {
  const ret: {
    numpages: number
    numrender: number
    info: any
    metadata: any
    text: string
    version: any
  } = {
    numpages: 0,
    numrender: 0,
    info: null,
    metadata: null,
    text: '',
    version: null,
  }

  options = options || DEFAULT_OPTIONS

  if (typeof options.pagerender != 'function')
    options.pagerender = DEFAULT_OPTIONS.pagerender

  if (typeof options.max != 'number') options.max = DEFAULT_OPTIONS.max

  if (typeof options.version != 'string')
    options.version = DEFAULT_OPTIONS.version

  if (options.version == 'default') options.version = DEFAULT_OPTIONS.version

  PDFJS = PDFJS ? PDFJS : require(`./pdf.js/${options.version}/build/pdf.js`)

  ret.version = PDFJS.version

  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).

  PDFJS.disableWorker = true
  // PDFJS.workerPort = PDFJS.workerPort === undefined ? null : PDFJS.workerPort
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfjsWorker = require(`./pdf.js/${options.version}/build/pdf.worker.js`)
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker

  const doc: any = await PDFJS.getDocument(dataBuffer)

  ret.numpages = doc.numPages

  const metaData = await doc.getMetadata().catch(function () {
    return null
  })

  ret.info = metaData ? metaData.info : null

  ret.metadata = metaData ? metaData.metadata : null

  let counter = options.max! <= 0 ? doc.numPages : options.max

  counter = counter > doc.numPages ? doc.numPages : counter

  ret.text = ''

  for (let i = 1; i <= counter; i++) {
    const pageText = await doc
      .getPage(i)
      .then((pageData: any) => options!.pagerender!(pageData))
      .catch((err: unknown) => {
        // debugger
        return ''
      })

    ret.text = `${ret.text}\n\n${pageText}`
  }

  ret.numrender = counter

  doc.destroy()

  return ret
}

export default PDF
