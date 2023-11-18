'use client'

import { Suspense } from 'react'
import styled from 'styled-components'
import Loading from './loading'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>&lt; DREIFALDT &gt;</h1>
        </Span>
        <div>
          Information regarding previous endevours can be found on my{' '}
          <Link href="https://www.linkedin.com/in/erik-dreifaldt-293a0795/">
            <div className="blue-underline">LinkedIn</div>
          </Link>
          .
          <br />
          <br />
          Interested in working with me?{' '}
          <Link href="mailto:erik@dreifaldt.com">
            <div className="orange-underline">Let me know by email</div>
          </Link>
          .<br />
          <br />
          Have a great day,
          <br />
          <div className="grey">— Erik</div>
        </div>
      </Suspense>
    </Grid>
  )
}

const Grid = styled.div`
  background-color: 'black';
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
    color: white;
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

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;
    color: white;
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
