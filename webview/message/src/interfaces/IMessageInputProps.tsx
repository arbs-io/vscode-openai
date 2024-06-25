import { IChatCompletion } from '.'

export interface IMessageInputProps {
  onSubmit: (message: IChatCompletion) => void
}
