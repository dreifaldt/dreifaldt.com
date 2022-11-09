'use client'

import styled, { keyframes } from 'styled-components'

const Home = () => {
  return (
    <Grid>
      <Span>
        <h1>DREIFALDT CONSULTING</h1>
      </Span>
      <Span></Span>
    </Grid>
  )
}

export default Home

const Grid = styled.div`
  display: grid;

  height: 100vh;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  background-color: black;
`
const Span = styled.span`
  text-align: center;
  display: flex;
  justify-content: center;
  h1 {
    color: white;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    border-right: solid 3px black;
    margin: 0;

    animation: type 2s steps(26) 1s forwards, blink 0.5s steps(1) infinite;
  }

  @keyframes type {
    to {
      width: 26ch;
    }
  }

  @keyframes blink {
    from {
      border-color: transparent;
    }
    50% {
      border-color: white;
    }
    to {
      border-color: transparent;
    }
  }
`
