'use client'

import { useState } from 'react'
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
        <input value={title} onInput={(e) => setTitle(e.target.value)} />
        <input
          value={description}
          onInput={(e) => setDescription(e.target.value)}
        />
      </Grid>
      <Button onClick={() => addTodo({ title, description })}>
        <strong>SAVE</strong>
      </Button>

      <div>
        {todos.map((todo, index) => (
          <div key={index}>
            <strong>{todo.title}</strong>
            <p>{todo.description}</p>
          </div>
        ))}
      </div>
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
