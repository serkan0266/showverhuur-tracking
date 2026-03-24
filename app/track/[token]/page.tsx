'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const LiveMap = dynamic(() => import('@/components/tracking/LiveMap'), {
  ssr: false,
})

type TrackData = {
  klantnaam?: string
  telefoon?: string
  adres?: string
  status?: string
  offerte_url?: string
  pakket_naam?: string
  totaal_bedrag?: number
  aanbetaling?: number
  rest_betalen?: number
  betaaltekst?: string
  driver_lat?: number
  driver_lng?: number
  destination_lat?: number
  destination_lng?: number
}

export default function TrackPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const [token, setToken] = useState('')
  const [data, setData] = useState<TrackData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    params.then((p) => setToken(p.token))
  }, [params])

  useEffect(() => {
    if (!token) return

    async function fetchData() {
      const res = await fetch(`/api/tracking/${token}`, {
        cache: 'no-store',
      })

      const json = await res.json()

      if (!res.ok || !json.ok) {
        setError('Kon rit niet laden')
        return
      }

      setData(json.data)
      setError('')
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [token])

  if (error) {
    return <div style={{ padding: 40 }}>{error}</div>
  }

  if (!data) {
    return <div style={{ padding: 40 }}>Laden...</div>
  }

  return (
    <div
      style={{
        background: '#fdfaf5',
        minHeight: '100vh',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1
          style={{
            fontSize: 40,
            marginBottom: 24,
            color: '#1a1a1a',
          }}
        >
          Chauffeur onderweg
        </h1>

        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            border: '1px solid #eee',
          }}
        >
          <div><strong>Klant:</strong> {data.klantnaam}</div>
          <div><strong>Telefoon:</strong> {data.telefoon}</div>
          <div><strong>Adres:</strong> {data.adres}</div>
          <div><strong>Status:</strong> {data.status}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <LiveMap
            driverLat={data.driver_lat}
            driverLng={data.driver_lng}
            destinationLat={data.destination_lat}
            destinationLng={data.destination_lng}
          />
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            border: '1px solid #eee',
          }}
        >
          <h2
            style={{
              fontSize: 24,
              marginBottom: 12,
              color: '#c09657',
            }}
          >
            Offerte overzicht
          </h2>

          <div><strong>Pakket:</strong> {data.pakket_naam}</div>
          <div><strong>Totaalbedrag:</strong> €{data.totaal_bedrag}</div>
          <div><strong>Aanbetaling:</strong> €{data.aanbetaling}</div>
          <div><strong>Nog te betalen op locatie:</strong> €{data.rest_betalen}</div>

          <div style={{ marginTop: 10 }}>
            <strong>Betaalinformatie:</strong> {data.betaaltekst}
          </div>

          {data.offerte_url ? (
            <a
              href={data.offerte_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 18,
                background: '#d4af37',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Bekijk offerte
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}