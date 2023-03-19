// import { EventEmitter, Event } from 'vscode'
// import { IConversation, IPersonaOpenAI, IChatMessage } from '../interfaces'

// export class Conversation implements IConversation {
//   private _emitterDidChange = new EventEmitter<IConversation>()
//   readonly onDidChange: Event<IConversation> = this._emitterDidChange.event

//   private _conversationId: string
//   private _persona: IPersonaOpenAI
//   private _summary: string
//   private _chatMessages: IChatMessage[]

//   public get conversationId(): string {
//     return this._conversationId
//   }
//   public set conversationId(value: string) {
//     this._conversationId = value
//     this._emitterDidChange.fire(this)
//   }

//   public get persona(): IPersonaOpenAI {
//     return this._persona
//   }
//   public set persona(value: IPersonaOpenAI) {
//     this._persona = value
//     this._emitterDidChange.fire(this)
//   }

//   public get summary(): string {
//     return this._summary
//     this._emitterDidChange.fire(this)
//   }
//   public set summary(value: string) {
//     this._summary = value
//     this._emitterDidChange.fire(this)
//   }

//   public get chatMessages(): IChatMessage[] {
//     return this._chatMessages
//   }
//   public set chatMessages(value: IChatMessage[]) {
//     this._chatMessages = value
//     this._emitterDidChange.fire(this)
//   }

//   constructor(
//     conversationId: string,
//     persona: IPersonaOpenAI,
//     summary: string,
//     chatMessages: IChatMessage[]
//   ) {
//     this._conversationId = conversationId
//     this._persona = persona
//     this._summary = summary
//     this._chatMessages = chatMessages
//   }
// }
