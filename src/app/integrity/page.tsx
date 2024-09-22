'use client'
import { Span } from '@/components'
import { Grid } from '@/components/base/grid'
import { createDeletionRequest } from '@/utils/template'
import { useState } from 'react'

export default function Integrity() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [ssn, setSSN] = useState('')
  const [preview, setPreview] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setPreview(true)
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
            <label htmlFor="firstName" className="block text-white">
              First Name
            </label>
            <input
              autoComplete="given-name"
              type="text"
              id="firstName"
              value={firstName}
              placeholder="Enter your first name"
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 text-black placeholder:text-grey-700"
              required
              data-1p-ignore
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-white">
              Last Name
            </label>
            <input
              autoComplete="family-name"
              type="text"
              id="lastName"
              value={lastName}
              placeholder="Enter your last name"
              onChange={(e) => setLastName(e.target.value)}
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
              autoComplete="address"
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
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              autoComplete="email"
              type="email"
              id="Mail"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-black placeholder:text-grey-700"
              required
              data-1p-ignore
            />
          </div>
          <div className="Personnummer">
            <label htmlFor="ssn" className="block text-white">
              Personnummer
            </label>
            <input
              autoComplete="ssn"
              type="ssn"
              id="ssn"
              value={ssn}
              placeholder="Enter your SSN"
              onChange={(e) => setSSN(e.target.value)}
              className="w-full p-2 text-black placeholder:text-grey-700"
              required
              data-1p-ignore
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
            Preview
          </button>
        </form>
      </Span>
      <Span className="m-4">
        {preview && email && firstName && address && lastName && email && (
          <p>{createDeletionRequest({ email, firstName, lastName, ssn })}</p>
        )}
      </Span>
    </Grid>
  )
}
