import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabaseClient'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json()

  const { error } = await supabaseClient
    .from('rits')
    .update({
      driver_lat: body.driver_lat,
      driver_lng: body.driver_lng,
      status: body.status ?? 'vertrokken',
    })
    .eq('driver_token', token)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}