// Layout raíz de /admin — sin verificación de sesión aquí.
// La protección está en app/admin/(protected)/layout.tsx via route groups.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
