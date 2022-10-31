// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export const getTimeSlots = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const response = await fetch(`${process.env.API_HOST}/ping`)
  const data = await response.json()
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600, stale-while-revalidate'
    }
  })
}

export default getTimeSlots

export const config = {
  runtime: 'experimental-edge'
}
