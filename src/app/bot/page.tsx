'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import styled from 'styled-components'

import Loading from './loading'

// how do I change this import to be @/components?

import { theme } from '@/theme'
import { Message, Sender } from '@/components/form/types'
import { MessageList, Form, MessageItem } from '@/components'

export default function BotPage() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello, I am Vendy. How can I help you?', sender: Sender.bot },
  ])

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessages((prevValue) => [...prevValue, { text: value, sender: Sender.user }])
    setValue('')
  }

  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>&lt; Vendy &gt;</h1>
          <MessageList>
            <h2>Messages:</h2>
            <ul>
              {messages?.length > 0 &&
                messages.map(({ sender, text }, index) => (
                  <MessageItem key={index} sender={sender} text={text}>
                    {text}
                  </MessageItem>
                ))}
            </ul>
          </MessageList>
        </Span>

        <Form value={value} onSubmit={handleSubmit} onChange={handleInputChange} />
      </Suspense>
    </Grid>
  )
}

const Grid = styled.div`
  background-color: ${theme.colors.black};
  display: flex;
  flex: 1;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px;

  div {
    line-height: 32px;
    color: ${theme.colors.white};
    font-size: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;

    .blue-underline {
      text-decoration: underline;
      text-decoration-color: #3785f7;
    }

    .orange-underline {
      text-decoration: underline;
      text-decoration-color: {theme.colors.accent};
    }

    .grey {
      color: #1e1e1e;
      margin-top: 18px;
    }
  }
`

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h1 {
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: ${theme.colors.white};
    font-size: 38px;

    @media (min-width: ${theme.breakpoints.small}px) {
      font-size: 86px;
    }

    @media (min-width: ${theme.breakpoints.large}px) {
      font-size: 110px;
    }

    :hover {
      cursor: pointer;
    }
  }
`
