'use client'

import { useEffect, useRef, useState } from 'react'

export default function DriverPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('nieuw')
  const [melding, setMelding] = useState('')
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    params.then((p) => setToken(p.token))
  }, [params])

  async function sendLocation(lat: number, lng: number, newStatus = 'vertrokken') {
    const res = await fetch(`/api/driver/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        driver_lat: lat,
        driver_lng: lng,
        status: newStatus,
      }),
    })

    const json = await res.json()

    if (json.ok) {
      setMelding('Locatie bijgewerkt')
      setStatus(newStatus)
    } else {
      setMelding('Fout bij versturen locatie')
    }
  }

  function startTracking() {
    if (!navigator.geolocation) {
      setMelding('Locatie werkt niet op dit apparaat')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        await sendLocation(lat, lng, 'vertrokken')
      },
      () => {
        setMelding('Kon locatie niet ophalen')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    )

    watchIdRef.current = watchId
    setMelding('Tracking gestart')
    setStatus('vertrokken')
  }

  function stopTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setStatus('gearriveerd')
    setMelding('Tracking gestopt')
  }

  return (
    <div style={{ padding: 30, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 34, marginBottom: 20 }}>Chauffeur tracking</h1>

      <div style={{ marginBottom: 15 }}>
        <strong>Status:</strong> {status}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={startTracking}
          style={{
            background: '#d4af37',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 18px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Vertrokken
        </button>

        <button
          onClick={stopTracking}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 18px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Gearriveerd
        </button>
      </div>

      <div style={{ marginTop: 20 }}>{melding}</div>
    </div>
  )
}