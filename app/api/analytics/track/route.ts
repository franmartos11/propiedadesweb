import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/data/analytics';
import type { AnalyticsEventType } from '@/lib/data/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, propertyId, propertyType } = body as {
      type: AnalyticsEventType;
      propertyId: string;
      propertyType: 'Venta' | 'Arriendo';
    };

    if (!type || !propertyId || !propertyType) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const event = trackEvent({ type, propertyId, propertyType });
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    console.error('[POST /api/analytics/track]', err);
    return NextResponse.json({ error: 'Error al registrar evento' }, { status: 500 });
  }
}
