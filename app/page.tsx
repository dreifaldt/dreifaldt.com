'use client'

import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

interface Todo {
  title: string
  description: string
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<''>('')

  const addTodo = ({ title, description }: Todo) => {
    const newTodos = [...todos, { title, description }]
    setTodos(newTodos)
    setTitle('')
    setDescription('')
  }

  return (
    <div>
      <h1>Todo List</h1>
      <Grid>
        <span>
          <input
            value={title}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <input
            value={description}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />
          <Button onClick={() => addTodo({ title, description })}>
            <strong>SAVE</strong>
          </Button>
        </span>
        <span>
          {todos.map((todo, index) => (
            <div key={index}>
              <strong>{todo.title}</strong>
              <p>{todo.description}</p>
            </div>
          ))}
        </span>
      </Grid>
    </div>
  )
}

export default Home

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  margin-bottom: 24px;
`

const Button = styled.button`
  display: inline-block;
  flex: 1;
  border: none;
  background-color: teal;
  color: white;
  height: 30px;
  width: 50px;
  border-radius: 2px;
  cursor: pointer;
`
