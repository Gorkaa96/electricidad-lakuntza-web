import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import LoginForm from './LoginForm';
import { getAdminContext } from '@/lib/admin';

export const metadata = {
  title: 'Acceso al panel',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const { admin } = await getAdminContext();

  if (admin) {
    redirect('/admin/facturas');
  }

  return (
    <main className="min-h-screen bg-[#F3F7F1] px-4 py-12 text-[#152017] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-[1.5rem] border border-[#D8E4D7] bg-white shadow-[0_24px_70px_rgba(21,42,23,.07)] lg:grid-cols-2">
          <section className="brand-dark-surface p-8 text-white sm:p-10 lg:p-14">
            <Logo dark />
            <div className="mt-16">
              <p className="text-sm font-medium text-[#AFE19C]">Área privada</p>
              <h1 className="mt-5 max-w-sm text-4xl font-semibold leading-[1.12] tracking-[-.05em] sm:text-5xl">
                Todo el trabajo, en un lugar.
              </h1>
              <p className="mt-7 max-w-sm text-base leading-8 text-white/70">
                Revisa solicitudes de clientes y gestiona los trabajos publicados desde un panel accesible solo para personal autorizado.
              </p>
            </div>
          </section>
          <section className="p-8 sm:p-10 lg:p-14">
            <div className="my-auto">
              <h2 className="text-3xl font-semibold tracking-[-.04em] text-[#152017]">Acceder al panel</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Utiliza el correo y la contraseña de tu cuenta de administración.
              </p>
              <LoginForm unauthorized={resolvedParams?.error === 'unauthorized'} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
