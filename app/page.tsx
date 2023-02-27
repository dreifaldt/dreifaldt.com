'use client'

import { Suspense } from 'react'
import styled from 'styled-components'
import Loading from './loading'
import { theme } from '../theme/theme'
import Link from 'next/link'

export default function Home() {
  return (
    <Grid>
      <Suspense fallback={<Loading />}>
        <Span>
          <h1>&lt; DREIFALDT &gt;</h1>
        </Span>
        <div>
          Information regarding previous endevours can be found on my LinkedIn.
          <br />
          Interested in working with me?
          <Link href="mailto:erik@dreifaldt.com">Let me know by email</Link>.<br />
          Have a great day,
          <br />— Erik
        </div>
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
  background-color: ${theme.colors.black};
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  div {
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
    color: ${theme.colors.white};
    font-size: 60px;

    @media (min-width: ${theme.breakpoints.small}px) {
      font-size: 90px;
    }

    @media (min-width: ${theme.breakpoints.large}px) {
      font-size: 140px;
    }

    :hover {
      cursor: pointer;
    }
  }
`
