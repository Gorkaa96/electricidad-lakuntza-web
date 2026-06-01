import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import LoginForm from './LoginForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Acceso admin',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const supabase = createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (data?.user) {
    redirect('/admin/proyectos');
  }

  return (
    <main className="min-h-screen bg-lakuntza-mist px-4 py-10 text-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.2rem] border border-neutral-200 bg-white shadow-2xl lg:grid-cols-2">
          <section className="bg-neutral-950 p-8 text-white sm:p-10 lg:p-12">
            <Logo dark />
            <div className="mt-14">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-lakuntza-green">Panel privado</p>
              <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">
                Gestión de trabajos realizados.
              </h1>
              <p className="mt-6 text-base leading-8 text-white/65">
                Acceso reservado para gestionar proyectos, textos e imágenes que se publican en la web de Electricidad Lakuntza.
              </p>
            </div>
          </section>

          <section className="p-8 sm:p-10 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Acceso</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950">Entrar al panel</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Usa el usuario autorizado en Supabase. No hay registro público para mantener el panel seguro.
            </p>
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}
