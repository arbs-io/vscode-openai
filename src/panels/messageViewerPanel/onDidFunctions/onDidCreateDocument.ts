import { ICodeDocument } from '@app/interfaces';
import { ViewColumn, window, workspace } from 'vscode';

export const onDidCreateDocument = (codeDocument: ICodeDocument): void => {
  workspace
    .openTextDocument({
      content: codeDocument.content,
      language: codeDocument.language,
    })
    .then((doc) =>
      window.showTextDocument(doc, {
        preserveFocus: true,
        preview: false,
        viewColumn: ViewColumn.Beside,
      })
    );
};
