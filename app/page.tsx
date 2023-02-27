'use client'

import { Suspense } from 'react'
import styled from 'styled-components'
import Loading from './loading'
import { theme } from '../theme/theme'

export default function Home() {
  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>&lt; DREIFALDT &gt;</h1>
        </Span>
      </Suspense>
    </Grid>
  )
}

const Grid = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: white;
    font-size: 60px;

    @media (min-width: ${theme.breakpoints.small}px) {
      font-size: 90px;
    }

    @media (min-width: ${theme.breakpoints.large}px) {
      font-size: 140px;
    }
  }
`
