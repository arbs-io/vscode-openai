import { v4 as uuidv4 } from 'uuid';
import { Uri, workspace } from 'vscode';
import { createDebugNotification, createInfoNotification } from '@app/apis/node';
import { getEmbeddingsForText } from '@app/apis/embedding';
import { IEmbeddingFileLite } from '@app/interfaces';
import { StatusBarServiceProvider } from '@app/apis/vscode';
import { createDocumentParser } from '@arbs.io/asset-extractor-wasm';

export async function embeddingResource(uri: Uri) {
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'sync~spin',
    '- memory-buffer'
  );

  createDebugNotification(`embedding-controller memory-buffer`);
  const bufferArray = await workspace.fs.readFile(uri);

  const documentParser = createDocumentParser(bufferArray);
  if (!documentParser) {
    createInfoNotification('failed to readed buffer');
    return;
  }
  const cfgMap = new Map<string, string>();
  cfgMap.set('path', uri.path);
  cfgMap.set('extension', documentParser.extension);
  cfgMap.set('mimetype', documentParser.mimetype);
  cfgMap.set('length', documentParser?.contents?.text?.length.toString() ?? '0');
  createInfoNotification(Object.fromEntries(cfgMap), 'file_information');

  if (!documentParser?.contents?.text) {return;}

  const embeddingText = await getEmbeddingsForText(documentParser.contents.text);
  createDebugNotification(
    `embedding-controller embedding ${embeddingText.length} (chunks)`
  );

  const fileObject: IEmbeddingFileLite = {
    timestamp: new Date().getTime(),
    embeddingId: uuidv4(),
    name: decodeURIComponent(uri.path).substring(
      decodeURIComponent(uri.path).lastIndexOf('/') + 1
    ),
    url: decodeURIComponent(uri.path),
    type: documentParser.mimetype,
    size: documentParser.contents.text.length,
    expanded: false,
    chunks: embeddingText,
    extractedText: documentParser.contents.text,
  };
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'vscode-openai',
    ''
  );
  return fileObject;
}
