import { commands, ExtensionContext, Uri, window } from 'vscode'
import { SidebarProvider } from '../panels/SidebarProvider'
import { PANEL_SIDEBAR_COMMAND_ID } from './openaiCommands'

export function registerSidebarCommand(context: ExtensionContext) {
  _registerCommand(context)
}

function _registerCommand(context: ExtensionContext) {
	// Register the Sidebar Panel
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		window.registerWebviewViewProvider(
			"vscode-openai-sidebar",
			sidebarProvider
		)
	);

	// Register a custom command
	// context.subscriptions.push(commands.registerCommand('myextension.askquestion', async () => {
	// 	let response = await window.showInformationMessage("How are you doing?", "Good", "Bad");
	// 	if (response === "Bad") {
	// 		window.showInformationMessage("I'm sorry");
	// 	}
	// }));

	// context.subscriptions.push(commands.registerCommand('myextension.sayhello', () => {
	// 	window.showInformationMessage("Hello World!");
	// }));

}
