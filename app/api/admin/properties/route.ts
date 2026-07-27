import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/lib/data/db';
import { decrypt } from '@/lib/auth/session';
import { cookies } from 'next/headers';

export async function GET() {
  const props = getProperties();
  return NextResponse.json({ properties: props });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = await decrypt(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const newProp = createProperty(data);
    return NextResponse.json({ ok: true, property: newProp }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/properties]', err);
    return NextResponse.json({ error: 'Error al crear la propiedad' }, { status: 500 });
  }
}
