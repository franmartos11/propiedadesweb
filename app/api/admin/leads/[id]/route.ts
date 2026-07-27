import { NextRequest, NextResponse } from 'next/server';
import { updateLead } from '@/lib/data/db';
import { decrypt } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import type { LeadStatus, Lead } from '@/lib/data/db';

// PATCH /api/admin/leads/[id] — cambiar estado del lead
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = await decrypt(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { estado, notas } = body as { estado?: LeadStatus; notas?: string };

  const updates: Partial<Lead> = {};
  if (estado !== undefined) updates.estado = estado;
  if (notas !== undefined) updates.notas = notas;

  const updated = await updateLead(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: updated });
}
