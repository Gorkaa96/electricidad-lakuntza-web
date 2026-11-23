import ActivateAccountForm from './ActivateAccountForm';

export const metadata = { title: 'Activar acceso al panel', robots: { index: false, follow: false } };

export default function ActivateAccountPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F8F4] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#D9E6D5] bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-[#317139]">Electricidad Lakuntza · Área privada</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em]">Activa tu acceso.</h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">Si has recibido una invitación, establece una contraseña personal y segura para entrar en el panel.</p>
        <ActivateAccountForm />
      </div>
    </main>
  );
}
