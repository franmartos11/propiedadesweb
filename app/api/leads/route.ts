import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/data/db';

// POST /api/leads — público, llamado desde el formulario de contacto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, email = '', servicio, mensaje = '' } = body;

    if (!nombre || !telefono || !servicio) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const lead = await saveLead({ nombre, telefono, email, servicio, mensaje });
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/leads]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
