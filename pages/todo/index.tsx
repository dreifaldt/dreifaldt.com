import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

export default function Todo() {
  const [list, setList] = useState<{ title: string; description: string }[]>([])
  return (
    <Grid>
      <p style={{ background: '#891b1b', display: 'flex', flexShrink: 1 }}>
        TEST GRID
      </p>
      <p>TEST GRID</p>
      <p>TEST GRID</p>

      {/* <form>
        <label>
          Title:
          <input type='text' name='name' />
        </label>
        <input type='submit' value='Submit' />
      </form>
      <form>
        <label>
          description:
          <input type='text' name='name' />
        </label>
        <input type='submit' value='Submit' />
      </form> */}
    </Grid>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1fr, 2);
`
