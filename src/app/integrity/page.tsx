'use client'
import { Span } from '@/components'
import { Grid } from '@/components/base/grid'
import { useState } from 'react'

export default function Integrity() {
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Full Name:', fullName)
    console.log('Address:', address)
  }

  return (
    <Grid>
      <Span>
        <div className="m-4">
          <h1 className="font-mono font-bold text-3xl pb-2 break-words">Integritetshantering</h1>
          <p className="self-start">
            Denna sida göra det enklare för personer att avregistrera sig från personuppgiftssidor.
          </p>
        </div>
      </Span>
      <Span>
        <form onSubmit={handleSubmit} className="w-auto h-auto bg-slate-600 p-4 m-4 rounded-lg">
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-white">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              placeholder="Enter your full name"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 text-black placeholder:text-grey-700"
              required
              data-1p-ignore
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              placeholder="Enter your address"
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 text-black placeholder:text-grey-700"
              required
              data-1p-ignore
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Submit
          </button>
        </form>
      </Span>
    </Grid>
  )
}
