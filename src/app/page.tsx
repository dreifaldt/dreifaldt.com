import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <span>
          <h1>&lt; DREIFALDT &gt;</h1>
        </span>
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
          <div>— Erik</div>
        </div>
      </Suspense>
    </div>
  )
}
