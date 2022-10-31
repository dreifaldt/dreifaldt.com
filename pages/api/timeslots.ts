// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export const getTimeSlots = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const response = await fetch('https://test.ester.care/ping')
  console.log({ response })
  const data = await response.json()
  console.log({ data })
  return new Response(
    JSON.stringify({
      data: data
    }),
    {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=0, s-maxage=3600, stale-while-revalidate'
      }
    }
  )
}

export default getTimeSlots

export const config = {
  runtime: 'experimental-edge'
}
