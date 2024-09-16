import { Span } from '@/components'
import { Grid } from '@/components/base/grid'

export default function Integrity() {
  return (
    <div>
      <h1>Integritet</h1>
      <form action="/search">
        <input name="query" />
        <button type="submit">Submit</button>
      </form>
      <Grid>
        <Span span={6}>
          <h1>Integritetshantering</h1>
          <p>Denna sida är till för att göra det enklare för personer att avregistrera sig från personuppgiftssidor.</p>
        </Span>
        <Span span={6}>
          <div className="w-auto h-40 bg-red-700" />
        </Span>
        <Span span={8}>
          <div className="w-auto h-40 bg-orange-300" />
        </Span>
      </Grid>
    </div>
  )
}
