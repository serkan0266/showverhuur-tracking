import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient'

export async function GET() {
  const { data, error } = await supabaseClient
    .from('rits')
    .select(`
      klantnaam,
      telefoon,
      adres,
      status,
      offerte_url,
      pakket_naam,
      totaal_bedrag,
      aanbetaling,
      rest_betalen,
      betaaltekst
    `)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message })
  }

  return NextResponse.json({ ok: true, data })
}