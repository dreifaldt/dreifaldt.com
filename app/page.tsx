'use client'

import { Suspense } from 'react'
import styled from 'styled-components'
import Loading from './loading'

export default function () {
  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>DREIFALDT CONSULTING</h1>
        </Span>
      </Suspense>
    </Grid>
  )
}

const Grid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-rows: '1fr';
  height: 100vh;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
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
    z-index: 2;
    margin-top: 152px;

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
