'use client'

import { Suspense } from 'react'
import styled from 'styled-components'
import Loading from '../loading'

export default function SynvestPage() {
  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>&lt; Synvest &gt;</h1>
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
  background-color: 'black';
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px;

  div {
    line-height: 32px;
    display: inline;
    color: 'white';
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
    }
  }
`

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: 'white';
    font-size: 38px;

    @media (min-width: 640px) {
      font-size: 86px;
    }

    @media (min-width: 1024px) {
      font-size: 110px;
    }

    :hover {
      cursor: pointer;
    }
  }
`
