import { NextRequest, NextResponse } from 'next/server';
import { updateSettings } from '@/lib/data/settings';
import { decrypt } from '@/lib/auth/session';
import { cookies } from 'next/headers';

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = await decrypt(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = await updateSettings(data);
    return NextResponse.json({ ok: true, settings: updated });
  } catch (err) {
    console.error('[PUT /api/admin/settings]', err);
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 });
  }
}
