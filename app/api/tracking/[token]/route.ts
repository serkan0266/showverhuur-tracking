import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

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
      betaaltekst,
      driver_lat,
      driver_lng,
      destination_lat,
      destination_lng
    `)
    .eq('customer_token', token)
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}