// This is a class called OpenaiActivityBarCommand that implements the ICommandOpenai interface.
// It has a constructor that takes in two parameters: context of type ExtensionContext and facade of type OpenaiActivityBarFacade.
// The class has one method called execute() which does not take any input parameters and does not return anything.

import { ExtensionContext } from 'vscode'
import { OpenaiActivityBarFacade } from './openaiActivityBarFacade'
import { ICommandOpenai } from '@app/interfaces'

export class OpenaiActivityBarCommand implements ICommandOpenai {
  private context: ExtensionContext
  private facade: OpenaiActivityBarFacade

  // Constructor for the OpenaiActivityBarCommand class.
  // @param context - An object of type ExtensionContext representing the extension's context.
  // @param facade - An object of type OpenaiActivityBarFacade representing the activity bar facade.
  constructor(context: ExtensionContext, facade: OpenaiActivityBarFacade) {
    this.context = context
    this.facade = facade
  }

  // Method to execute the command associated with this instance of the class.
  // This method registers all views using the activity bar facade object passed in through the constructor.
  // @returns void
  execute() {
    this.facade.registerAllViews(this.context)
  }
}
