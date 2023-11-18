'use client'

import { Suspense } from 'react'
import Loading from './loading'

export default function SecretsPage() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <span>
          <h1>&lt; SECRETS &gt;</h1>
        </span>
      </Suspense>
    </div>
  )
}
