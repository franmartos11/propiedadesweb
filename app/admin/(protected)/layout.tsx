import { requireAuth } from '@/lib/auth/session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-[#111111] flex">
      <AdminSidebar email={session.email} />
      {/* Main content area — shifted right by sidebar width */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}
