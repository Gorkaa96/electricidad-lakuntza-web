import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Diagnóstico técnico',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

function envStatus(name) {
  const value = process.env[name];
  return {
    name,
    configured: Boolean(value && value.trim()),
    length: value ? value.length : 0,
  };
}

function statusBadge(configured) {
  return configured
    ? 'bg-[#F3FAEF] text-lakuntza-greenDark'
    : 'bg-red-50 text-red-700';
}

export default async function AdminDiagnosticsPage() {
  await requireAdmin();

  const envs = [
    envStatus('OPENAI_API_KEY'),
    envStatus('OPENAI_OCR_MODEL'),
    envStatus('NEXT_PUBLIC_SUPABASE_URL'),
    envStatus('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  ];

  const openaiConfigured = envs.find((item) => item.name === 'OPENAI_API_KEY')?.configured;
  const model = process.env.OPENAI_OCR_MODEL || 'gpt-5.5';

  return (
    <AdminShell title="Diagnóstico técnico" description="Comprueba qué variables ve realmente el runtime de producción.">
      <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">OCR</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">Estado de OpenAI</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Esta página no muestra secretos ni claves. Solo indica si el servidor de producción detecta la variable necesaria para procesar OCR.
            </p>
          </div>
          <span className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${statusBadge(openaiConfigured)}`}>
            {openaiConfigured ? 'OpenAI configurado' : 'OpenAI no detectado'}
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {envs.map((env) => (
            <div key={env.name} className="rounded-2xl bg-neutral-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">{env.name}</p>
              <p className="mt-2 text-sm font-black text-neutral-900">{env.configured ? 'Detectada' : 'No detectada'}</p>
              <p className="mt-1 text-xs text-neutral-500">Longitud detectada: {env.length}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 text-sm leading-7 text-neutral-700">
          <p><strong>Modelo OCR:</strong> {model}</p>
          <p><strong>Entorno:</strong> producción / server runtime</p>
          <p><strong>Fecha de comprobación:</strong> {new Date().toLocaleString('es-ES')}</p>
        </div>

        {!openaiConfigured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <p className="font-black">Qué revisar en Vercel:</p>
            <p>1. Que la variable se llama exactamente OPENAI_API_KEY.</p>
            <p>2. Que está activada para Production.</p>
            <p>3. Que el proyecto correcto es electricidad-lakuntza-web.</p>
            <p>4. Que se ha hecho redeploy después de crearla.</p>
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
