import * as vscode from "vscode";
import { getNonce } from "../vscode-utils/webviewServices/getNonce";
import { getUri } from "../vscode-utils/webviewServices/getUri";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, this._extensionUri);

        // Listen for messages from the Sidebar component and execute action
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onFetchText": {
                    const editor = vscode.window.activeTextEditor;

                    if (editor === undefined) {
                        vscode.window.showErrorMessage('No active text editor');
                        return;
                    }

                    const text = editor.document.getText(editor.selection);
                    // send message back to the sidebar component
                    this._view?.webview.postMessage({ type: "onSelectedText", value: text });
                    break;
                }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });

    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const scriptUri = getUri(webview, extensionUri, [
            'out',
            'webview-ui',
            'sidebar',
            'index.js',
        ])
        const nonce = getNonce()

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src * 'self' data: https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <title>Claimset</title>
          </head>
          <body style="margin:0;padding:0">
            <div id="root" />
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `
    }
}
