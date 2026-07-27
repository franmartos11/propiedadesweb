'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/auth/session';

type LoginState = {
  error?: string;
} | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validación básica
  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return { error: 'Credenciales incorrectas.' };
  }

  // Crear sesión JWT en cookie
  await createSession('admin-001', email);

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect('/admin/login');
}
