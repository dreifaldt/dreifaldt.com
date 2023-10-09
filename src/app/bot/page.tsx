'use client'

import { ChangeEvent, FC, FormEvent, Suspense, useState } from 'react'
import styled from 'styled-components'

import Loading from './loading'
import { theme } from '../../theme/theme'
import { log } from 'console'

type ConversationProps = {
  conversation: string[]
}

export default function BotPage() {
  const [inputValue, setInputValue] = useState('')
  const [conversation, setConversation] = useState<string[]>([])

  const Conversation: FC<ConversationProps> = ({ conversation }) => {
    return (
      <ConversationWrapper>
        {conversation.map((message, index) => (
          <div key={index} style={{ alignSelf: index ? 'start' : 'end' }}>
            {message}
          </div>
        ))}
      </ConversationWrapper>
    )
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setConversation((prevValue) => [...prevValue, inputValue])
    setInputValue('')
  }

  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>&lt; RoBot &gt;</h1>
          <Conversation conversation={conversation} />
          <form onSubmit={handleSubmit}>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <input type="submit" value="Submit" />
          </form>
        </Span>
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
    display: inline-block;
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
      text-decoration-color: #f3a23c;
    }

    .grey {
      color: #1e1e1e;
      margin-top: 18px;
    }
  }
`

const ConversationWrapper = styled.div`
  display: flex;
  margin: 18px;
  padding: 18px;
  background-color: rebeccapurple;
  min-height: 200px;
  min-width: 200px;
  max-width: 500px;
`

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

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
