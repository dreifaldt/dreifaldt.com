import { ChangeEventHandler, FormEvent, FormEventHandler } from 'react'

export interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

export enum Sender {
  user = 'user',
  bot = 'bot',
}

export type Message = {
  text: string
  sender: Sender
}
