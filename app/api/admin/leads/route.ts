import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/data/db';
import { decrypt } from '@/lib/auth/session';
import { cookies } from 'next/headers';

// GET /api/admin/leads — protegido, sólo admin
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = await decrypt(token);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const leads = getLeads();
  return NextResponse.json({ leads });
}
