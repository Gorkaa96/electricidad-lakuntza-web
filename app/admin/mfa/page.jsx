import { redirect } from 'next/navigation';
import { getAdminContext } from '@/lib/admin';
import MfaChallenge from './MfaChallenge';

export const metadata = { title: 'Verificación de acceso', robots: { index: false, follow: false } };

export default async function MfaPage() {
  // The staged UI is unavailable until Auth, RLS and recovery are tested.
  if (process.env.CRM_MFA_ROLLOUT_ENABLED !== 'true') redirect('/admin/entrada');
  const { user, admin, mfaRequired } = await getAdminContext();
  if (!user) redirect('/admin/login');
  if (!mfaRequired) {
    if (admin) redirect('/admin/entrada');
    redirect('/admin/login?error=unauthorized');
  }

  return (
    <main className="min-h-screen bg-[#F3F7F1] px-4 py-12 text-[#152017]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#D8E4D7] bg-white p-7 shadow-xl sm:p-10">
        <p className="text-sm font-semibold text-[#24652C]">Electricidad Lakuntza · Área privada</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Verificación en dos pasos</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          Escribe el código de seis cifras de tu aplicación de autenticación para acceder al CRM.
        </p>
        <MfaChallenge />
      </div>
    </main>
  );
}
