// components/Form.js
import { theme } from '@/theme'
import { FC, FormEvent } from 'react'
import styled from 'styled-components'
import { FormProps, Message } from './types'

const FormWrapper = styled.form`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${theme.colors.cta};
  border-radius: 4px;
  min-width: 400px;
`

const SubmitButton = styled.button`
  background-color: ${theme.colors.success};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`

export const MessageList = styled.div`
  margin-top: 20px;
  min-width: 500px;
  min-height: 200px;
  padding: 8px;
  margin: 8px;
  border: 2px solid ${theme.colors.success};
  border-radius: 8px;
  background-color: ${theme.colors.background};

  h2 {
    font-size: 20px;
    color: ${theme.colors.error};
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 5px 0;
  }
`
export const MessageItem = styled.li<Message>`
  margin: 5px 0;
  text-align: ${(props) => (props.sender === 'user' ? 'right' : 'left')};
  font-size: 16px;
  color: ${(props) => (props.sender === 'user' ? theme.colors.white : theme.colors.cta)};
  font-weight: ${(props) => (props.sender === 'user' ? 500 : 250)};
`

export const Form: FC<FormProps> = ({ value, onChange, onSubmit }) => {
  return (
    <FormWrapper onSubmit={onSubmit}>
      <Input value={value} placeholder="Ask your question" onChange={onChange} />
      <SubmitButton type="submit">
        <span style={{ fontSize: 18 }}>&#8594;</span>
      </SubmitButton>
    </FormWrapper>
  )
}
